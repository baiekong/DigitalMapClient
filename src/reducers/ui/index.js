import { createAction, handleActions } from 'redux-actions';

// ACTION CREATORS
export const uiAppbarToggle = createAction('UI_APPBAR_TOGGLE');
export const setSidebarVisibility = createAction('SET_SIDEBAR_VISIBILITY');
export const setActiveMenuListItem = createAction('UI_MENU_LISTITEM_ACTIVE');

const initialState = {
  sidebarOpen: true,
  activeMenuListItem: {
    name: '',
    idx: null
  }
};

// REDUCERS
export default handleActions(
  {
    [uiAppbarToggle](state) {
      return { ...state, sidebarOpen: !state.sidebarOpen };
    },
    [setSidebarVisibility](state, { payload }) {
      console.log(payload)
      return { ...state, sidebarOpen: payload };
    },
    [setActiveMenuListItem](state, { payload }) {
      return { ...state, activeMenuListItem: payload,  };
    },    
  },
  initialState
);

// SELECTORS
export const getSidebarOpen = state => state.ui.sidebarOpen;
export const getActiveMenuListItem = state => state.ui.activeMenuListItem;
