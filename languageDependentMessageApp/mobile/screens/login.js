import React, {Component} from 'react';
import {Text, View, Button, TextInput} from 'react-native';


export default class LoginScreen extends Component{
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
            this.setState(() => ({ signedIn: true }));
            this.login()
        }
    }

    login(){       
        const {navigate} = this.props.navigation;
        console.log(this.state.username+" "+this.state.password);
        navigate('Users');
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