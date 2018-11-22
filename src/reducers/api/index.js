import { createAction, handleActions } from 'redux-actions';

// ACTION CREATORS
export const apiCallRequest = createAction('API_CALL_REQUEST');
export const apiCallSuccess = createAction('API_CALL_SUCCESS');
export const apiCallFailure = createAction('API_CALL_FAILURE');

const initialState = {
  fetching: false,
  dog: null,
  error: null
};

// REDUCERS
export default handleActions(
  {
    [apiCallRequest](state, { payload }) {
      return { ...state, fetching: true, error: null};
    },
    [apiCallSuccess](state, {dog}) {
      return { ...state, fetching: false, dog: dog  };
    },
    [apiCallFailure](state, { error }) {
      return { ...state, fetching: false, dog: null, error: error };
    }
  },
  initialState
);

// SELECTORS

