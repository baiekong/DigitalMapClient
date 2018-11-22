import { takeLatest, call, put } from 'redux-saga/effects';
//export const delay = (ms) => new Promise(res => setTimeout(res, ms))

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  //yield call(delay, 5000)
  yield takeLatest('API_CALL_REQUEST', workerSaga);
}

// function that makes the api request and returns a Promise for response
function fetchForm(params) {
  console.log(params);
  let url = params.payload.url;
  let form = params.payload.form;
  console.log(form);
  // for post to server
  return fetch(url,{
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({...form})
  })
  .then(function(data) {
    // Here you get the data to modify as you please
    return data
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

    const response = yield call(fetchForm, action);
    

    // dispatch a success action to the store with the new dog
    yield put({ type: 'API_CALL_SUCCESS', result:response});
  
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: 'API_CALL_FAILURE', error });
  }
}