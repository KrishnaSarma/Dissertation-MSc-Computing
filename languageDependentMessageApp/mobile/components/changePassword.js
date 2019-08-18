import React, {Component} from 'react';
import {TouchableHighlight} from 'react-native';
import axios from 'axios';

import { Container, Content, Header, Left,
    Body, Button, Icon, Title, Item, Input, Text, Form, Label } from 'native-base';

import {ipAddress, secondaryColor, disabledColor} from "../constants"
import { commonStyles } from '../style/commonStyle';

import {getUserEmail} from "./commonGetMethods";

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
        var email = await getUserEmail();
        await this.setState({email})
    }

    validateTextInput(){

        if (this.state.newPassword.trim() == "") {
            alert("Password required.", [{
                text: "Okay"
            }])
        }

        else if (this.state.confirmPassword.trim() == "") {
            alert("Confirm Password required.", [{
                text: "Okay"
            }])
        }

        else if (this.state.newPassword.trim() != this.state.confirmPassword.trim()){
            alert("Password don't match", [{
                text: "Okay"
            }])
        }

        else {
            this.savePassoword()
        }
    }

    savePassoword = async() => {
        axios.post("http://"+ipAddress+":3000/changePassword", {
            email: this.state.email,
            currentPassword: this.state.currentPassword,
            newPassword: this.state.newPassword
        })
        .then((response) => {
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
                            onPress={() => {this.validateTextInput()}} >
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