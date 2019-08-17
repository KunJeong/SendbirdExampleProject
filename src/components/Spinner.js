import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
// import SpinnerComponent from 'react-native-loading-spinner-overlay';

class Spinner extends Component {
    render() {
        return (
            <ActivityIndicator 
                animating={this.props.visible} color= '#fff'
            />
        )
    }
}

export { Spinner };
