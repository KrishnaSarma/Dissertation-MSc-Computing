import React, {Component} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import firebase from "react-native-firebase";

import {ipAddress} from "../constants"

import {passwordReset} from "./commonGetMethods";

export default class LoginScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    validateTextInput(){

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if (this.state.email.trim() === "") {
            this.setState(() => ({ nameError: "Email required." }));
        }
        
        else if (reg.test(this.state.email.trim()) === false) {
            this.setState(() => ({nameError: "Invalid Email"}));
        }

        else if (this.state.password.trim() == "") {
            this.setState(() => ({nameError: "Password required."}));
        }
        else {
            this.setState(() => ({ nameError: null }));
            this.login()
        }
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
                await alert("Login Successful", [{
                    text: "Okay"
                }])
            }
        })
        .catch((error) => {
            const { code, message } = error;
            console.log("signup error", code, message)
            alert(message, [{
                text: "Okay"
            }])
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

    render(){
        return(
            <View>
                <Text style = {{height: 40, width: 400, textAlign: "center"}}>
                    Enter your details below:
                </Text>
                <TextInput
                    style={{height: 40, width: 400, textAlign: "center"}}
                    placeholder= "Enter email here..."
                    onChangeText= {(email) => this.setState({email})}
                    value = {this.state.email}
                />

                <TextInput
                    style={{height: 40, width: 400, textAlign: "center"}}
                    placeholder="Enter password here..."
                    secureTextEntry = {true}
                    onChangeText= {(password) => this.setState({password})}
                    value = {this.state.password}
                />

                {!!this.state.nameError && (
                    <Text style={{ color: "red" }}>{this.state.nameError}</Text>
                )}

                <Button 
                    style={{ height: 40, width : 40 }}
                    onPress={() => this.validateTextInput()}
                    title="Login"
                />

                <Button 
                    style={{ height: 40, width : 40 }}
                    onPress={() => this.forgotPassword()}
                    title="Forgot Password"
                />
            </View>
        )
    }
}