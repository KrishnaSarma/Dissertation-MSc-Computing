import React, {Component} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

export default class SignupScreen extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: ""
        }
    }

    componentDidMount = async () =>{
        await this.getLanguages();
    }

    getLanguages(){
        axios.get("http://192.168.0.12:3000/getLanguages")
            .then((response) => {
                console.log("languages response", response)
                let languages = []
                if (response.status == 201){
                    for(var lang of response.data.body.dictionary){
                        console.log("lang", lang)
                        languages.push(lang.name);
                    }
                    this.setState({
                        languages : languages
                    })
                }
                console.log("language list", this.state.languages)
                
            })
            .catch(err => {
                console.log("error in language", err)
                alert("Couldn't load languages. Please refresh page and try again.", [{
                    text: "Okay"
                }])
            })
    }

    validateTextInput(){
        if (this.state.username.trim() === "") {
            this.setState(() => ({ nameError: "Username required." }));
        } 
        else if (this.state.password.trim() == "") {
            this.setState(() => ({nameError: "Password required."}));
        }
        else {
            this.setState(() => ({ nameError: null }));
            this.signup()
        }
    }

    setValue = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'True');
            await AsyncStorage.setItem('username', this.state.username);
        } catch(e) {
            console.log(e)
        }
      }

    signup(){

        axios.post("http://192.168.0.12:3000/signup", {
            username: this.state.username,
            password: this.state.password
        })
        .then((response) => {
            console.log("response signup", response);
            if (response.status == 201){                
                this.setValue()
                alert("Sign up successful", [{
                    text: "Okay"
                }])
                
                console.log("login", this.state.username+" "+this.state.password)
                const {navigate} = this.props.navigation
                navigate('Users')
            }
            
        })
        .catch(err => {
            var error = err.response
            if (error.status == 404){
                alert("Enter correct username/password.", [{
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

                {!!this.state.nameError && (
                    <Text style={{ color: "red" }}>{this.state.nameError}</Text>
                )}

                <Button 
                    style={{ height: 40, width : 40 }}
                    onPress={() => this.validateTextInput()}
                    title="Sign Up"
                />
            </View>
        )
    }
}