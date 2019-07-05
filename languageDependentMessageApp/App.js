import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, Button, FlatList} from 'react-native';

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      input: '',
      messages: [],
    };
  }

  onMessageSend(){
    const {input, messages} = this.state;
    messages.push(input);
  }

  render() {
    const { messages } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem = {({item}) => <Text>{item}</Text>}
        />
        <TextInput
          onChangeText = {(val) => this.setState({input: val})}
          style={styles.welcome}
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
