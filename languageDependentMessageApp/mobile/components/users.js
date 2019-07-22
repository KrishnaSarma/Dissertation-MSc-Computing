import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


export default class LoginScreen extends Component{

    static navigationOptions = {
        header: null
    }
    
    removeValue = async () => {
        console.log('remove value called');
        try {
            await AsyncStorage.removeItem('@isLoggedIn')
        } catch(e) {
            console.log(e)
        }
    }

    logout(){
        const {navigate} = this.props.navigation;
        console.log('logout pressed');
        this.removeValue()
        navigate("Home")
    }
    render(){
        
        return(
            <View>
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={()=>{
                        this.logout()
                    }}
                    title="Logout"
                />
                <Text style = {{height: 40, width: 50}}>
                    "User Screen"
                </Text>
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() =>
                        {   
                            console.log('chat button called')
                            navigate('Chat')
                        } }
                    title="Login"
                />
            </View>
        )
    }
}