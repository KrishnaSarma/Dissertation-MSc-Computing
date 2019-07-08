import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, FlatList} from 'react-native';
import axios from 'axios';
import tail from 'lodash/tail';

const serverUrl = 'http://192.168.0.13:5000';
const http = axios.create({
  baseURL: serverUrl,
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      input: '',
      messages: [],
    };
  }

  onLogin(){
    const { isLoggedIn, username } = this.state;
    if (!isLoggedIn){
      http.post('/login', {username})
        .then(() => this.onLoginSuccess())
        .catch((err) => console.log(err))
    }
  }

  onLoginSuccess(){
    this.setState({isLoggedIn: true});
    this.getMessages();
  }

  addMessage(data){
    const { messages } = this.state;
    const { id, message } = data;
    messages.push(data)
    this.setState({
      lastUpdated: new Date(),
      lastId: id,
    });
  }

  addMessageList(msgList){
    if (!msgList || msgList.length == 0){
      return;
    }
    const { messages } = this.state;
    this.setState ({
      messages: [...messages, ...list],
      lastUpdated: new Date(),
      lastId: tail(msgList).id,
    })

  }

  getMessages(){
    const { lastId } = this.state;
    http.get(lastId? '/get/${lastid}' : '/get')
      .then((response) => this.addMessageList(response.data))
      .catch((err) => console.log(err))
  }

  onMessageSend(){
    const {input, username} = this.state;
    http.post('/send', {
      username,
      message: input,
    })
      .then((response) => this.addMessage({
        message: input,
        id: response.data.id
      }));
  }

  render() {
    const { messages, isLoggedIn, lastUpdated } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text>Login</Text>
          <TextInput
             onChangeText = {(val) => this.setState({username: val})}
           />
           <Button title='Login' onPress={() => this.onLogin()} />
           <Text>Online Status: {isLoggedIn ? 'Online':'Offline'}</Text>
        </View>
        <FlatList
          data={messages}
          renderItem = {({item}) => <Text>{item.message}</Text>}
          extraData={this.state}
        />
        <TextInput
          onChangeText = {(val) => this.setState({input: val})}
        />
        <Button title="Send" onPress={() => this.onMessageSend()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
