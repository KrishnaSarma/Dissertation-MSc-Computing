import React, {Component} from 'react';
import {Text, View, Button, TextInput, Picker, Switch} from 'react-native';
import axios from 'axios';
import {ipAddress} from "../constants"

import AsyncStorage from '@react-native-community/async-storage';

import firebase from "react-native-firebase";

export default class SignupScreen extends Component{
    
    constructor(props){
        super(props);
        this.toggleSwitch = this.toggleSwitch.bind(this);
        this.toggleConfirmPasswordSwitch = this.toggleConfirmPasswordSwitch.bind(this);
        this.state = {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            language: "",
            languages: [],            
            showPassword: false,
            showConfirmPassword: false
        }
    }

    componentDidMount = async () =>{
        await this.getLanguages();
    }

    getLanguages(){
        axios.get("http://"+ipAddress+":3000/getLanguages")
            .then((response) => {
                console.log("languages response", response);
                let languages = response.data
                languages.unshift({
                    name: "Please select a language",
                    code: "Placeholder"
                })
                if (response.status == 201){
                    this.setState({ languages })
                }

                console.log("languages state", this.state.languages)
                
            })
            .catch(err => {
                console.log("error in language", err)
                if (err.status == 500){
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

    validateTextInput(){

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if (this.state.email.trim() === "") {
            this.setState(() => ({ nameError: "Email required." }));
        }
        
        else if (reg.test(this.state.email.trim()) === false) {
            this.setState(() => ({nameError: "Invalid Email"}));
        }

        else if (this.state.username.trim() == "") {
            this.setState(() => ({nameError: "Username required."}));
        }

        else if (this.state.password.trim() == "") {
            this.setState(() => ({nameError: "Password required."}));
        }

        else if (this.state.confirmPassword.trim() == "") {
            this.setState(() => ({nameError: "Confirm Password required."}));
        }

        else if (this.state.password.trim() != this.state.confirmPassword.trim()){
            this.setState(() => ({nameError: "Password don't match"}));
        }

        else if (this.state.language == "") {
            this.setState(() => ({nameError: "Select Language"}));
        }

        else {
            this.setState(() => ({ nameError: null }));
            this.signup()
        }
    }

    setValue = async (topicName) => {
        try {
            await AsyncStorage.setItem('isLoggedIn', "true");          
            await AsyncStorage.setItem('email', this.state.email);
            await AsyncStorage.setItem('username', this.state.username);
            await AsyncStorage.setItem('language', this.state.language);
            await AsyncStorage.setItem("fcmTopicName", topicName)
            console.log("5 Async Storage email", await AsyncStorage.getItem('email'));
        } catch(e) {
            console.log(e)
        }
    }

    addUserData = async () => {
        console.log("2 in add user data: http://"+ipAddress+":3000/addUserData")
        await axios.post("http://"+ipAddress+":3000/addUserData", {
            email: this.state.email,
            username: this.state.username,
            language: this.state.language
        })
        .then(async (response) => {
            console.log("3 user data response", response)
            if(response.status == 201){
                console.log("3.5", response.data.topicName)
                await this.setValue(response.data.topicName)
                this.props.navigation.navigate('Users')
            }
        })
        .catch((err) => {
            if (err.status == 500){
                alert("Internal server error. Please try again.", [{
                    text: "Okay"
                }])
            }
            else{
                alert(err, [{
                    text: "Okay"
                }])
            }
        })
    }

    signup(){
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async (user) => {
            console.log("1 after signup", user)
            if(user){
                await this.addUserData()
                await alert("Signup successful", [{
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

    togglePasswordSwitch() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    toggleConfirmPasswordSwitch() {
        this.setState({ showConfirmPassword: !this.state.showConfirmPassword });
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
                    placeholder= "Enter username here..."
                    onChangeText= {(username) => this.setState({username})}
                    value = {this.state.username}
                />

                <TextInput
                    style={{height: 40, width: 400, textAlign: "center"}}
                    placeholder="Enter password here..."
                    secureTextEntry = {!this.state.showPassword}
                    onChangeText= {(password) => this.setState({password})}
                    value = {this.state.password}
                />
                <Switch
                onValueChange={this.toggleSwitch}
                value={!this.state.showPassword}
                /> 
                <Text>Show</Text>

                <TextInput
                    style={{height: 40, width: 400, textAlign: "center"}}
                    placeholder="Renter password here..."
                    secureTextEntry = {!this.state.showConfirmPassword}
                    onChangeText= {(password) => this.setState({confirmPassword: password})}
                    value = {this.state.confirmPassword}
                />
                <Switch
                onValueChange={this.toggleConfirmPasswordSwitch}
                value={!this.state.showConfirmPassword}
                /> 
                <Text>Show</Text>

                {!!this.state.nameError && (
                    <Text style={{ color: "red" }}>{this.state.nameError}</Text>
                )}

                <Picker
                    style={{ height: 40, width : 400, textAlign: "center" }}
                    mode="dropdown"
                    selectedValue={this.state.language}
                    onValueChange={(itemValue)=>{
                        this.setState({ language: itemValue })
                    }}>
                    {this.state.languages.map((item, index) => {
                        return (<Picker.Item label={item.name} value={item.code} key={index}/>) 
                    })}
                </Picker>

                <Button 
                    style={{ height: 40, width : 40 }}
                    onPress={() => this.validateTextInput()}
                    title="Sign Up"
                />
            </View>
        )
    }
}