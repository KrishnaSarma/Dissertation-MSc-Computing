import React, {Component} from 'react';
import {Text, View, Button, TextInput, Picker} from 'react-native';
import axios from 'axios';
import {ipAddress, languageDropdownPlaceholder} from "../constants"

import AsyncStorage from '@react-native-community/async-storage';

export default class SignupScreen extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            language: "",
            languages: []
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
                    name: languageDropdownPlaceholder,
                    code: "Placeholder"
                })
                if (response.status == 201){
                    this.setState({ languages })
                }

                console.log("languages state", this.state.languages)
                
            })
            .catch(err => {
                console.log("error in language", err)
                alert("Couldn't load languages. Please refresh page and try again.", [{
                    text: "Okay"
                }])
            })
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
            await AsyncStorage.setItem('isLoggedIn', 'True');            
            await AsyncStorage.setItem('email', this.state.email);
            await AsyncStorage.setItem("fcmTopicName", topicName)
            console.log("Async Storage email", await AsyncStorage.getItem('email'));
        } catch(e) {
            console.log(e)
        }
    }

    signup(){

        axios.post("http://"+ipAddress+":3000/signup", {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            language: this.state.language,
        })
        .then(async (response) => {
            console.log("response signup", response);
            if (response.status == 201){                
                await this.setValue(response.data.topicName)
                alert("Sign up successful", [{
                    text: "Okay"
                }])
                
                const {navigate} = this.props.navigation
                navigate('Users')
            }
            
        })
        .catch(err => {
            var error = err.response
            if (error.status == 404){
                console.log("signup", error)
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

    render(){
        const {navigate} = this.props.navigation;
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
                    secureTextEntry = {true}
                    onChangeText= {(password) => this.setState({password})}
                    value = {this.state.password}
                />

                <TextInput
                    style={{height: 40, width: 400, textAlign: "center"}}
                    placeholder="Renter password here..."
                    secureTextEntry = {true}
                    onChangeText= {(password) => this.setState({confirmPassword: password})}
                    value = {this.state.confirmPassword}
                />

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