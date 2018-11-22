import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/rootReducer';
import rootSaga from '../sagas/rootSaga';
import { createBrowserHistory,createHashHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import socketMiddleware from '../websocket/middleware';
import Configs from "./config";

const sagaMiddleware = createSagaMiddleware();
const env = process.env.NODE_ENV;

export const history = createBrowserHistory();
//export const history = createHashHistory();

// dev tools middleware
const composeSetup =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

function configureStore(initialState) {
  const store = createStore(
    connectRouter(history)(rootReducer), // new root reducer with router state
    initialState,
    composeSetup(
      applyMiddleware(
        socketMiddleware(Configs[env].BACKEND_HOST),
        sagaMiddleware,
        routerMiddleware(history) // for dispatching history actions
      )
    )
  );

  /**
   * next-redux-saga depends on `runSagaTask` and `sagaTask` being attached to the store.
   *
   *   `runSagaTask` is used to rerun the rootSaga on the client when in sync mode (default)
   *   `sagaTask` is used to await the rootSaga task before sending results to the client
   *
   */

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };

  // run the rootSaga initially
  store.runSagaTask();
  return store;
}

export default configureStore;
