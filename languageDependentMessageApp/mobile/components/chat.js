import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, FlatList, View} from 'react-native';
import io from "socket.io-client";
import axios from 'axios';
import { ipAddress, secondaryColor } from '../constants';
import { Container, Content, Header, Left,
    Body, Right, Button, Icon, Title,
    Thumbnail, List, ListItem, Item, Input, Text } from 'native-base';
import {commonStyles} from "./../style/commonStyle";
import {getUserEmail} from "./commonGetMethods";

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

    // getUsername = async () => {
    //     try{
    //         const user = await AsyncStorage.getItem('email')
    //         console.log("email in user screen", user);
    //         await this.setState({
    //             email: user
    //         })
    //     }
    //     catch(e){
    //         console.log(e);
    //     }
        
    // }

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

    _onPress(msg){
        if(msg.message != msg.originalMessage){
            var temp = msg.message
            msg.message = msg.originalMessage
            msg.originalMessage = temp
        }
        return msg
    }
    
    submitChatMessage(){
        console.log("pressing submit")
        var message = {
            sender: this.state.email,
            reciever: this.state.reciever,
            message: this.state.chatMessage
        }
        this.socket.emit("Chat Message", message);
        var stateMsg = {
            sender: this.state.email,
            message: this.state.chatMessage
        }
        this.setState({ 
            chatMessage: "",
            chatMessages: [...this.state.chatMessages, stateMsg]
         })
    }

    renderChat = (item, separators) => {
        if(item.sender != this.state.email){
            return(
                <TouchableHighlight
                onPress = {() => {
                    item = this._onPress(item)
                }}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}>
                    <View style={{backgroundColor: "white"}}>
                        <Text>{item.message}</Text>
                        <Text >{item.timestamp}</Text>
                    </View>
                </TouchableHighlight>
            )            
        }
        else{
            return(
                <TouchableHighlight
                onPress = {() => {
                    item = this._onPress(item)
                }}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}>
                    <View style={{backgroundColor: "#968282"}}>
                        <Text>{item.message}</Text>
                        <Text >{item.timestamp}</Text>
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
                <Content>
                <FlatList
                data={this.state.chatMessages}
                renderItem={({item, index, separators}) => (
                    this.renderChat(item, separators)
                  )}
                />
                </Content>
            </Container>
            // <View style={styles.container}>
            //     <FlatList
            //     data={this.state.chatMessages}
            //     renderItem={({item, index, separators}) => (
            //         <TouchableHighlight
            //         //   onPress={() => navigate('Chat', {
            //         //             reciever: item.email
            //         //         })}
            //             onLongPress = {() => {
            //                 item.message = this._onLongPress(item)
            //             }}
            //             onShowUnderlay={separators.highlight}
            //             onHideUnderlay={separators.unhighlight}>
            //             <View style={{backgroundColor: 'white'}}>
            //                 <Text>{item.sender}: {item.message}</Text>
            //             </View>
            //         </TouchableHighlight>
            //       )}
            //     />
            //     <TextInput 
            //         style= {{ height: 40, borderWidth: 2 }} 
            //         autoCorrect={false}
            //         value={this.state.chatMessage}
            //         // onSubmitEditing={() => this.submitChatMessage()}
            //         onChangeText={
            //             chatMessage => {
            //                 this.setState({ chatMessage})
            //             }
            //         }
            //     />
            //     <Button 
            //         style={{ height: 40, width : 40 }}
            //         onPress={() => this.submitChatMessage()}
            //         title="Send"
            //     />
            // </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    }
  });