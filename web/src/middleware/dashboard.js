import firebase from 'firebase';
import { hashHistory } from 'react-router';
import * as api from '../actions/dashboard.js';

const middleware = store => next => (action) => {
  switch (action.type) {
    case api.JOIN_ROOM: {
      // Listeners
      firebase.database().ref(`rooms/${action.roomId}/questionData`)
        .on('value', snapshot => store.dispatch(api.listenOnQuestionData(snapshot)));
      firebase.database().ref(`rooms/${action.roomId}/chat`)
        .on('value', snapshot => store.dispatch(api.listenOnChatData(snapshot)));
      firebase.database().ref(`rooms/${action.roomId}/pollData`)
        .on('value', snapshot => store.dispatch(api.listenOnPollData(snapshot)));

      next(action);
      return hashHistory.push('/dashboard');
    }
    case api.CREATE_ROOM: {
      firebase.database().ref(`rooms/${action.roomId}`).set({
        roomcode: action.roomId,
        storedActivities: [],
        questions: [],
        chat: [],
      });

      // listeners
      firebase.database().ref(`rooms/${action.roomId}/questionData`)
        .on('value', snapshot => store.dispatch(api.listenOnQuestionData(snapshot)));
      firebase.database().ref(`rooms/${action.roomId}/chat`)
        .on('value', snapshot => store.dispatch(api.listenOnChatData(snapshot)));
      firebase.database().ref(`rooms/${action.roomId}/pollData`)
        .on('value', snapshot => store.dispatch(api.listenOnPollData(snapshot)));

      next(action);
      return hashHistory.push('/dashboard');
    }
    case api.UPDATE_QUESTIONS: {
      const { roomId } = store.getState().dashboard;
      firebase.database().ref(`rooms/${roomId}/questionData`).set(
        action.newData,
      );
      return next(action);
    }
    case api.UPDATE_CHAT: {
      const { roomId } = store.getState().dashboard;
      firebase.database().ref(`rooms/${roomId}/chat`).set(
        action.newData,
      );
      return next(action);
    }
    case api.UPDATE_POLLS: {
      const { roomId } = store.getState().dashboard;
      firebase.database().ref(`rooms/${roomId}/pollData`).set(
        action.newData,
      );
      return next(action);
    }
    default: {
      return next(action);
    }
  }
};

export default middleware;
