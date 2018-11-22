import { combineReducers } from 'redux'
import ui from './ui'
import { reducer as formReducer } from 'redux-form'
import literals from './literals';
import api from './api';
import auth from './auth';
import websocket from './websocket';

export default combineReducers({
  ui,
  literals,
  api,
  auth,
  websocket,
  form: formReducer
})
