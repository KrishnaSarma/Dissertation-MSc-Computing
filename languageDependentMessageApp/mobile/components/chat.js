import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, FlatList, View, TouchableOpacity} from 'react-native';
import io from "socket.io-client";
import axios from 'axios';
import { ipAddress, secondaryColor } from '../constants';
import { Container, Content, Header, Left,
    Body, Button, Icon, Title,
    Thumbnail, Item, Input, Text, Footer } from 'native-base';
import {commonStyles} from "./../style/commonStyle";
import {getUserEmail} from "./commonGetMethods";
import { chatScreen } from '../style/chatScreenStyle';

export default class ChatScreen extends Component{

    
    constructor(props) {
        super(props);
        this.state = {
        chatMessage: "",
        chatMessages: [],
        email: "",
        recieverUsername: ""
        };
    }

    componentDidMount = async () => {
        const { navigation } = this.props;

        this.socket = io("http://"+ipAddress+":3000");
        var email = await getUserEmail(); 
        await this.setState(() => ({ 
            reciever: navigation.state.params.reciever,
            email: email,
            recieverUsername: navigation.state.params.username
         }));

         console.log("rec", this.state.email)

        this.socket.emit("User Name", this.state.email);
        
        await this.getChatMessages(this.state.email, this.state.reciever)

        this.socket.on("Chat Message", msg => {
            this.setState({ chatMessages: [...this.state.chatMessages, msg] });
        });       

        this.blurListener = navigation.addListener("willBlur", () => {
            this.socket.close();
        });
      
    }

    getChatMessages(sender, reciever){
        axios.get("http://"+ipAddress+":3000/getMessages", {
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
        .catch(err => {
            var error = err.response
            if (err.status == 500){
                alert("Couldn't load messages. Please refresh page and try again.", [{
                    text: "Okay"
                }])
            }
            else{
                alert(err, [{
                    text: "Okay"
                }])
            }
          });
    }

    componentWillUnmount = () => {
        this.blurListener.remove();
    }

    changeText(msg){
        if(msg.message != msg.originalMessage){
            console.log("long pressed")
            var temp = msg.message
            msg.message = msg.originalMessage
            msg.originalMessage = temp
        }
        return msg
    }

    getDateTime = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        return date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec

    }
    
    submitChatMessage(){
        console.log("pressing submit")
        var dateTime = this.getDateTime();
        var message = {
            sender: this.state.email,
            reciever: this.state.reciever,
            message: this.state.chatMessage
        }
        this.socket.emit("Chat Message", message);
        var stateMsg = {
            sender: this.state.email,
            message: this.state.chatMessage,
            originalMessage: this.state.chatMessage,
            timestamp: dateTime
        }
        this.setState({ 
            chatMessage: "",
            chatMessages: [...this.state.chatMessages, stateMsg]
         })
    }

    renderChat = (item, separators) => {
        if(item.sender != this.state.email){
            return(
                <TouchableHighlight onLongPress = {() => {
                    item = this.changeText(item)
                }}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
                style={chatScreen.recieverMessage}>
                    <View style={{margin: 10}}>
                        <Text >{item.message}</Text>
                        <Text note>{item.timestamp}</Text>
                    </View>
                </TouchableHighlight>
            )            
        }
        else{
            return(
                <TouchableHighlight
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
                style={chatScreen.senderMessage}>
                    <View style={{margin: 10}}>
                        <Text>{item.message}</Text>
                        <Text note>{item.timestamp}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container style={commonStyles.container}>
                <Header style={commonStyles.header}>
                    <Left style={{flex: 1}}>
                        <Button transparent
                        onPress={() => {navigate('Users')}}>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body
                    style={{flexDirection: "row", justifyContent: "flex-start", flex: 7}}>
                        <Thumbnail small source={require('../images/minions.jpg')} />
                        <Title 
                        style={{alignSelf: "flex-start", color: secondaryColor,
                        fontSize: 22, marginLeft: "5%"}}>
                            {this.state.recieverUsername}
                        </Title>
                    </Body>
                </Header>
                <Content contentContainerStyle={{ height: "100%" }}>
                <FlatList
                data={this.state.chatMessages}
                renderItem={({item, index, separators}) => (
                    this.renderChat(item, separators)
                  )}
                />
                </Content>
                <Footer style={{backgroundColor: "transparent"}}>
                <Item style={chatScreen.typeInput}>
                    <Input value={this.state.chatMessage} onChangeText={
                        chatMessage => {
                            this.setState({chatMessage})
                        }
                    } />
                    <Icon active name='send' onPress={() => {this.submitChatMessage()}} />
                </Item>
                </Footer>
                
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    }
  });