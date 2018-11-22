import { all, call } from 'redux-saga/effects';
import form from './formSaga';
import auth from './authSaga';
import get from './getSaga';

function* rootSaga() {
  yield all([
    call(get),
    call(form), 
    call(auth),
  ]);
}

export default rootSaga;
