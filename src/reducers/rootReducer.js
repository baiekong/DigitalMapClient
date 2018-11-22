import { combineReducers } from 'redux'
import ui from './ui'
import { reducer as formReducer } from 'redux-form'
import literals from './literals';
import api from './api';
import auth from './auth';
import map from './map';
import websocket from './websocket';
import search from './search';
import locationForm from './ui/locationForm';

export default combineReducers({
  ui,
  literals,
  api,
  auth,
  websocket,
  map,
  locationForm,
  search,
  form: formReducer
})
