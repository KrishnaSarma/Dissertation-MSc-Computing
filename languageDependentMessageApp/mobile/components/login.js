import React, {Component} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import {ipAddress} from "../constants"

export default class LoginScreen extends Component{

    // static navigationOptions = {
    //     header: null
    // }

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
    login(){
        console.log("in login")
        axios.post("http://"+ipAddress+":3000/login", {
            email: this.state.email,
            password: this.state.password
        })
        .then(async (response) => {
            console.log("response login", response);
            if (response.status == 201){
                await this.setValue(response.data.topicName, response.data.username)
                console.log("login", this.state.email+" "+this.state.password)
                this.props.navigation.navigate('Users')
            }
            
        })
        .catch(err => {
            var error = err.response
            if (error.status == 404){
                alert("Enter correct email/password.", [{
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

    setValue = async (topicName, username) => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'True');            
            await AsyncStorage.setItem('email', this.state.email);
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem("fcmTopicName", topicName);
            console.log("Async Storage email", await AsyncStorage.getItem('email'));
        } catch(e) {
            console.log(e)
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
            </View>
        )
    }
}