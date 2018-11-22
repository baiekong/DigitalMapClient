import { handleActions } from 'redux-actions';
// ACTION CREATORS
import { createAction  } from 'redux-actions';
 
export const uiAppbarToggle = createAction('UI_APPBAR_TOGGLE');
export const setSidebarVisibility = createAction('SET_SIDEBAR_VISIBILITY');
export const setActiveMenuListItem = createAction('UI_MENU_LISTITEM_ACTIVE');
export const uiPanelDialogOpen = createAction("UI_PANEL_DIALOG_OPEN");
export const uiSwitchForm = createAction("UI_FORM_MANAGE");

const initialState = {
  sidebarOpen: true,
  activeMenuListItem: {
    name: '',
    idx: null
  },
  uiPanelDialogOpen : false,
  formManage : {
    page:'list',
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
    [uiPanelDialogOpen](state,{ payload }){
      return {...state, uiPanelDialogOpen: payload};
    },   
    [uiSwitchForm](state,{ payload }){
      //console.log(payload)
      return {...state, formManage: payload};
    }   
  },
  initialState
);

// SELECTORS
export const getSidebarOpen = state => state.ui.sidebarOpen;
export const getActiveMenuListItem = state => state.ui.activeMenuListItem;
