import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, Button} from 'react-native';
import io from "socket.io-client";
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HomeScreen from "./screens/home";
import ChatScreen from "./screens/chat";
import UsersScreen from "./screens/users";
import LoginScreen from "./screens/login";

const MainNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Login: {screen: LoginScreen},
    Users: {screen: UsersScreen},
    Chat: {screen: ChatScreen}
  },
  {
    initialRouteName: 'Home'
  }
);

const AppContainer = createAppContainer(MainNavigator)

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chatMessage: "",
      chatMessages: []
    };
  }

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

  render() {

    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text key={chatMessage}>{chatMessage}</Text>
    ));

    return (

      <AppContainer />


      // <View style={styles.container}>
      //   <TextInput 
      //     style= {{ height: 40, borderWidth: 2 }} 
      //     autoCorrect={false}
      //     value={this.state.chatMessage}
      //     onSubmitEditing={() => this.submitChatMessage()}
      //     onChangeText={
      //       chatMessage => {
      //          this.setState({ chatMessage }); 
      //       }
      //     } 
      //   />
      //   {chatMessages}
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});
