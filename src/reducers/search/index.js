import { createAction, handleActions } from 'redux-actions';
export const searchLocation = createAction("SEARCH_LOCATION");

const initialState = {
    search_location:"",
};

// REDUCERS
export default handleActions(
{
    [searchLocation](state, { payload }) {
        return { ...state, search_location: payload };
    },
    
},initialState);