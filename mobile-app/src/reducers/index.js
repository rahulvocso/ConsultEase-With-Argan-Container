import { combineReducers } from 'redux';
import chat from './chat';
import drawer from './drawer';
import media from './media';
import meeting from './meeting';
import snack from './snack';
import socket from './socket';
import user from './user';
import webview from './webview';

const Reducer = combineReducers({
  chat,
  drawer,
  media,
  meeting,
  snack,
  socket,
  user,
  webview,
});

export default Reducer;
