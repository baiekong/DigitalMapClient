import { createAction, handleActions } from 'redux-actions';

// ACTION CREATORS
export const websocketMessage = createAction('WS_MESSAGE');

const initialState = {
};

// REDUCERS
export default handleActions(
  {
    [websocketMessage](state, {result}) {
        console.log(result)
      return { ...state, result };
    }
  },
  initialState
);

// SELECTORS

