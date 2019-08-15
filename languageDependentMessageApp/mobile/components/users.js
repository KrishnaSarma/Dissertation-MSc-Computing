import React, {Component} from 'react';
import {Text, View, Button, FlatList, ActivityIndicator, TouchableHighlight, Alert } from 'react-native';
// import { List, ListItem, SearchBar } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {ipAddress} from "../constants";
import firebase from "react-native-firebase";

// import { FlatList } from 'react-native-gesture-handler';

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

        await this.getUsername();

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

    getUsername = async () => {
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
        });
    
        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            console.log("on notification opened listener");
            this.showAlert(title, body);
        });
    
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            console.log("on notification open if app closed listener");
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log("message")
          console.log(JSON.stringify(message));
        });
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
    
    removeValue = async () => {
        try {
            await AsyncStorage.removeItem('isLoggedIn')
            await AsyncStorage.removeItem('email')
        } catch(e) {
            console.log(e)
        }
    }

    logout = async (navigate) => {
        console.log('logout pressed');
        this.removeValue()
        await firebase.messaging().unsubscribeFromTopic(this.state.topicName);
        navigate("Home")
    }    

    //Remove listeners allocated in createNotificationListeners()
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    // handleRefresh = () => {
    //     this.setState(
    //     {
    //         page: 1,
    //         seed: this.state.seed + 1,
    //         refreshing: true
    //         },
    //         () => {
    //             this.getUserList();
    //     }
    //     );
    // };
    
    // handleLoadMore = () => {
    // this.setState(
    //     {
    //         page: this.state.page + 1
    //     },
    //     () => {
    //         this.getUserList();
    //     }
    // );
    // };
    
    // renderSeparator = () => {
    // return (
    //     <View
    //     style={{
    //         height: 1,
    //         width: "86%",
    //         backgroundColor: "#CED0CE",
    //         marginLeft: "14%"
    //     }}
    //     />
    // );
    // };

    // renderHeader = () => {
    // return <SearchBar placeholder="Type Here..." lightTheme round />;
    // };

    // renderFooter = () => {
    // if (!this.state.loading) return null;

    // return (
    //     <View
    //         style={{
    //             paddingVertical: 20,
    //             borderTopWidth: 1,
    //             borderColor: "#CED0CE"
    //         }}
    //         >
    //         <ActivityIndicator animating size="large" />
    //     </View>
    // );
    // };
    


    render(){

        const {navigate} = this.props.navigation;
        return(
            <View>                
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => this.logout(navigate)}
                    title="Logout"
                />
                {/* <Text style = {{height: 40, width: 50}}>
                    "User Screen"
                </Text> */}

                {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <FlatList
                    data={this.state.users}
                    renderItem={({ item }) => (
                        <ListItem
                        // roundAvatar
                        title={`${item}`}
                        // subtitle={item.email}
                        // avatar={{ uri: item.picture.thumbnail }}
                        containerStyle={{ borderBottomWidth: 0 }}
                        />
                    )}
                    // keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={50}
                    />
                </List> */}

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

                {/* <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => navigate('Chat', {
                        socket: this.socket
                    })}
                    title="Go to chat"
                /> */}
            </View>
        )
    }
}