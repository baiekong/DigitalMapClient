import { createAction, handleActions } from 'redux-actions';
import { create } from 'jss';

// ACTION CREATORS
export const apiCallRequest = createAction('API_CALL_REQUEST');
export const apiCallSuccess = createAction('API_CALL_SUCCESS');
export const apiCallFailure = createAction('API_CALL_FAILURE');

export const apiGetCallRequest = createAction("API_GET_CALL_REQUEST");
export const apiGetCallSuccess = createAction("API_GET_CALL_SUCCESS");
export const apiGetCallFailure = createAction("API_GET_CALL_FAILURE");

export const resetAPIResult = createAction("API_RESET_API_RESULT");

const initialState = {
  fetching: false,
  //dog: null,
  error: null,
  result:null,
  mapResult : new Map(),
};

// REDUCERS
export default handleActions(
  {
    [apiCallRequest](state, { payload }) {
      return { ...state, fetching: true, error: null};
    },
    // [apiCallSuccess](state, {dog}) {
    //   return { ...state, fetching: false, dog: dog  };
    // },
    [apiCallSuccess](state, {result}) {
      return { ...state, fetching: false, result: result};
    },
    // [apiCallFailure](state, { error }) {
    //   return { ...state, fetching: false, dog: null, error: error };
    // }
    [apiCallFailure](state, { error }) {
      return { ...state, fetching: false, result: null, error: error };
    },

    [apiGetCallRequest](state, { payload }) {
      return { ...state, fetching: true, error: null};
    },
    [apiGetCallSuccess](state, {result,label}) {
      state.mapResult.set(label,result);
      return Object.assign({ ...state, fetching: false, result: result });
    },
    [apiGetCallFailure](state, { error }) {
      return { ...state, fetching: false, result: null, error: error };
    },
    [resetAPIResult](state,{payload})
    {
      state.mapResult.set(payload,[]);
      return Object.assign({ ...state, fetching: false });
    }
  },
  initialState
);

// SELECTORS

