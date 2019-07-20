import React, {Component} from 'react';
import {Text, View, Button, TextInput} from 'react-native';

import axios from 'axios';

export default class LoginScreen extends Component{

    static navigationOptions = {
        header: null
    }

    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            signedIn: false
        }
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
            this.login()
        }
    }

    login(){
         var loggedin = false;

        axios.post("http://192.168.0.13:3000/login", {
            username: this.state.username,
            password: this.state.password
        })
        .then(function (response) {
                  console.log(response);
                })
        .catch(err => {
            console.log("error", err)
          });

//        if (this.state.username == "admin" && this.state.password == "password"){
//            loggedin = true;
//        }
//
        if (this.state.signedIn == true){
            const {navigate} = this.props.navigation;
            console.log(this.state.username+" "+this.state.password);
            navigate('Users');
        }
        else {
            alert("Enter correct username/password", [{
                text: "Okay"
            }])
        }
    }

    render(){
        return(
            <View>
                <Text style = {{height: 40, width: 400, textAlign: "center"}}>
                    "Enter your details below:"
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
                    title="Login"
                />
            </View>
        )
    }
}