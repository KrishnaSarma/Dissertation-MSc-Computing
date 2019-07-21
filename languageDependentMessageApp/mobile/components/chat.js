import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';
import io from "socket.io-client";

export default class LoginScreen extends Component{

    componentDidMount() {
        this.socket = io('http://192.168.0.13:3000');
        this.socket.on("Chat Message", msg => {
          this.setState({ chatMessages: [...this.state.chatMessages, msg] });
          console.log(this.state.chatMessages);
        });
        
    }
    
    submitChatMessage(){
        // investigate if reciever id can be sent to the server alongwith the message.
        // update the chat list from the response
        this.socket.emit("Chat Message", this.state.chatMessage);
        this.setState({ chatMessage: "" })
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <View>
                <Text style = {{height: 40, width: 50}}>
                    "Chat Screen"
                </Text>
                {/* <Button 
                    style={{ height = 40, width = 40 }}
                    onPress={() => navigate('Chat')}
                    title="Login"
                /> */}
            </View>
        )
    }
}