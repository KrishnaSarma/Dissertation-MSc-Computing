import React, {Component} from 'react';
import {View, Text, ActivityIndicator, Image, TouchableHighlight} from 'react-native';
import {homeStyles} from "../style/homeScreenStyle";
import { commonStyles } from '../style/commonStyle';
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
            style = {[commonStyles.container, homeStyles.container]}>
                {
                    this.state.loading ? (
                        <View><ActivityIndicator size="large" color="grey" /></View>
                    ) : (
                        <View 
                        style = {homeStyles.content}>
                            <Image
                            style={[{flex: 2}, commonStyles.icon]}
                            source={require('../images/icon.jpg')}
                            />
                            <View 
                            style={{
                                flex: 4,
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
                                onPress={() => {
                                    console.log("Signup pressed")
                                    navigate('Signup')
                                }}>
                                    <Text style= {homeStyles.buttonText}>SIGN UP</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )
                }
            </View>
        )
    }
}