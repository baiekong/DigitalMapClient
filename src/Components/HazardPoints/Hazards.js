import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import EditBtnRenderer from "../Ui/Renderer/EditBtnRenderer";
import DeleteBtnRenderer from "../Ui/Renderer/DeleteBtnRenderer";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from '@material-ui/core/styles';
import Configs from "../../config/config";
import { 
  Marker
} from "react-google-maps"
// import {
//   apiCallRequest,
//   apiCallSuccess,
//   apiCallFail
// } from '../../reducers/api';
import {
  apiGetCallRequest,
} from '../../reducers/api';

import { uiSetLogisticPoint ,uiSelectedMarker} from '../../reducers/map';

const env = process.env.NODE_ENV;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
  },
  textField: {
    margin:0,
    //marginLeft: theme.spacing.unit,
    //marginRight: theme.spacing.unit,
    width: 200,
  },
});
class Hazards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointList: this.props.pointHazardList.result,
      url_endpoint : {
        response: false,
        endpoint: "http://map.leafte.ch:1880",
      },
      columnDefs: [{ 
          headerName: "NAME", 
          field: "name" ,
          width:150,
        },{ 
          cellRenderer: "editBtnRenderer",
          width: 40
        },{ 
          cellRenderer: "deleteBtnRender",
          width: 40,
        }
      ],
      rowData: null,
      context: { componentParent: this },
      
      frameworkComponents: {
        editBtnRenderer: EditBtnRenderer,
        deleteBtnRender: DeleteBtnRenderer
      },
    };
  }
  componentDidMount() {
  }
  componentWillUnmount() {
    
  }
  renderRow(){
    
    if(Array.isArray(this.props.pointHazardList.result)){
      console.log("point" , this.props.pointHazardList.result);
      this.props.setLogisticPoint(this.props.pointHazardList.result)

      //filter text in location point
      if(this.props.textSearchLocation === "")
        return this.props.pointHazardList.result;
      else{
        
        let result = [];
        let findText = this.props.textSearchLocation;
        this.props.pointHazardList.result.forEach((v,i)=>{ 
          
          if((v.name.toUpperCase().search(findText.toUpperCase()) > -1) || 
             (v.logistic_point.toUpperCase().search(findText.toUpperCase()) > -1))
            result.push(v);
        });
        
        return result;
      }
    
    }
    else
      return [];
  }
  
  handleSelectionChanged = (node) => {
    var selectedRows = node.api.getSelectedRows();
    console.log("#handleSelectionChanged selectedRows ",selectedRows[0]);
    this.props.onSelectedMarker(selectedRows[0]);
  }
  render() {
    return (
      <div style={{ width: "100%", height: "500px" }}>
        <div
          className="ag-theme-balham"
          style={{
            height: "300px",
            width: "100%",
            marginTop: "10px",
          }}>
          <AgGridReact
            enableSorting={true}
            singleClickEdit={true}
            suppressMovableColumns={true}
            columnDefs={this.state.columnDefs}
            rowData={this.renderRow()}
            rowSelection="single"
            onSelectionChanged={this.handleSelectionChanged}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = function(state,ownProps) {
  return {
    isLoading : state.api.fetching,
    logistic_point : state.map.logistic_point,
    pointHazardList : state.api.mapResult.get('HAZARD_LIST')||[],
    textSearchLocation : state.search.search_location,
  }  
};
const mapActionsToProps =  {
  getHazards : apiGetCallRequest,
  setLogisticPoint : uiSetLogisticPoint,
  onSelectedMarker : uiSelectedMarker
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapActionsToProps,
    //mapDispatchToProps
  ),
  withStyles(styles)
)(Hazards);
