import React, {Component} from 'react';
import {Text, View, Button, FlatList, ActivityIndicator, DrawerLayoutAndroid, TouchableHighlight, Alert } from 'react-native';
// import { List, ListItem, SearchBar } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {ipAddress} from "../constants";
import firebase from "react-native-firebase";

export default class UsersScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            topicName : "",
            email: "",
            users: [],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false
        };
    }

    componentDidMount = async () => {
        console.log("in users")

        await this.getUserEmail();

        this.createNotificationListeners();

        if(this.state.email){
            await this.getTopicName()
            await this.fcmTopicSubscription();            
            await this.getUserList();
        }
        else {
            this.props.navigation.navigate("Home");
        }
    }

    getUserList = () => {

        axios.get("http://"+ipAddress+":3000/users", {
            params: {
                email: this.state.email
            }
        })
            .then((response) => {
                console.log("users response", response)
                if (response.status == 201){
                    this.setState({
                        users : response.data 
                    })
                }
                console.log("user list", this.state.users)
                
            })
            .catch(err => {
                var error = err.response
                if (err.status == 500){
                    alert("Couldn't load users. Please refresh page and try again.", [{
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

    getUserEmail = async () => {
        try{
            const user = await AsyncStorage.getItem('email')
            console.log("email in user screen", user);
            await this.setState({
                email: user
            })
            console.log("email in state", this.state.email)
        }
        catch(e){
            console.log(e);
        }
        
    }

    getTopicName = async () => {
        try{
            const topicName = await AsyncStorage.getItem('fcmTopicName')
            console.log("topic name", topicName);
            await this.setState({topicName})
            console.log("topic in state", this.state.topicName)
        }
        catch(e){
            console.log(e);
        }
    }

    fcmTopicSubscription = async () => {
        await firebase.messaging().subscribeToTopic(this.state.topicName);
    }

    createNotificationListeners = async () => {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            console.log("on notification listener", notification);
            this.showAlert(title, body);
            // reassemble user list here or highlight the user
        });

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            console.log("on notification displayed", notification)
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            console.log("notification open", notificationOpen)
            const { data } = notificationOpen.notification;
            console.log("data", data)
            console.log("on notification open if app closed listener", data.title, data.body);
            // this.showAlert(data.title, data.body);
            this.props.navigation.navigate('Chat', {
                reciever: data.title
            })
        }
    }
    
    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }
    
    //Remove listeners allocated in createNotificationListeners()
    componentWillUnmount() {
        this.notificationListener();
        this.notificationDisplayedListener();
    }

    render(){

        const {navigate} = this.props.navigation;

        return( 
            <View>

                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => navigate('Profile')}
                    title="Profile"
                />

                <FlatList
                data={this.state.users}
                renderItem={({item, index, separators}) => (
                    <TouchableHighlight
                      onPress={() => navigate('Chat', {
                                reciever: item.email
                            })}
                      onShowUnderlay={separators.highlight}
                      onHideUnderlay={separators.unhighlight}>
                      <View style={{backgroundColor: 'white'}}>
                        <Text>{item.username}</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                />
            </View>
        )
    }
}