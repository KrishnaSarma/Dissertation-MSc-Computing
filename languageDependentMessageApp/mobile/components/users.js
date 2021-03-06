import React, {Component} from 'react';
import {Alert } from 'react-native';
import axios from 'axios';
import {ipAddress, secondaryColor} from "../constants";
import firebase from "react-native-firebase";
import { Container, Content, Header, Left, Thumbnail,
    Body, Right, Button, Icon, Title,
    List, ListItem, Text } from 'native-base';
import { commonStyles } from '../style/commonStyle';

import {getUserEmail, getUserTopicName} from "./commonGetMethods";

import {SearchBar} from "react-native-elements";


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
            refreshing: false,
            search: ''
        };
        this.userList = [];
    }

    componentDidMount = async () => {
        console.log("in users")

        var email = await getUserEmail()

        await this.setState({email})

        this.createNotificationListeners();

        if(this.state.email){
            var topicName = await getUserTopicName();
            await this.setState({topicName})
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
                    this.userList = response.data
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

    fcmTopicSubscription = async () => {
        await firebase.messaging().subscribeToTopic(this.state.topicName);
    }

    createNotificationListeners = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            console.log("on notification listener", notification);
            // this.showAlert(title, body);
        });

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            console.log("on notification displayed", notification)
        });
        
        const notificationOpen = await firebase.notifications().getInitialNotification();

        // this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        //     const { title, body } = notificationOpen.notification;
        //     this.showAlert(title, body);
        // });
        
        if (notificationOpen) {
            console.log("notification open", notificationOpen)
            const { data } = notificationOpen.notification;
            console.log("data", data)
            console.log("username", data.uname)
            console.log("on notification open if app closed listener", data.title, data.body, data.uname);
            this.props.navigation.navigate('Chat', {
                reciever: data.title,
                username: data.uname
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

    componentWillUnmount() {
        this.notificationListener();
        this.notificationDisplayedListener();
        // this.notificationOpenedListener();
    }

    searchFilterFunction = (text) => {
        var searchItem = text.toLowerCase();
        const newData = this.userList.filter(
            (user) => user.username.toLowerCase().includes(searchItem) || user.email.toLowerCase().includes(searchItem)
        );
        this.setState({
            users: newData,
            search:text,
        });
    }

    render(){

        const {navigate} = this.props.navigation;

        return( 
            <Container style={commonStyles.container}>
                <Header style={commonStyles.header}>
                    <Left>
                        <Button transparent onPress={() => this.getUserList()}>
                            <Icon name='refresh' />
                        </Button>
                    </Left>    
                    <Body>
                        <Title 
                        style={{alignSelf: "flex-end", color: secondaryColor, fontSize: 22}}>
                            CHATS
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => navigate('Profile')}>
                            <Icon name='settings' />
                        </Button>
                    </Right>
                </Header>
                <Content>
                <SearchBar
                    round
                    searchIcon={{ size: 24 }}
                    onChangeText={text => this.searchFilterFunction(text)}
                    onClear={text => this.searchFilterFunction('')}
                    placeholder="Type Here..."
                    value={this.state.search}
                    style={{color: "white"}}
                    />
                    <List dataArray={this.state.users}
                    renderRow={(item) =>
                        <ListItem avatar onPress={()=> {
                            navigate("Chat", {
                                reciever: item.email,
                                username: item.username
                            })
                        }}>
                            <Left>
                                <Thumbnail source={require('../images/minions.jpg')} />
                            </Left>
                            <Body>
                                <Text style={{fontSize: 20}}>{item.username}</Text>
                                <Text note style={{fontSize: 15}}>{item.email}</Text>
                            </Body>
                            <Right style={{justifyContent: "center"}}>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                    }>
                    </List>
                </Content>
            </Container>
        )
    }
}