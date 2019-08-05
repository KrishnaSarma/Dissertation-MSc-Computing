import React, {Component} from 'react';
import {Text, View, Button, Tex, StyleSheet, TextInput, FlatList, ActivityIndicator, TouchableHighlight} from 'react-native';
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
        this.socket.emit("User Name", this.state.username);

        this.blurListener = navigation.addListener("willBlur", () => {
            this.socket.close();
        });

        this.setState(() => ({ reciever: navigation.state.params.reciever }));
        
        await this.getChatMessages(this.state.username, this.state.reciever)

        this.socket.on("Chat Message", msg => {
            this.setState({ chatMessages: [...this.state.chatMessages, msg] });
        });
      
    }

    getUsername = async () => {
        try{
            const user = await AsyncStorage.getItem('username')
            console.log("username in user screen", user);
            await this.setState({
                username: user
            })
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
            this.setState({
                chatMessages: response.data.msgList
            })
            console.log("chat Messages", this.state.chatMessages)
            
        })
        .catch((err) => {
            console.log("err", err)
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
        var stateMsg = {
            sender: this.state.username,
            message: this.state.chatMessage
        }
        this.setState({ 
            chatMessage: "",
            chatMessages: [...this.state.chatMessages, stateMsg]
         })
    }

    render(){
        const chatMessages = this.state.chatMessages.map((msg, i) => (
            <View key={i}>
                <Text style={{color: "blue"}}>{msg.sender}: {msg.message}</Text>
            </View>
        ));

        return(
            <View style={styles.container}>
                {chatMessages}
                {/* <FlatList
                data={this.state.chatMessages}
                renderItem={({item, index, separators}) => (
                    <TouchableHighlight
                    //   onPress={() => navigate('Chat', {
                    //             reciever: item
                    //         })}
                      onShowUnderlay={separators.highlight}
                      onHideUnderlay={separators.unhighlight}>
                      <View style={{backgroundColor: 'white'}}>
                        <Text>{item}</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                /> */}
                <TextInput 
                    style= {{ height: 40, borderWidth: 2 }} 
                    autoCorrect={false}
                    value={this.state.chatMessage}
                    // onSubmitEditing={() => this.submitChatMessage()}
                    onChangeText={
                        chatMessage => {
                            this.setState({ chatMessage})
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