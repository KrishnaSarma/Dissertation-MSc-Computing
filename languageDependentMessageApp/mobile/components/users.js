import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

export default class LoginScreen extends Component{

    static navigationOptions = {
        header: null
    }
    
    render(){
        const {navigate} = this.props.navigation;
        return(
            <View>
                <Text style = {{height: 40, width: 50}}>
                    "User Screen"
                </Text>
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => navigate('Chat')}
                    title="Login"
                />
            </View>
        )
    }
}