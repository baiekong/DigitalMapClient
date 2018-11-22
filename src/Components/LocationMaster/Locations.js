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
import socketIOClient from 'socket.io-client';
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
class Locations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointList: this.props.pointLocationList.result,
      url_endpoint : {
        response: false,
        endpoint: "http://map.leafte.ch:1880",
      },
      columnDefs: [
        { 
          headerName: "LOGISTICS POINT", 
          field: "logistic_point",
          width:150,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true
        },{ 
          headerName: "NAME", 
          field: "name" ,
          width:100,
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
      suppressRowClickSelection: true,
      rowSelection: 'multiple',
      frameworkComponents: {
        editBtnRenderer: EditBtnRenderer,
        deleteBtnRender: DeleteBtnRenderer
      },
    };
  }
  componentDidMount() {
    // this.props.getLocations({
    //   label : "POINT_LIST",
    //   url : "http://map.leafte.ch:1880/location/point_list",
    //   filter : {
    //     //filter add here
    //   }
    // })
    // // this.props.getRequest({
    // //   //url : Configs[env].BACKEND_HOST + "/api/locations",
    // //   url:'http://map.leafte.ch:1880/location/group_list',
    // // });
    // //this.getLocations();
    //let _this = this;

    // fetch(Configs[env].BACKEND_HOST + "/api/locations", {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json", Cache: "no-cache" },
    //   credentials: "include"
    // }).then(function(response) {
        
    //     response.json().then((data )=> {
    //       console.log("data daata ",data)
    //       _this.setState({ rowData: data });
    //     });
    // }).catch(function(error) {
    //     //console.log(error);
    // });
      
  }
  componentWillUnmount() {
    
  }
  renderRow(){
    
    if(Array.isArray(this.props.pointLocationList.result)){
      console.log("point" , this.props.pointLocationList.result);

      this.props.setLogisticPoint(this.props.pointLocationList.result)

      //filter text in location point
      if(this.props.textSearchLocation === "")
        return this.props.pointLocationList.result;
      else{
        
        let result = [];
        let findText = this.props.textSearchLocation;
        this.props.pointLocationList.result.forEach((v,i)=>{ 
          
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
    /*this.props.onSelectedMarker({
      icon:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      lat:selectedRows[0].lat,
      lng:selectedRows[0].lng,
      show:true,
      title:selectedRows[0].name
    });*/
  }
  render() {
    return (
      <div style={{ width: "100%", height: "300px" }}>
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
            rowSelection="multiple"
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
    pointLocationList : state.api.mapResult.get('POINT_LIST')||[],
    textSearchLocation : state.search.search_location,
  }  
};
const mapActionsToProps =  {
  getLocations : apiGetCallRequest,
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
)(Locations);
