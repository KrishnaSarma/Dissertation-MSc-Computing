import React, {Component} from 'react';
import {View, Text, ActivityIndicator, Button, ImageBackground} from 'react-native';
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
            style = {{
                // flex: 1,
                // flexDirection: "column",
                justifyContent: 'center',
                alignSelf: "center",
                backgroundColor: "red"
                // width: "100%"
            }}>
                {
                    this.state.loading ? (
                        <View><ActivityIndicator size="large" color="grey" /></View>
                    ) : (
                        <View 
                        style = {{height: "100%",
                        width: "100%",
                        flex: 1,
                        justifyContent: "center",
                        alignSelf: "center"
                        }}>                       
                            <ImageBackground source={require('../images/welcome_background1.jpg')} style={{
                            // flex: 1,
                            resizeMode: 'cover',
                            justifyContent: "center",
                            width: "100%",
                            height: "100%"
                            // opacity: 0.5
                            }}>
                                <View 
                                style = {{
                                justifyContent: "space-around",
                                alignSelf: "center",
                                backgroundColor: "transparent",
                                height: "80%",
                                width: "90%"
                                }}>
                                    <View style={
                                        {flex: 1,
                                        backgroundColor: "pink",
                                    justifyContent: "center"}
                                    }>

                                    <Text style={{
                                        // margin: 20,
                                                fontSize: 45,
                                                fontWeight: "bold",
                                                textAlign: "center"
                                            }}>
                                        Welcome to
                                    </Text>
                                    <Text style = {{
                                        // margin: 20,
                                                fontSize: 40,
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                color: "red"
                                            }}>
                                        myChat
                                    </Text>
                                    </View>
                                    <View style= {{flex: 1, backgroundColor: "green", justifyContent: "center"}}>

                                    <Button
                                        style={{ 
                                            // justifyContent: "center",
                                            alignSelf: "center", 
                                            textAlign: "center",
                                            fontSize: 20}}
                                        onPress={() => navigate('Login')}
                                        title="LOG IN">
                                    </Button>
                                    <Button
                                        style={{ 
                                            // justifyContent: "center",
                                            alignSelf: "center", 
                                            textAlign: "center",
                                            fontSize: 20}}
                                        onPress={() => navigate('Signup')}
                                        title="SIGN UP">
                                    </Button>
                                    {/* <Button 
                                        style={{ height : 40, width : 40 }}
                                        onPress={() => navigate('Login')}
                                        title="Sign In"
                                    /> */}
                                    {/* <Text style = {{height : 40, width : 500, textAlign: "center"}} onPress = {() => navigate('Signup')}>
                                        New to the app? Signup here!
                                    </Text> */}
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