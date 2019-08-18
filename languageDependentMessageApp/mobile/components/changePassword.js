import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

import { Container, Content, Header, Left,
    Body, Button, Icon, Title, Item, Input, Text, Form, Label } from 'native-base';

import {ipAddress, secondaryColor, primaryColor, disabledColor} from "../constants"
import { commonStyles } from '../style/commonStyle';

export default class SignupScreen extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            changed: false
        }
    }

    componentDidMount = async () =>{
        await this.getUserEmail();
    }

    getUserEmail = async () => {
        try{
            const email = await AsyncStorage.getItem('email')
            console.log("email in user screen", email);
            await this.setState({
                newEmail: email,
                prevEmail: email
            })
            console.log("email in state", this.state.prevEmail)
        }
        catch(e){
            console.log(e);
        }
        
    }

    validateTextInput(){

        if (this.state.newPassword.trim() == "") {
            this.setState(() => ({nameError: "Password required."}));
            return false
        }

        else if (this.state.confirmPassword.trim() == "") {
            this.setState(() => ({nameError: "Confirm Password required."}));
            return false
        }

        else if (this.state.newPassword.trim() != this.state.confirmPassword.trim()){
            this.setState(() => ({nameError: "Password don't match"}));
            return false
        }

        else if (this.state.language == "") {
            this.setState(() => ({nameError: "Select Language"}));
            return false
        }

        else {
            this.setState(() => ({ nameError: null }));
            return true
        }
    }

    savePassoword = async() => {
        if(await this.validateTextInput()){
            console.log("need to add save route")
            axios.post("http://"+ipAddress+":3000/saveNewPassword", {
                email: this.state.email,
                currentPassword: then.state.currentPassword,
                newPassword: this.state.newPassword
            })
            .then(async (response) => {
                console.log("response signup", response);
                if (response.status == 201){
                    alert("Change Password successful", [{
                        text: "Okay"
                    }])

                    this.props.navigation.navigate('Profile')
                }
                
            })
            .catch(err => {
                var error = err.response
                if (error.status == 404){
                    console.log("password change", error)
                    alert("The current password entered is wrong", [{
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

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container style={commonStyles.container}>
                <Header style={commonStyles.header}>
                    <Left>
                        <Button transparent
                        onPress={() => {navigate('Profile')}}>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{alignSelf: "flex-start", color: secondaryColor, fontSize: 22}}>CHANGE PASSWORD</Title>
                    </Body>
                </Header>
                <Content>
                    <Form>
                        <Item stackedLabel>
                            <Label>Current Password</Label>
                            <Input onChangeText={(currPass) => {
                                this.setState({
                                    currentPassword: currPass
                                })
                            }} />
                        </Item>
                        <Item stackedLabel last>
                            <Label>New Password</Label>
                            <Input onChangeText={(newPass) => {
                                this.setState({
                                    newPassword: newPass
                                })
                            }} />
                        </Item>
                        <Item stackedLabel last>
                            <Label>Confirm Password</Label>
                            <Input onChangeText={(confPass) => {
                                this.setState({
                                    confirmPassword: confPass,
                                    changed: true
                                })
                            }} />
                        </Item>
                    </Form>
                    {this.state.changed?(
                            <TouchableHighlight 
                            style={commonStyles.button}
                            onPress={() => {this.savePassoword()}} >
                                <Text style= {commonStyles.buttonText}>SAVE</Text>
                            </TouchableHighlight>
                        ):(
                            <TouchableHighlight 
                            style={[commonStyles.button, { backgroundColor: disabledColor }]}>
                                <Text style= {commonStyles.buttonText}>SAVE</Text>
                            </TouchableHighlight>
                        )}
                </Content>
            </Container>
        )
    }
}