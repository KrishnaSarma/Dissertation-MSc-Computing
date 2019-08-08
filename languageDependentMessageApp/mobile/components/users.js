import React, {Component} from 'react';
import {Text, View, Button, FlatList, ActivityIndicator, TouchableHighlight } from 'react-native';
// import { List, ListItem, SearchBar } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {ipAddress} from "../constants"

// import { FlatList } from 'react-native-gesture-handler';

export default class UsersScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            users: [],
            loading: false,
            page: 1,
            seed: 1,
            error: null,
            refreshing: false
        };
    }

    componentDidMount = async () => {
        console.log("in users")

        await this.getUsername();
        await this.getUserList();
    }

    getUserList = () => {

        axios.get("http://"+ipAddress+":3000/users", {
            params: {
                email: this.state.email
            }
        })
            .then((response) => {
                console.log("users response", response)
                if (response.status == 201){
                    this.setState({
                        users : response.data 
                    })
                }
                console.log("user list", this.state.users)
                
            })
            .catch(err => {
                alert("Couldn't load users. Please refresh page and try again.", [{
                    text: "Okay"
                }])
            })

    }

    getUsername = async () => {
        try{
            const user = await AsyncStorage.getItem('email')
            console.log("email in user screen", user);
            await this.setState({
                email: user
            })
            console.log("email in state", this.state.email)
        }
        catch(e){
            console.log(e);
        }
        
    }
    
    removeValue = async () => {
        try {
            await AsyncStorage.removeItem('isLoggedIn')
            await AsyncStorage.removeItem('email')
        } catch(e) {
            console.log(e)
        }
    }

    logout = async (navigate) => {
        console.log('logout pressed');
        this.removeValue()
        navigate("Home")
    }

    // handleRefresh = () => {
    //     this.setState(
    //     {
    //         page: 1,
    //         seed: this.state.seed + 1,
    //         refreshing: true
    //         },
    //         () => {
    //             this.getUserList();
    //     }
    //     );
    // };
    
    // handleLoadMore = () => {
    // this.setState(
    //     {
    //         page: this.state.page + 1
    //     },
    //     () => {
    //         this.getUserList();
    //     }
    // );
    // };
    
    // renderSeparator = () => {
    // return (
    //     <View
    //     style={{
    //         height: 1,
    //         width: "86%",
    //         backgroundColor: "#CED0CE",
    //         marginLeft: "14%"
    //     }}
    //     />
    // );
    // };

    // renderHeader = () => {
    // return <SearchBar placeholder="Type Here..." lightTheme round />;
    // };

    // renderFooter = () => {
    // if (!this.state.loading) return null;

    // return (
    //     <View
    //         style={{
    //             paddingVertical: 20,
    //             borderTopWidth: 1,
    //             borderColor: "#CED0CE"
    //         }}
    //         >
    //         <ActivityIndicator animating size="large" />
    //     </View>
    // );
    // };
    


    render(){

        const {navigate} = this.props.navigation;
        return(
            <View>                
                <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => this.logout(navigate)}
                    title="Logout"
                />
                {/* <Text style = {{height: 40, width: 50}}>
                    "User Screen"
                </Text> */}

                {/* <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <FlatList
                    data={this.state.users}
                    renderItem={({ item }) => (
                        <ListItem
                        // roundAvatar
                        title={`${item}`}
                        // subtitle={item.email}
                        // avatar={{ uri: item.picture.thumbnail }}
                        containerStyle={{ borderBottomWidth: 0 }}
                        />
                    )}
                    // keyExtractor={item => item.email}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={50}
                    />
                </List> */}

                <FlatList
                data={this.state.users}
                renderItem={({item, index, separators}) => (
                    <TouchableHighlight
                      onPress={() => navigate('Chat', {
                                reciever: item.email
                            })}
                      onShowUnderlay={separators.highlight}
                      onHideUnderlay={separators.unhighlight}>
                      <View style={{backgroundColor: 'white'}}>
                        <Text>{item.username}</Text>
                      </View>
                    </TouchableHighlight>
                  )}
                />

                {/* <Button 
                    style={{ height : 40, width : 40 }}
                    onPress={() => navigate('Chat', {
                        socket: this.socket
                    })}
                    title="Go to chat"
                /> */}
            </View>
        )
    }
}