import { takeLatest, call, put } from 'redux-saga/effects';

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield takeLatest('API_CALL_REQUEST', workerSaga);
}

// function that makes the api request and returns a Promise for response
function fetchDog(params) {
  
  return fetch('https://dog.ceo/api/breeds/image/random')
  .then(function(data) {
    // Here you get the data to modify as you please
    return data.json()
    })
  .catch(function(error) {
    // If there is any error you will catch them here
    return error
  });   
  /*return axios({
    method: 'get',
    url: 'https://dog.ceo/api/breeds/image/random'
  });*/
}

// worker saga: makes the api call when watcher saga sees the action
function* workerSaga(action) {
  try {

    const response = yield call(fetchDog, action);
    const dog = response.message;

    // dispatch a success action to the store with the new dog
    yield put({ type: 'API_CALL_SUCCESS', dog });
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: 'API_CALL_FAILURE', error });
  }
}