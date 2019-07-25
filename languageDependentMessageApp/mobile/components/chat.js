import React, {Component} from 'react';
import {Text, View, Button, Tex, StyleSheet, TextInput} from 'react-native';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';

export default class ChatScreen extends Component{

    
    constructor(props) {
        super(props);
        this.state = {
        chatMessage: "",
        chatMessages: [],
        username: ""
        };
    }

    componentDidMount = async () => {
        this.socket = io('http://192.168.0.10:3000');
        await this.getUsername();
        // this.socket.emit("User Name", {
        //     sen: this.state.username,
        //     rec: "krishna"
        // })

        this.socket.emit("User Name", this.state.username);
        this.socket.on("Chat Message", msg => {
            this.setState({ chatMessages: [...this.state.chatMessages, JSON.stringify(msg)] });
            console.log(this.state.chatMessages);
        });
        this.socket.on("previousMessages", messages => {
            this.setState({
                chatMessages: messages
            })
            console.log("prev messages", this.state.chatMessages)

        })
        
    }

    componentWillUnmout() {
        // do not work
        // use willfocus
        console.log("chat unmounter");
        this.socket.disconnect();
    }

    getUsername = async () => {
        try{
            const user = await AsyncStorage.getItem('username')
            console.log("username in chat screen", user);
            this.setState({
                username: user
            })
            console.log("username in state", this.state.username)
        }
        catch(e){
            console.log(e);
        }
        
    }
    
    submitChatMessage(){
        // investigate if reciever id can be sent to the server alongwith the message.
        // update the chat list from the response
        var message = {
            sender: this.state.username,
            // set the reciever as async storage while coming from users screen
            reciever: "krishna",
            message: this.state.chatMessage
        }
        this.socket.emit("Chat Message", message);
        this.setState({ chatMessage: "" })
    }

    render(){
        const chatMessages = this.state.chatMessages.map(chatMessage => (
            <Text key={chatMessage}>{chatMessage}</Text>
        ));

        // const {navigate} = this.props.navigation;
        return(
            <View style={styles.container}>
                {chatMessages}
                <TextInput 
                    style= {{ height: 40, borderWidth: 2 }} 
                    autoCorrect={false}
                    value={this.state.chatMessage}
                    // onSubmitEditing={() => this.submitChatMessage()}
                    onChangeText={
                        chatMessage => {
                        this.setState({ chatMessage }); 
                        }
                    } 
                />
                <Button 
                    style={{ height: 40, width : 40 }}
                    onPress={() => this.submitChatMessage()}
                    title="Send"
                />
            </View>
        )
    }
}      

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    }
  });