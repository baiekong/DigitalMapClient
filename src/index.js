import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore, { history } from './config/configureStore';
import Login from './Components/Login';
import { Route, Switch } from 'react-router';

import { loadLiterals } from './reducers/literals';
import loadLang from './i18n';
import Cookies from 'js-cookie';
import Configs from './config/config';

const store = configureStore();
const lang = loadLang();
const env = process.env.NODE_ENV;

/*
let counter = 0;
setInterval(() => {
  counter = counter + 1;
  console.log(counter);
}, 1000);
*/

// Cookie Timer
var clearCookieTimer = null;

const clearCookieFunction = () => {
  Cookies.remove('user_sid');
};

clearCookieTimer = setTimeout(clearCookieFunction, Configs[env].IDLE_TIMEOUT);

// Listen window events and reset clear cookie timer
const listenerEvents = ['mousemove', 'click', 'keypress'];
for (let n = 0; n < listenerEvents.length; n++) {
  window.addEventListener(listenerEvents[n], ev => {
    if (clearCookieTimer) {
      clearTimeout(clearCookieTimer);
      clearCookieTimer = null;
      clearCookieTimer = setTimeout(clearCookieFunction, Configs[env].IDLE_TIMEOUT);
    }
  });
}

store.dispatch(loadLiterals(lang));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path='/login' component={Login} />
        <App />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
