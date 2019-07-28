import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import io from "socket.io-client";

export default class UsersScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: ""
        };
    }

    componentDidMount = async () => {
        this.socket = io('http://192.168.0.10:3000');
        await this.getUsername();
        console.log("uname to send", this.state.username);
        this.socket.emit("User Name", this.state.username);
    }

    getUsername = async () => {
        try{
            const user = await AsyncStorage.getItem('username')
            console.log("username in user screen", user);
            await this.setState({
                username: user
            })
            console.log("username in state", this.state.username)
        }
        catch(e){
            console.log(e);
        }
        
    }
    
    removeValue = async () => {
        try {
            await AsyncStorage.removeItem('isLoggedIn')
            await AsyncStorage.removeItem('username')
        } catch(e) {
            console.log(e)
        }
    }

    logout = async (navigate) => {
        // const {navigate} = this.props.navigation;
        console.log('logout pressed');
        await this.socket.disconnect();
        this.removeValue()
        navigate("Home")
    }
    render(){

        const {navigate} = this.props.navigation;
        console.log("socket", this.socket)        
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
                    onPress={() => navigate('Chat', {
                        socket: this.socket
                    })}
                    title="Go to chat"
                />
            </View>
        )
    }
}