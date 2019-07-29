import React, {Component} from 'react';
import {Text, View, Button, Tex, StyleSheet, TextInput} from 'react-native';

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

        this.socket = this.props.navigation.state.params.socket
        this.setState(() => ({ reciever: this.props.navigation.state.params.reciever }));

        console.log("in component did mount", this.props);

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
    
    submitChatMessage(){
        console.log("pressing submit")
        var message = {
            sender: this.state.username,
            // set the reciever as async storage while coming from users screen
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