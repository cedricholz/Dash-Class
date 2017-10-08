import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Constants } from 'expo';
import * as firebase from 'firebase'; // 4.5.0
import { CheckBox } from 'react-native-elements'; // 0.17.0

import "@expo/vector-icons"; // 5.2.0

const config = {
  apiKey: 'AIzaSyD8znqS3A56dxWQM7ErR2b4Ix0cgF60qeY',
  authDomain: 'dash-class.firebaseapp.com',
  databaseURL: 'https://dash-class.firebaseio.com',
  projectId: 'dash-class',
  storageBucket: 'dash-class.appspot.com',
  messagingSenderId: '912068390452',
};

try {
  firebase.initializeApp(config);
} catch (e) {
  console.log('App reloaded, so firebase did not re-initialize');
}

export default class App extends Component {
  state = {
    roomcode: '',
    currentView: 'login',
    inputCode: '',
    studentQuestion: '',
    studentMessage: '',
    questionData: [],
    chat: [],
    pollData: [{}],
    username: '',
  };

  _handleroomInputTextChange = inputCode => {
    this.setState({ inputCode });
  };

  _handleEnterRoom = roomcode => {
    this.setState({ roomcode: roomcode });
    this.setState({ currentView: 'questions' });

    var qs = firebase.database().ref('rooms/' + roomcode + '/questionData');
    
    qs.on('value', snapshot => {
      this.setState({ questionData: snapshot.val() || [] });
    });
    
    var c = firebase.database().ref('rooms/' + roomcode + '/chat');
   
    c.on('value', snapshot => {
      this.setState({ chat: snapshot.val() || [] });
    });
    
    var p = firebase.database().ref('rooms/' + roomcode + '/pollData');
   
    p.on('value', snapshot => {
      this.setState({ pollData: snapshot.val() || [] });
    });

    firebase
      .database()
      .ref('/rooms/' + roomcode + '/users')
      .once('value')
      .then(snapshot => {
        var name =
          'Anonymous-' +
          Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 3);
        while (snapshot.hasChild(name)) {
          name =
            'Anonymous-' +
            Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 3);
        }
        this.setState({ username: name });

        var users = snapshot.val().push(name);
        firebase.database().ref('rooms/' + roomcode + '/users').set({
          users,
        });
      });
  };

  _handleEnterWithCode = () => {
    firebase.database().ref('/rooms/').once('value').then(snapshot => {
      if (snapshot.hasChild(this.state.inputCode)) {
        this._handleEnterRoom(this.state.inputCode);
      } else {
        Alert.alert('Invalid Code', 'Check code again and retry.');
      }
    });
  };

  _handleCreateRoom = () => {
    firebase.database().ref('/rooms/').once('value').then(snapshot => {
      var rc = Math.random()
        .toString(36)
        .replace(/[^a-z1-9]+/g, '')
        .substr(0, 5);

      while (snapshot.hasChild(rc)) {
        rc = Math.random().toString(36).replace(/[^a-z1-9]+/g, '').substr(0, 5);
      }

      firebase.database().ref('rooms/' + rc).set({
        roomcode: rc,
        storedActivities: [],
        questions: [],
        chat: [],
        users: [],
      });

      this._handleEnterRoom(rc);
    });
  };

  _handleQuestions = () => {
    this.setState({ currentView: 'questions' });
  };
  _handlePolls = () => {
    this._create_poll();
    this.setState({ currentView: 'polls' });
  };
  _handleChat = () => {
    this.setState({ currentView: 'chat' });
  };

  _handleQuestionTextChange = studentQuestion => {
    this.setState({ studentQuestion });
  };

  _handleMessageTextChange = studentMessage => {
    this.setState({ studentMessage });
  };

  _handleAskQuestion = () => {
    var q = this.state.studentQuestion;

    if (q.length > 0) {
      var q_obj = { upvotes: 1, text: q, answered: false };
      this.state.questionData.push(q_obj);

      firebase.database().ref('rooms/' + this.state.roomcode + '/questionData').set(
        this.state.questionData
      );

      this.setState({ studentQuestion: '' });
    }
  };

  _handleSendMessage = () => {
    var m = this.state.studentMessage;

    if (m.length > 0) {
      var ts = Math.floor(Date.now() / 1000);
      var m_obj = { username: this.state.username, text: m, timestamp: ts };

      this.state.chat.push(m_obj);

      firebase.database().ref('rooms/' + this.state.roomcode+'/chat').set(
        this.state.chat,
      );

      this.setState({ studentMessage: '' });
    }
  };
  
  _radioFunction = () => {
      var x = 4;
  };

  render() {
    switch (this.state.currentView) {
      case 'login':
        return (
          <View style={styles.container}>

            <Text style={styles.paragraph}>
              Enter class code to join
            </Text>

            <TextInput
              value={this.state.inputCode}
              onChangeText={this._handleroomInputTextChange}
              style={{ width: 200, height: 44, padding: 8 }}
            />
            <Button title="Enter" onPress={this._handleEnterWithCode} />

            <Button title="Create Room" onPress={this._handleCreateRoom} />
          </View>
        );

      case 'questions':
        return (
          <View style={styles.room}>
            <View style={styles.roomWindow}>
              <Text style={styles.paragraph}>

                Room Code: {this.state.roomcode}
              </Text>

            </View>

            <View style={styles.questions}>

              {this.state.questionData.map(item => (
                <Text>
                  {item.text}
                </Text>
              ))}

              <TextInput
                value={this.state.studentQuestion}
                onChangeText={this._handleQuestionTextChange}
                style={{ width: 200, height: 44, padding: 8 }}
              />

              <Button title="Ask" onPress={this._handleAskQuestion} />

            </View>

            <View style={styles.roomButtons}>
              <Button title="Questions" onPress={this._handleQuestions} />
              <Button title="Polls" onPress={this._handlePolls} />
              <Button title="Chat" onPress={this._handleChat} />
            </View>

          </View>
        );
      case 'chat':
        return (
          <View style={styles.room}>
            <View style={styles.roomWindow}>
              <Text style={styles.paragraph}>

                Room Code: {this.state.roomcode}
              </Text>

            </View>

            <View style={styles.questions}>

              {this.state.chat.map(item => (
                <Text>
                  {item.username + ': ' + item.text}
                </Text>
              ))}

              <TextInput
                value={this.state.studentMessage}
                onChangeText={this._handleMessageTextChange}
                style={{ width: 200, height: 44, padding: 8 }}
              />

              <Button title="Send" onPress={this._handleSendMessage} />

            </View>

            <View style={styles.roomButtons}>
              <Button title="Questions" onPress={this._handleQuestions} />
              <Button title="Polls" onPress={this._handlePolls} />
              <Button title="Chat" onPress={this._handleChat} />
            </View>

          </View>
        );
        case 'polls':
        return (
          <View style={styles.room}>
            <View style={styles.roomWindow}>
              <Text style={styles.paragraph}>

                Room Code: {this.state.roomcode}
              </Text>

            </View>

            <View style={styles.questions}>
            
                {this.state.pollData.options.map(item => (
                  <CheckBox title="Click this one bbbrrrooo" checked={item.text === this.state.checked} onClick={this._radioFunction}/>
                ))}

              <Button title="Send" onPress={this._handleSendMessage} />

            </View>

            <View style={styles.roomButtons}>
              <Button title="Questions" onPress={this._handleQuestions} />
              <Button title="Polls" onPress={this._handlePolls} />
              <Button title="Chat" onPress={this._handleChat} />
            </View>

          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  room: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  questions: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomWindow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  roomButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});