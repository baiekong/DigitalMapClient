import { createAction, handleActions } from 'redux-actions';

// ACTION CREATORS
export const loadLiterals = createAction('LOAD_LITERALS');

const initialState = {};

// REDUCERS
export default handleActions(
  {
    [loadLiterals](state, { payload }) {
      return { ...state, ...payload };
    }  
  },
  initialState
);

// SELECTORS
export const getLiterals = state => state.literals;
