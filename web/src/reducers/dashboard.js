import * as api from '../actions/dashboard.js';

const defaults = {
  isAdmin: false,
  roomId: '00000',
  userId: '000',
  questionData: [],
  chatData: [],
  pollData: [],
};

const reducer = (state = defaults, action) => {
  switch (action.type) {
    case api.JOIN_ROOM: {
      return {
        ...state,
        isAdmin: false,
        roomId: action.roomId,
        userId: action.userId,
      };
    }
    case api.CREATE_ROOM: {
      return {
        ...state,
        isAdmin: true,
        roomId: action.roomId,
        userId: action.userId,
      };
    }
    case api.LISTEN_ON_QUESTION_DATA: {
      const data = action.snapshot.val() || [];
      return {
        ...state,
        questionData: data.sort((a, b) => (a.upvotes < b.upvotes)),
      };
    }
    case api.LISTEN_ON_CHAT_DATA: {
      const data = action.snapshot.val() || [];
      return {
        ...state,
        chatData: data,
      };
    }
    case api.LISTEN_ON_POLL_DATA: {
      const data = action.snapshot.val() || [];
      return {
        ...state,
        pollData: data,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
