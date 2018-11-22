import { createAction, handleActions } from "redux-actions";

// ACTION TYPES
export const authActionTypes = {
  isAuthenticated: "AUTH_IS_AUTHENTICATED",
  authLoginRequest: "AUTH_LOGIN_REQUEST",
  authLoginResponse: "AUTH_LOGIN_RESPONSE",
  authLoginError: "AUTH_LOGIN_ERROR"
};

// ACTION CREATORS
export const isAuthenticated = createAction(authActionTypes.isAuthenticated);
export const authLoginRequest = createAction(authActionTypes.authLoginRequest);
export const authLoginResponse = createAction(
  authActionTypes.authLoginResponse
);
export const authLoginError = createAction(authActionTypes.authLoginError);

const initialState = {
  fetching: false,
  auth: null,
  error: null
};

// REDUCERS
export default handleActions(
  {
    [isAuthenticated](state, { payload }) {
      return { ...state, fetching: true, error: null };
    },
    [authLoginRequest](state, { payload }) {
      return { ...state, fetching: true, error: null };
    },
    [authLoginResponse](state, auth) {
      return { ...state, fetching: false, auth };
    },
    [authLoginError](state, { error }) {
      return { ...state, fetching: false, auth: null, error: error };
    }
  },
  initialState
);

// SELECTORS
export const getAuthResponse = state => state.auth.auth;
