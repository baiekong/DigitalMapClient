import { takeLatest, call, put } from "redux-saga/effects";
import { authActionTypes } from "../reducers/auth";
import Configs from "../config/config";
const env = process.env.NODE_ENV;

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield takeLatest(authActionTypes.authLoginRequest, loginWorkerSaga);
  yield takeLatest(authActionTypes.isAuthenticated, isAuthWorkerSaga);
}

// function that makes the api request and returns a Promise for response
function fetchLogin(params) {
  return fetch(Configs[env].BACKEND_HOST + "/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      ...params.payload
    }),
    headers: { "Content-Type": "application/json", Cache: "no-cache" },
    credentials: "include"
  })
    .then(function(data) {
      console.log(data);
      // Here you get the data to modify as you please
      return data.json();
    })
    .catch(function(error) {
      // If there is any error you will catch them here
      return error;
    });
}

function fetchIsAuthenticated(params) {
  return fetch(Configs[env].BACKEND_HOST + "/api/auth", {
    method: "GET",
    headers: { "Content-Type": "application/json", Cache: "no-cache" },
    credentials: "include"
  })
    .then(function(data) {
      // Here you get the data to modify as you please
      return data.json();
    })
    .catch(function(error) {
      // If there is any error you will catch them here
      return error;
    });
}

// worker saga: makes the api call when watcher saga sees the action
function* loginWorkerSaga(action) {
  try {
    const response = yield call(fetchLogin, action);

    // dispatch a response action
    yield put({ type: authActionTypes.authLoginResponse, ...response });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: authActionTypes.authLoginError, error });
  }
}

function* isAuthWorkerSaga(action) {
  try {
    const response = yield call(fetchIsAuthenticated, action);

    // dispatch a response action
    yield put({ type: authActionTypes.authLoginResponse, ...response });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: authActionTypes.authLoginError, error });
  }
}
