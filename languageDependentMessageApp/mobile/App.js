import React, {Component} from 'react';
import AsyncStorage, { useAsyncStorage } from '@react-native-community/async-storage';
// import {TextInput, StyleSheet, Text, View, Button} from 'react-native';
import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import HomeScreen from "./components/home";
import ChatScreen from "./components/chat";
import UsersScreen from "./components/users";
import LoginScreen from "./components/login";
import SignupScreen from "./components/signup";

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  getData = async () => {
    try {
      const loggedin = await AsyncStorage.getItem('@isLoggedIn')
      console.log('state', loggedin)
      console.log('store', loggedin)
      if(loggedin !== null) {
        this.setState(() => (
          { loggedIn: true }
        ))
      }
    } catch(e) {
      console.log(e)
    }
  }



  render() {

    this.getData();

    const loggedInNavigator = createStackNavigator({
      Users: {screen: UsersScreen},
      Chat: {screen: ChatScreen}
    })
  
    const AuthNavigator = createStackNavigator({
      Home: {screen: HomeScreen},
      Login: {screen: LoginScreen},
      Signup: {screen: SignupScreen}
    },
    {
      initialRouteName: 'Home'
    });

    const MainNavigator = createSwitchNavigator({
      signedIn: {screen: loggedInNavigator},
      notSignedIn: {screen: AuthNavigator}
    },
    {
      initialRouteName: this.state.loggedIn == true? 'signedIn' : 'notSignedIn'
    });
    
    const AppContainer = createAppContainer(MainNavigator)

    return (
      <AppContainer />
    );
  }
}
