import React, {Component} from 'react';
import {View, TouchableHighlight} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import { Container, Content, Header, Left,
    Body, Right, Button, Icon, Title,
    Thumbnail, List, ListItem, Item, Input, Text } from 'native-base';

import {ipAddress, secondaryColor, primaryColor, disabledColor} from "../constants"
import { commonStyles } from '../style/commonStyle';
import { profileStyles } from "../style/profileScreenStyle";

export default class ProfileScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            prevEmail: "",
            prevUsername: "",
            newEmail: "",
            newUsername: "",
            changed: false
        }
    }

    componentDidMount = async() => {
        await this.getUsername();
        await this.getUserEmail();
    }

    getUsername = async () => {
        try{
            const username = await AsyncStorage.getItem('username')
            console.log("username in profile screen", username);
            await this.setState({
                prevUsername: username
            })
            console.log("username in state", this.state.prevUsername)
        }
        catch(e){
            console.log(e);
        }
        
    }

    getUserEmail = async () => {
        try{
            const email = await AsyncStorage.getItem('email')
            console.log("email in user screen", email);
            await this.setState({
                prevEmail: email
            })
            console.log("email in state", this.state.prevEmail)
        }
        catch(e){
            console.log(e);
        }
        
    }

    validateEmail(){       

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if (this.state.newEmail.trim() === "") {
            this.setState(() => ({ nameError: "Email required." }));
            return false
        }
        
        else if (reg.test(this.state.newEmail.trim()) === false) {
            this.setState(() => ({nameError: "Invalid Email"}));
            return false
        }
        else{
            return true
        }
    }

    saveChanges = async() => {
        if(await this.validateEmail()){
            console.log("need to add save route")
            axios.post("http://"+ipAddress+":3000/saveUserDetails", {
            email: this.state.email,
            username: this.state.username
            })
            .then(async (response) => {
                console.log("response signup", response);
                if (response.status == 201){                
                    await this.setValue(response.data.topicName)
                    alert("Sign up successful", [{
                        text: "Okay"
                    }])
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
        else{
            // alert
        }
    }

    logout = async (navigate) => {
        console.log('logout pressed');
        this.removeValue()
        await firebase.messaging().unsubscribeFromTopic(this.state.topicName);
        navigate("Home")
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container style={commonStyles.container}>
                <Header style={commonStyles.header}>
                    <Left>
                        <Button transparent
                        onPress={() => {navigate('Users')}}>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{alignSelf: "flex-end", color: secondaryColor, fontSize: 22}}>Profile</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={profileStyles.content}>
                    <Thumbnail 
                    style={profileStyles.picture} 
                    large 
                    source={require('../images/profilePicture.jpg')} />
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>Username</Text>
                        <Input style={profileStyles.input} placeholder={this.state.prevUsername}
                        onChangeText={(username) => {
                            this.setState({
                                newUsername: username,
                                changed: true
                            })}} />
                    </Item>
                    <Item style= {{flexDirection: "row"}} regular>
                        <Text style= {profileStyles.text}>Email</Text>
                        <Input style={profileStyles.input} placeholder={this.state.prevEmail}
                        onChangeText={(email) => {
                            this.setState({
                                newEmail: email,
                                changed: true
                            })}} />
                    </Item>
                    <List>
                        <ListItem onPress={()=>navigate('passwordChange')}>
                            <Left>
                                <Text style={{fontSize: 22}}>Change Password</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>
                    </List>
                    {this.state.changed?(
                        <TouchableHighlight 
                        style={profileStyles.button}
                        onPress={() => {this.saveChanges()}} >
                            <Text style= {profileStyles.buttonText}>SAVE</Text>
                        </TouchableHighlight>
                    ):(
                        <TouchableHighlight 
                        style={[profileStyles.button, { backgroundColor: disabledColor }]}>
                            <Text style= {profileStyles.buttonText}>SAVE</Text>
                        </TouchableHighlight>
                    )}

                    {!!this.state.nameError && (
                        <Text style={{ color: "red" }}>{this.state.nameError}</Text>
                    )}

                    <TouchableHighlight 
                    style={profileStyles.button}
                    onPress={() => {this.logout(navigate)}} >
                        <Text style= {profileStyles.buttonText}>LOGOUT</Text>
                    </TouchableHighlight>

                    {/* <List>
                        <ListItem>
                            <Text>Simon Mignolet</Text>
                            <Text>Simon Mignolet</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Nathaniel Clyne</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Dejan Lovren</Text>
                        </ListItem>
                    </List> */}
                </Content>
            </Container>
        )
    }
}