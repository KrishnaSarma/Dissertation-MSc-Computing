import React, {Component} from 'react';
import {TouchableHighlight, Picker, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import firebase from "react-native-firebase";

import DialogInput from 'react-native-dialog-input';

import { Container, Content, Header, Left,
    Body, Right, Button, Icon, Title,
    Thumbnail, Item, Input, Text, ListItem, Separator, List } from 'native-base';

import {ipAddress, secondaryColor, primaryColor, disabledColor} from "../constants"
import { commonStyles } from '../style/commonStyle';
import { profileStyles } from "../style/profileScreenStyle";

import {getUserLanguage, getUserEmail, getUserTopicName, getUsername, getAvailableLanguages, passwordReset} from "./commonGetMethods";

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
            languages: [],
            isEmailChanged: false,
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

            if(this.state.newEmail != this.state.prevEmail){
                this.setState({
                    isEmailChanged: true
                })
            }

            axios.post("http://"+ipAddress+":3000/saveUserDetails", {
                prevEmail: this.state.prevEmail,
                newEmail: this.state.newEmail,
                newUsername: this.state.newUsername,
                newLanguage: this.state.newLanguage
            })
            .then(async (response) => {
                console.log("response save user details", response);
                if (response.status == 201){                
                    await this.setValue(response.data.topicName)
                    await this.setState({
                        changed: false
                    })
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
            await AsyncStorage.setItem('email', this.state.newEmail);
            await AsyncStorage.setItem('username', this.state.newUsername);
            await AsyncStorage.setItem('language', this.state.newLanguage);
            await AsyncStorage.setItem("fcmTopicName", topicName)
            console.log("Async Storage email", await AsyncStorage.getItem('email'));
            if(this.state.prevEmail != this.state.newEmail){
                await this.changeFirebaseTopic();
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
        await firebase.auth().signOut()
        navigate("Home")
    }

    changePassword = () => {
        passwordReset(this.state.prevEmail)
    }

    changeFirebaseEmail = async (password) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(cred);
        user.updateEmail(this.state.newEmail).then(() => {
            console.log("Email updated!");
            this.setState({
                isEmailChanged: false
            })
        })
        .catch((error) => { console.log(error); });
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
                    <Right>
                        {this.state.changed?(
                            <Button transparent
                            // style={commonStyles.button}
                            onPress={() => {this.saveChanges()}} >
                                <Text 
                                style= {{color: secondaryColor}}>
                                    SAVE
                                </Text>
                            </Button>
                        ):(
                            <Button transparent disabled>
                                <Text>SAVE</Text>
                            </Button>
                        )}
                    </Right>
                </Header>
                <Content>
                    <Thumbnail 
                    style={profileStyles.picture} 
                    large 
                    source={require('../images/profilePicture.jpg')} />

                    <List>
                        <ListItem itemDivider>
                            <Text>EMAIL</Text>
                        </ListItem>
                        <ListItem last>
                            <Item>
                                <Input 
                                placeholder={this.state.prevEmail}
                                onChangeText= { (email) => {
                                    this.setState({
                                        newEmail: email,
                                        changed: true
                                    })
                                }} />
                            </Item>
                        </ListItem>
                        <ListItem itemDivider>
                            <Text>USERNAME</Text>
                        </ListItem>
                        <ListItem last>
                            <Item>
                                <Input 
                                placeholder={this.state.prevUsername}
                                onChangeText= { (username) => {
                                    this.setState({
                                        newUsername: username,
                                        changed: true
                                    })
                                }} />
                            </Item>
                        </ListItem>
                        <ListItem itemDivider>
                            <Text>LANGUAGE</Text>
                        </ListItem>
                        <ListItem last>
                            <Item>
                                <Picker
                                style={{ height: 45, width: "100%", textAlign: "center"}}
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
                        </ListItem>
                        <ListItem itemDivider>
                            <Text>OTHER</Text>
                        </ListItem>
                        <ListItem>
                            <Text onPress={() => this.changePassword()}>CHANGE PASSWORD</Text>
                        </ListItem>
                        <ListItem last>
                            <Text onPress={() => this.logout(navigate)}>LOGOUT</Text>
                        </ListItem>
                    </List>
                    <DialogInput isDialogVisible={this.state.isEmailChanged}
                        title={"Password"}
                        message={"Enter your password"}
                        submitInput={ (inputText) => {this.changeFirebaseEmail(inputText)} }
                        closeDialog={ () =>this.setState({isEmailChanged:false})}>
                    </DialogInput>

                    {/* <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>USERNAME</Text>
                        <Input style={profileStyles.input} placeholder={this.state.prevUsername}
                        onChangeText={(username) => {
                            this.setState({
                                newUsername: username,
                                changed: true
                            })}} />
                    </Item>
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>EMAIL</Text>
                        <Input style={profileStyles.input} placeholder={this.state.prevEmail}
                        onChangeText={(email) => {
                            this.setState({
                                newEmail: email,
                                changed: true
                            })}} />
                    </Item>
                    <DialogInput isDialogVisible={this.state.isEmailChanged}
                        title={"Password"}
                        message={"Enter your password"}
                        submitInput={ (inputText) => {this.changeFirebaseEmail(inputText)} }
                        closeDialog={ () =>this.setState({isEmailChanged:false})}>
                    </DialogInput>
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>LANGUAGE</Text>

                        <Picker
                        style={{ height: 45, width: 267, textAlign: "center"}}
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
                    <Item style={{height: 45, justifyContent: "center"}}>
                        <Text style= {profileStyles.text} onPress={() => this.changePassword()}>CHANGE PASSWORD</Text>
                    </Item>
                    <Item style={{height: 45, justifyContent: "center"}}>
                        <Text style= {profileStyles.text} onPress={() => this.logout(navigate)}>LOGOUT</Text>
                    </Item>

                    {this.state.changed?(
                        <TouchableOpacity 
                        style={commonStyles.button}
                        onPress={() => {this.saveChanges()}} >
                            <Text style= {commonStyles.buttonText}>SAVE</Text>
                        </TouchableOpacity>
                    ):(
                        <TouchableHighlight 
                        style={[commonStyles.button, { backgroundColor: disabledColor }]}>
                            <Text style= {commonStyles.buttonText}>SAVE</Text>
                        </TouchableHighlight>
                    )} */}
                    
                </Content>
            </Container>
        )
    }
}