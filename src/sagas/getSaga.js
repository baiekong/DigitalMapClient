import { takeLatest, call, put } from 'redux-saga/effects';
//export const delay = (ms) => new Promise(res => setTimeout(res, ms))

// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  //yield call(delay, 5000)
  yield takeLatest('API_GET_CALL_REQUEST', workerSaga);
}

// function that makes the api request and returns a Promise for response
function fetchForm(params) {
  console.log(params);
  let url = params.payload.url;
  let filter = params.payload.filter;
  let label = params.payload.label;
  console.log(filter);
  // for post to server
  return fetch(url,{
    //method: "GET",
    //headers: { "Content-Type": "application/json", Cache: "no-cache" },
    //credentials: "include",
    //make sure to serialize your JSON body
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({...filter})
  })
  .then(function(data) {
    // Here you get the data to modify as you please
    console.log("fetch ",data)
    return {data: data, label:label};
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
    const json = yield call([response.data, 'json']);
    let res = [];
    res[response.label] = json;
    console.log("Worker Saga ",action,response.data)

    // dispatch a success action to the store with the new dog
    //yield put({ type: 'API_GET_CALL_SUCCESS', result:res,label:response.label });
    yield put({type: 'API_GET_CALL_SUCCESS', result:json,label:response.label})
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: 'API_GET_CALL_FAILURE', error });
  }
}