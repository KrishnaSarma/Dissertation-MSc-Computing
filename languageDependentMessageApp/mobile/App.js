import React, {Component} from 'react';
import {TextInput, StyleSheet, Text, View, Button} from 'react-native';
import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import HomeScreen from "./components/home";
import ChatScreen from "./components/chat";
import UsersScreen from "./components/users";
import LoginScreen from "./components/login";
import SignupScreen from "./components/signup";

const authNavigator = createSwitchNavigator({
  Login: {screen: LoginScreen},
  Signup: {screen: SignupScreen}
});

const MainNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Auth: {screen: authNavigator},
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
