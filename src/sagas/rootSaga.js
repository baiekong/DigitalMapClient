import { all, call } from 'redux-saga/effects';
import dog from './dogSaga';
import auth from './authSaga';
function* rootSaga() {
  yield all([call(dog), call(auth)]);
}

export default rootSaga;
