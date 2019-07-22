import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export default class UsersScreen extends Component{
    
    removeValue = async () => {
        try {
            await AsyncStorage.removeItem('isLoggedIn')
            await AsyncStorage.removeItem('username')
        } catch(e) {
            console.log(e)
        }
    }

    logout(navigate){
        // const {navigate} = this.props.navigation;
        console.log('logout pressed');
        this.removeValue()
        navigate("Home")
    }
    render(){

        const {navigate} = this.props.navigation;
        
        return(
            <View>
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => this.logout(navigate)}
                    title="Logout"
                />
                <Text style = {{height: 40, width: 50}}>
                    "User Screen"
                </Text>
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => navigate('Chat')}
                    title="Go to chat"
                />
            </View>
        )
    }
}