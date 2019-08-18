import React, {Component} from 'react';
import {TouchableHighlight, Picker} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import firebase from "react-native-firebase";

import { Container, Content, Header, Left,
    Body, Right, Button, Icon, Title,
    Thumbnail, List, ListItem, Item, Input, Text } from 'native-base';

import {ipAddress, secondaryColor, primaryColor, disabledColor} from "../constants"
import { commonStyles } from '../style/commonStyle';
import { profileStyles } from "../style/profileScreenStyle";

import {getUserLanguage, getUserEmail, getUserTopicName, getUsername, getAvailableLanguages} from "./commonGetMethods";

export default class ProfileScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            prevEmail: "",
            prevUsername: "",
            newEmail: "",
            newUsername: "",
            changed: false,
            topicName: "",
            prevLanguage: "",
            newLanguage: "",
            languages: []
        }
    }

    componentDidMount = async() => {
        var username = await getUsername();
        var email = await getUserEmail();
        var topicName = await getUserTopicName();
        var language = await getUserLanguage()
        var languages = await getAvailableLanguages()
        console.log("languages returned", languages)
        await this.setStateVariables(username, email, topicName, language, languages)
    }

    setStateVariables = async (username, email, topicName, language, languages) => {
        try{
            await this.setState({
                newUsername: username,
                prevUsername: username,
                prevEmail: email,
                newEmail: email,
                prevLanguage: language,
                newLanguage: language,
                topicName: topicName,
                languages: languages
            })
        }
        catch(e){
            console.log(e);
        }
        
    }
    

    validateEmail(){       

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if (this.state.newEmail.trim() === "") {
            this.setState(() => ({ nameError: "Email required." }));
            return false
        }
        
        else if (reg.test(this.state.newEmail.trim()) === false) {
            this.setState(() => ({nameError: "Invalid Email"}));
            return false
        }
        else{
            return true
        }
    }

    saveChanges = async() => {
        if(await this.validateEmail()){
            console.log("need to add save route")
            axios.post("http://"+ipAddress+":3000/saveUserDetails", {
                prevEmail: this.state.prevEmail,
                newEmail: this.state.newEmail,
                newUsername: this.state.newUsername,
                newLanguage: this.newLanguage
            })
            .then(async (response) => {
                console.log("response signup", response);
                if (response.status == 201){                
                    await this.setValue(response.data.topicName)
                    alert("User Details saved", [{
                        text: "Okay"
                    }])
                }
                
            })
            .catch(err => {
                var error = err.response
                if (error.status == 404){
                    console.log("profile", error)
                    alert("This email Id is already used", [{
                        text: "Okay"
                    }])
                }
                else if (err.status == 500){
                    alert("Internal server error. Please try again.", [{
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
        else{
            alert(this.state.nameError, [{
                text: "Okay"
            }])
        }
    }

    changeFirebaseTopic = async() => {        
        await firebase.messaging().unsubscribeFromTopic(this.state.topicName);
        await firebase.messaging().subscribeToTopic(this.state.topicName);
    }

    setValue = async (topicName) => {
        try {          
            await AsyncStorage.setItem('email', this.state.email);
            await AsyncStorage.setItem('username', this.state.username);
            await AsyncStorage.setItem('language', this.state.newLanguage);
            await AsyncStorage.setItem("fcmTopicName", topicName)
            console.log("Async Storage email", await AsyncStorage.getItem('email'));
            if(this.state.prevEmail != this.state.newEmail){
                await changeFirebaseTopic();
            }
        } catch(e) {
            console.log(e)
        }
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

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container style={commonStyles.container}>
                <Header style={commonStyles.header}>
                    <Left>
                        <Button transparent
                        onPress={() => {navigate('Users')}}>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{alignSelf: "flex-end", color: secondaryColor, fontSize: 22}}>PROFILE</Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <Thumbnail 
                    style={profileStyles.picture} 
                    large 
                    source={require('../images/profilePicture.jpg')} />
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>Username</Text>
                        <Input style={profileStyles.input} placeholder={this.state.prevUsername}
                        onChangeText={(username) => {
                            this.setState({
                                newUsername: username,
                                changed: true
                            })}} />
                    </Item>
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>Email</Text>
                        <Input style={profileStyles.input} placeholder={this.state.prevEmail}
                        onChangeText={(email) => {
                            this.setState({
                                newEmail: email,
                                changed: true
                            })}} />
                    </Item>
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>Language</Text>

                        <Picker
                        style={{ height: 40, width: 267, textAlign: "center"}}
                        mode="dropdown"
                        selectedValue={this.state.newLanguage}
                        onValueChange={(itemValue)=>{
                            this.setState({ 
                                newLanguage: itemValue,
                                changed: true })
                        }}>
                            {this.state.languages.map((item, index) => {
                                return (<Picker.Item 
                                    style= {{width: 267, fontSize: 22}} label={item.name} value={item.code} key={index}/>) 
                            })}
                        </Picker>
                    </Item>
                    <List>
                        <ListItem onPress={()=>navigate('passwordChange')}>
                            <Left>
                                <Text style={{fontSize: 22}}>Change Password</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                    </List>
                    {this.state.changed?(
                        <TouchableHighlight 
                        style={commonStyles.button}
                        onPress={() => {this.saveChanges()}} >
                            <Text style= {commonStyles.buttonText}>SAVE</Text>
                        </TouchableHighlight>
                    ):(
                        <TouchableHighlight 
                        style={[commonStyles.button, { backgroundColor: disabledColor }]}>
                            <Text style= {commonStyles.buttonText}>SAVE</Text>
                        </TouchableHighlight>
                    )}

                    <TouchableHighlight 
                    style={commonStyles.button}
                    onPress={() => {this.logout(navigate)}} >
                        <Text style= {commonStyles.buttonText}>LOGOUT</Text>
                    </TouchableHighlight>
                </Content>
            </Container>
        )
    }
}