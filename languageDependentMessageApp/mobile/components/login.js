import React, {Component} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default class LoginScreen extends Component{

    // static navigationOptions = {
    //     header: null
    // }

    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: ""
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

        axios.post("http://192.168.0.10:3000/login", {
            username: this.state.username,
            password: this.state.password
        })
        .then((response) => {
            console.log("response lgin", response);
            if (response.status == 201){
                this.setValue()
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

    setValue = async () => {
        try {
            await AsyncStorage.setItem('isLoggedIn', 'True');            
            await AsyncStorage.setItem('username', this.state.username);
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