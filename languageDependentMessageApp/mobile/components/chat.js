import React, {Component} from 'react';
import {Text, View, Button, Tex, StyleSheet, TextInput} from 'react-native';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

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
        const { navigation } = this.props;

        this.socket = io('http://192.168.0.12:3000');
        await this.getUsername();
        console.log("uname to send", this.state.username);
        this.socket.emit("User Name", this.state.username);

        this.blurListener = navigation.addListener("willBlur", () => {
            this.socket.close();
        });

        this.setState(() => ({ reciever: navigation.state.params.reciever }));
        
        await this.getChatMessages(this.state.username, this.state.reciever)

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

    getChatMessages(sender, reciever){
        axios.get("http://192.168.0.12:3000/getMessages", {
            params: {
                sender: sender,
                reciever: reciever
            }
        })
        .then( (response) => {
            console.log("chat response", response);
        })
        .catch((err) => {
            console.log("err")
        })
    }

    componentWillUnmount = () => {
        this.blurListener.remove();
    }
    
    submitChatMessage(){
        console.log("pressing submit")
        var message = {
            sender: this.state.username,
            reciever: this.state.reciever,
            message: this.state.chatMessage
        }
        this.socket.emit("Chat Message", message);
        this.setState({ chatMessage: "" })
    }

    render(){
        const chatMessages = this.state.chatMessages.map(chatMessage => (
            <Text key={chatMessage}>{chatMessage}</Text>
        ));

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