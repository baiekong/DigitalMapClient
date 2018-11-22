import { handleActions } from 'redux-actions';
// ACTION CREATORS
import { createAction  } from 'redux-actions';
 
export const uiDrawingMode = createAction('UI_DRAWING_MODE');
export const uiAreaType = createAction('UI_AREA_TYPE');
export const uiDrawingSelected = createAction('UI_DRAWING_SELECTED');
export const uiChangeMarker = createAction('UI_CHANGE_MARKER');
export const uiChangeCircle = createAction('UI_CHANGE_CIRCLE');
export const uiChangeRectangle = createAction('UI_CHANGE_RECTANGLE');
export const uiChangePolygon = createAction('UI_CHANGE_POLYGON');
export const uiChangePolyline = createAction('UI_CHANGE_POLYLINE');
export const uiResetMap = createAction('UI_RESET_MAP');
export const uiCancelResetMap = createAction('UI_CANCELRESET_MAP');
export const uiSetLogisticPoint = createAction('UI_SET_LOGISTICPOINT');
export const uiSelectedMarker = createAction('UI_SELECT_MARKER');
export const uiCenterChanged = createAction('UI_CENTER_CHANGE');
export const uiDrawingOptions = createAction('UI_DRAWING_OPTION');

const initialState = {
  drawingMode: null,
  areaType: null,
  drawingSelected: null,
  isReset : false,
  isMarkerShown : false,
  selectedMarker : null,
  logistic_point: [],
  isMarker : false,
  center : {
    lat: 13.95,
    lng: 101.33
  },
  marker: null,
  circle : null,
  polygon : null,
  rectangle : null,
  polyline : null,
  routes : [],
  drawingOptions : {
    drawingControl: false,
    editable : true,
    circleOptions: {
      fillColor: "#000000",
      fillOpacity: 0.5,
      strokeWeight: 1,
      stokeColor: "#000000",
      clickable: false,
      editable: true,
      zIndex: 1,
    },
    polygonOptions: {
      fillColor: "#000000",
      fillOpacity: 0.5,
      strokeWeight: 1,
      stokeColor: "#000000",
      clickable: false,
      editable: true,
      zIndex: 1,
    },
  }
};

// REDUCERS
export default handleActions(
  {
    [uiDrawingMode](state, { payload }) {
      //console.log("#uiDrawingMode",payload)
      return { ...state, drawingMode: payload };
    },
    [uiDrawingOptions](state, { payload }) {
      console.log("#drawingOptions drawingOptions",payload)
      return { ...state, drawingOptions: payload };
    },
    [uiAreaType](state, { payload }) {
      //console.log("#uiAreaType",payload)
      return { ...state, areaType: payload };
    },
    [uiDrawingSelected](state, { payload }) {
      //console.log("#uiDrawingSelected",payload)
      return { ...state, drawingSelected: payload };
    },
    [uiSetLogisticPoint](state, { payload }) {
      console.log("#uiSetLogisticPoint",payload)
      return { ...state, logistic_point: payload };
    },
    [uiCenterChanged](state, { payload }) {
      return { ...state, center: payload };
    },
    [uiChangeMarker](state, { payload }) {  
      return { ...state, 
        marker : payload
      };
    },
    [uiSelectedMarker](state, { payload }) {  
      //console.log("#uiChangeMarker",payload)
      return { ...state, 
        selectedMarker : payload
      };
    },
    [uiChangeCircle](state, { payload }) {  
      console.log("#uiChangeCircle",payload)
      if(payload){
        return { ...state, 
          circle : payload
        };
      } else {
        return { ...state, 
          circle : null
        };
      }
    },
    [uiChangeRectangle](state, { payload }) {  
      //console.log("#uiChangeRectangle",payload)
      if(payload){
        return { ...state, 
          rectangle : {
            center : payload.getCenter().lat()+","+payload.getCenter().lng(),
            ne : payload.getNorthEast().lat()+","+payload.getNorthEast().lng(),
            sw : payload.getSouthWest().lat()+","+payload.getSouthWest().lng(), 
          }
        };
      } else {
        return { ...state, 
          rectangle : null
        };
      }
    },
    [uiChangePolygon](state, { payload }) {  
      //console.log("#uiChangePolygon",payload)
      return { ...state, 
        polygon : payload
      };
    },
    [uiChangePolyline](state, { payload }) {  
      //console.log("#uiChangePolyline",payload)
      return { ...state, 
        polyline : payload
      };
    },
    [uiCancelResetMap](state, { payload }) {  
      return { ...state, 
        isReset : payload
      };
    },
    [uiResetMap](state, { payload }) {  
      console.log("#uiResetMap",payload)
      
        return { ...state, 
          drawingMode: null,
          isReset : true,
          isMarker : payload,
          logistic_point: [],
          marker: null,
          markers: null,
          circle : null,
          polygon : null,
          rectangle : null,
          polyline : null,
          routes : []
        } 
    },
    
  },
  initialState
);

