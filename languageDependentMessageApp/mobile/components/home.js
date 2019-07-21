import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

export default class HomeScreen extends Component{

    static navigationOptions = {
        header: null
    }

    
    render(){
        const {navigate} = this.props.navigation;
        return(
            <View>
                <Text style = {{height: 40, width: 400, textAlign: "center" }}>
                    Welcome to MyChatApp
                </Text>
                <Text style = {{height: 40, width: 400, textAlign: "center"}}>
                    Click the Signin button to Sign In
                </Text>
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => navigate('Login')}
                    title="Sign In"
                />
                <Text style = {{height : 40, width : 400, textAlign: "center"}} onPress = {() => navigate('Signup')}>
                    New to the app? Signup here!
                </Text>
            </View>
        )
    }
}