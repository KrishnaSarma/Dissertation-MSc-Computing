import React, {Component} from 'react';
import {View, Text, ActivityIndicator, Button, ImageBackground, TouchableHighlight} from 'react-native';
import {homeStyles} from "../style/homeScreen";

export default class HomeScreen extends Component{

    constructor(props) {
        super(props);
    
        this.state = {
            loading: true
        };
    }

    componentDidMount(){
        this.setState({
            loading: false
        })
    }

    
    render(){
        const {navigate} = this.props.navigation;
        return(        
            <View
            style = {[{flex: 1}, homeStyles.container]}>
                {
                    this.state.loading ? (
                        <View><ActivityIndicator size="large" color="grey" /></View>
                    ) : (
                        <View 
                        style = {homeStyles.container}>                       
                            <ImageBackground 
                            source={require('../images/homeBackground.jpg')} 
                            style={homeStyles.backgroundImage}>
                                <View 
                                style = {{
                                    justifyContent: "space-around",
                                    alignSelf: "center",
                                    height: "80%",
                                    width: "90%"
                                }}>
                                    <View 
                                    style={{
                                        flex: 3,
                                        justifyContent: "center"
                                    }}>

                                        <Text 
                                        style={homeStyles.titleText}>
                                            Welcome to
                                        </Text>
                                        <Text 
                                        style = {homeStyles.appNameText}>
                                            myChat
                                        </Text>
                                    </View>
                                    <View style= {{flex: 1, justifyContent: "center"}}>
                                        <TouchableHighlight 
                                        style={homeStyles.button}
                                        onPress={() => navigate('Login')} >
                                            <Text style= {homeStyles.buttonText}>LOGIN</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style= {{flex: 1, justifyContent: "center"}}>
                                        <TouchableHighlight 
                                        style={homeStyles.button}
                                        onPress={() => navigate('Signup')}>
                                            <Text style= {homeStyles.buttonText}>SIGN UP</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    )
                }
            </View>
        )
    }
}