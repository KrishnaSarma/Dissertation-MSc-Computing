import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';
import HomeScreen from "./components/home";
import ChatScreen from "./components/chat";
import UsersScreen from "./components/users";
import LoginScreen from "./components/login";
import SignupScreen from "./components/signup";
import ProfileScreen from "./components/profile";
import firebase from "react-native-firebase";

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {

    console.log("in app.js")
    await this.checkNotificationPermissions(); 
  }

  checkNotificationPermissions =async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken()
    } else {
      this.requestPermission()
    }
  }

  getToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken:', fcmToken);
  }
  
  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    } catch (error) {
      console.log('permission rejected');
    }
  }
  
  getData = async () => {
    try {
      const loggedin = await AsyncStorage.getItem('isLoggedIn')
      if(loggedin !== null) {
        return true;
      }
      else{
        return false;
      }
    } catch(e) {
      console.log(e)
    }
  }

  render() {

    var signedIn = this.getData();

    const loggedInNavigator = createStackNavigator({
      Users: {
        screen: UsersScreen,
        navigationOptions: {
          header: null
        }
      },
      Chat: {screen: ChatScreen},
      Profile: {
        screen: ProfileScreen,
        navigationOptions: {
          header: null
        }
      }
    })
  
    const AuthNavigator = createStackNavigator({
      Home: {
        screen: HomeScreen,
        navigationOptions: {
          header: null
        }
      },
      Login: {
        screen: LoginScreen,
        navigationOptions: {
          header: null
        }
      },
      Signup: {
        screen: SignupScreen
      }
    },
    {
      initialRouteName: 'Home'
    });

    const MainNavigator = createSwitchNavigator({
      signedIn: {screen: loggedInNavigator},
      notSignedIn: {screen: AuthNavigator}
    },
    {
      initialRouteName: signedIn? 'signedIn' : 'notSignedIn'
    });
    
    const AppContainer = createAppContainer(MainNavigator)

    return (
      <AppContainer />
    );
  }
}
