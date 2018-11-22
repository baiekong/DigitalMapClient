import { handleActions } from 'redux-actions';
// ACTION CREATORS
import { createAction  } from 'redux-actions';
export const addLocation = createAction('ADD_LOCATION');
export const addGroupLocation = createAction('ADD_GROUP_LOCATION');

const initialState = {
    manageForm :{},
    groupForm : {},
    hazardForm : {},
};

export default handleActions(
    {
      [addLocation](state, { payload }) {
        return { ...state, manageForm: payload };
      }
    },
    initialState
);