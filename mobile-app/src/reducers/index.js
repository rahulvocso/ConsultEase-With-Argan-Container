import { combineReducers } from 'redux';
import chat from './chat';
import drawer from './drawer';
import media from './media';
import meeting from './meeting';
import snack from './snack';
import socket from './socket';
import user from './user';

const Reducer = combineReducers({
  chat,
  drawer,
  media,
  meeting,
  snack,
  socket,
  user,
});

export default Reducer;
