import React, {Component} from 'react';
import {TouchableOpacity, Image, Picker} from 'react-native';
import axios from 'axios';
import {ipAddress, secondaryColor} from "../constants"

import { Container, Content, Header, Left,
    Body, Right, Button, Icon, Title,
    Form, Item, Input, Text} from 'native-base';

import { commonStyles } from '../style/commonStyle';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from "react-native-firebase";

export default class SignupScreen extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            language: "",
            languages: [],            
            showPassword: false,
            showConfirmPassword: false,
            icon: "eye",
            cPIcon: "eye"
        }
    }

    componentDidMount = async () =>{
        await this.getLanguages();
    }

    showAlert = (msg) => {
        alert(msg, [{
            text: "Okay"
        }])
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
                    this.showAlert("Internal server error")
                }
                else{
                    this.showAlert(err)
                }
              });
    }

    validateTextInput(){

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

        if (this.state.email.trim() === "") {
            this.showAlert("Email Required")
        }
        
        else if (reg.test(this.state.email.trim()) === false) {
            this.showAlert("Invalid Email")
            // this.setState(() => ({nameError: "Invalid Email"}));
        }

        else if (this.state.username.trim() == "") {
            this.showAlert("Username Required")
            // this.setState(() => ({nameError: "Username required."}));
        }

        else if (this.state.password.trim() == "") {
            this.showAlert("Password Required")
            // this.setState(() => ({nameError: "Password required."}));
        }

        else if (this.state.confirmPassword.trim() == "") {
            this.showAlert("Confirm Password Required")
            // this.setState(() => ({nameError: "Confirm Password required."}));
        }

        else if (this.state.password.trim() != this.state.confirmPassword.trim()){
            this.showAlert("Password Don't Match")
            // this.setState(() => ({nameError: "Password don't match"}));
        }

        else if (this.state.language == "") {
            this.showAlert("Select Language")
            // this.setState(() => ({nameError: "Select Language"}));
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
                this.showAlert("Internal Server Error")
            }
            else{
                this.showAlert(err)
            }
        })
    }

    signup(){
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(async (user) => {
            console.log("1 after signup", user)
            if(user){
                await this.addUserData()
                this.showAlert("Signup Successful")
            }

        })
        .catch((error) => {
            const { code, message } = error;
            console.log("signup error", code, message)
            this.showAlert(message)
        });
    }

    _changeIcon = () => {
        this.setState(prevState => ({
            icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
            showPassword: !prevState.showPassword
        }));
    }

    _changeCPIcon = () =>{
        this.setState(prevState => ({
            cPIcon: prevState.cPicon === 'eye' ? 'eye-off' : 'eye',
            showConfirmPassword: !prevState.showConfirmPassword
        }));
    }

    render(){
        const {navigate} = this.props.navigation;
        return(
            <Container style={commonStyles.container}>
                <Header style={commonStyles.header}>
                    <Left>
                        <Button transparent
                        onPress={() => {navigate('Home')}}>
                        <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title 
                        style={{alignSelf: "flex-end", color: secondaryColor, fontSize: 22}}>
                            SIGNUP
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <Content contentContainerStyle={{
                    alignSelf: "center",
                    width: "80%",
                    flex: 1 }}>
                    <Image
                    style={[commonStyles.icon, {marginBottom: 50, marginTop: 30}]}
                    source={require('../images/icon.jpg')}
                    />

                    <Form >
                        <Item>
                            <Input 
                            placeholder= "Email"
                            onChangeText= {(email) => this.setState({email})}/>
                        </Item>
                        <Item>
                            <Input 
                            placeholder= "Username"
                            onChangeText= {(username) => this.setState({username})}/>
                        </Item>
                        <Item>
                            <Input
                            placeholder="Password"
                            value={this.state.password} 
                            secureTextEntry={!this.state.showPassword}
                            onChangeText={(password) => this.setState({password})}/>                           
                            <Icon name={this.state.icon} onPress={() => this._changeIcon()} />
                        </Item>
                        <Item>
                            <Input
                            placeholder="Confirm Password"
                            value={this.state.confirmPassword} 
                            secureTextEntry={!this.state.showConfirmPassword}
                            onChangeText={(confirmPassword) => this.setState({confirmPassword})}/>                           
                            <Icon name={this.state.cPIcon} onPress={() => this._changeCPIcon()} />
                        </Item>
                    </Form>
                    <Picker
                        style={{ height: 50, width: "100%", textAlign: "center", marginLeft: 15}}
                        mode="dropdown"
                        selectedValue={this.state.language}
                        onValueChange={(itemValue)=>{
                            this.setState({ 
                                language: itemValue,
                                changed: true })
                        }}>
                            {this.state.languages.map((item, index) => {
                                return (<Picker.Item 
                                    style= {{width: "100%"}} label={item.name} value={item.code} key={index}/>) 
                            })}
                    </Picker>
                    <TouchableOpacity 
                        style={commonStyles.button}
                        onPress={() => {this.validateTextInput()}} >
                            <Text style= {commonStyles.buttonText}>SIGN UP</Text>
                    </TouchableOpacity>
                </Content>
            </Container>
        )
    }
}