import React, {Component} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import { Container, Content, Header, Left,
    Body, Right, Button, Icon, Title,
    Form, Thumbnail, Item, Input, Text} from 'native-base';

import firebase from "react-native-firebase";
import { commonStyles } from '../style/commonStyle';
import {ipAddress, secondaryColor} from "../constants"

import {passwordReset} from "./commonGetMethods";

export default class LoginScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            icon: "eye-off",
            email: "",
            password: "",
            showPassword: false
        }
    }

    validateTextInput(){

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if (this.state.email.trim() === "") {
            this.showAlert("Email Required")
            // this.setState(() => ({ nameError: "Email required." }));
        }
        
        else if (reg.test(this.state.email.trim()) === false) {
            this.showAlert("Invalid Email")
            // this.setState(() => ({nameError: "Invalid Email"}));
        }

        else if (this.state.password.trim() == "") {
            this.showAlert("Password Required")
            // this.setState(() => ({nameError: "Password required."}));
        }
        else {
            this.setState(() => ({ nameError: null }));
            this.login()
        }
    }

    showAlert = (msg) => {
        alert(msg, [{
            text: "Okay"
        }])
    }

    getUserData = () => {
        axios.get("http://"+ipAddress+":3000/getUserData", {
            params:{
                email: this.state.email
            }
        })
        .then( async (response) => {
            console.log("get user data response", response)
            await this.setValue(response.data.topicName, response.data.username, response.data.language)            
            this.props.navigation.navigate('Users')
        })
    }

    login(){
        console.log("in login")

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(async (user) => {
            console.log("1 after login", user)
            if(user){
                await this.getUserData()
                await this.showAlert("Login Successful")
            }
        })
        .catch((error) => {
            const { code, message } = error;
            console.log("signup error", code, message)
            this.showAlert(message)
        });
    }

    setValue = async (topicName, username, language) => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'True');            
            await AsyncStorage.setItem('email', this.state.email);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('language', language);
            await AsyncStorage.setItem("fcmTopicName", topicName);
            console.log("Async Storage email", await AsyncStorage.getItem('email'));
        } catch(e) {
            console.log(e)
        }
    }
    
    forgotPassword = () => {

        if (this.state.email.trim() === "") {
            this.setState(() => ({ nameError: "Email required." }));
        }
        else{
            passwordReset(this.state.email)
        }        
    }

    _changeIcon = () => {
        this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
            showPassword: !prevState.showPassword
        }));
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
                        <Title 
                        style={{alignSelf: "flex-end", color: secondaryColor, fontSize: 22}}>
                            LOGIN
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{
                    alignSelf: "center",
                    width: "80%",
                    flex: 1 }}>
                    <Image
                    style={[commonStyles.icon, {marginBottom: 50, marginTop: 70}]}
                    source={require('../images/icon.jpg')}
                    />
                    <Form >
                        <Item>
                            <Input 
                            placeholder= "Username"
                            onChangeText= {(email) => this.setState({email})}/>
                        </Item>
                        <Item>
                            <Input
                            placeholder="Password"
                            value={this.state.password} 
                            secureTextEntry={!this.state.showPassword}
                            onChangeText={(password) => this.setState({password})}/>                           
                            <Icon name={this.state.icon} onPress={() => this._changeIcon()} />
                        </Item>
                    </Form>
                    <TouchableOpacity 
                        style={commonStyles.button}
                        onPress={() => {this.validateTextInput()}} >
                            <Text style= {commonStyles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>
                </Content>
            </Container>
        )
    }
}