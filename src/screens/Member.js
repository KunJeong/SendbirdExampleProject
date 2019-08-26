import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { 
    initMember, 
    getParticipantList, 
    getMemberList 
} from '../actions';
import { Button, Spinner, ListItem, Avatar } from '../components';
import { sbCreateParticipantListQuery } from '../sendbirdActions';

class Member extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            title: params.isOpenChannel ? 'Participants' : 'Members',
            headerLeft: (
                <Button 
                    containerViewStyle={{marginLeft: 0, marginRight: 0}}
                    buttonStyle={{paddingLeft: 14}}
                    icon={{ name: 'chevron-left', type: 'font-awesome', color: '#7d62d9', size: 18 }}
                    backgroundColor='transparent'
                    onPress={ () => navigation.goBack() }
                />
            )
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            participantListQuery: null,
            list: []
        }
    }

    componentDidMount() {
        this._initMember();
    }

    componentWillReceiveProps(props) {
        const { list } = props;
        
        if (list !== this.props.list) {        
            const newList = [...this.state.list, ...list];
            this.setState({ isLoading: false, list: newList });
        }
    }
    
    _initMember = () => {
        this.props.initMember();
        this._getMemberList(true);
    }

    _getMemberList = (init) => {
        const { isOpenChannel } = this.props.navigation.state.params;
        if (isOpenChannel) {
            this._getOpenChannelParticipantList(init);
        } else {
            this._getGroupChannelMemberList();
        }
    }

    _getOpenChannelParticipantList = (init) => {
        if (!init && !this.state.participantListQuery) {
            return;
        }
        const { isOpenChannel, channelUrl } = this.props.navigation.state.params;
        this.setState({ isLoading: true }, () => {
            if (init) {
                sbCreateParticipantListQuery(channelUrl)
                .then((participantListQuery) => {
                    this.setState({ participantListQuery }, () => {
                        this.props.getParticipantList(this.state.participantListQuery);
                    });
                })
                .catch( (error) => this.props.navigation.goBack() )
            } else {
                this.props.getParticipantList(this.state.participantListQuery);
            }
        })
    }

    _getGroupChannelMemberList = () => {
        const { channelUrl } = this.props.navigation.state.params;
        this.setState({ isLoading: true, list: [] }, () => {
            this.props.getMemberList(channelUrl);
        });
    }    
    
    _renderList = (rowData) => {
        const user = rowData.item
        return (
            <ListItem
                containerStyle={{backgroundColor: '#fff'}}
                avatar={(
                    <Avatar 
                        rounded
                        source={user.profileUrl ? {uri: user.profileUrl} : require('../img/icon_sb_68.png')} 
                    />
                )}
                title={user.nickname}
                titleStyle={{fontWeight: '500', fontSize: 16}}
                rightTitle={user.isOnline}
                rightTitleStyle={{color: user.isOnline === 'online' ? '#37b24d' : '#878D99'}}
                rightIcon={<Text></Text>}
            />
        )
    }

    render() {
        return (
            <View>
                <Spinner visible={this.state.isLoading} />
                <FlatList
                    enableEmptySections={true}
                    renderItem={this._renderList}
                    data={this.state.list}
                    onEndReached={() => this._getMemberList(false)}
                    onEndReachedThreshold={-50}
                />
            </View>
        )
    }
}

const styles = {
};

// const ds = new ListView.DataSource({
//     rowHasChanged: (r1, r2) => r1 !== r2
// })

function mapStateToProps({ member }) {
    const { list } = member;
    return { list };
}

export default connect(
    mapStateToProps, 
    { 
        initMember, 
        getParticipantList, 
        getMemberList 
    }
)(Member);
