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
  apiCallRequest,
  apiCallSuccess,
  apiCallFail
} from '../../reducers/api';


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
class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url_endpoint : {
        response: false,
        endpoint: "http://map.leafte.ch:1880",
      },
      columnDefs: [
        { 
          headerName: "รหัสสถานที่", 
          field: "location_group" 
        },{ 
          headerName: "สถานที่", 
          field: "name" 
        },{ 
          headerName: "แก้ไข", 
          field: "id" ,
          cellRenderer: "editBtnRenderer",
          width: 60
        },{ 
          headerName: "ลบ", 
          field: "id" ,
          cellRenderer: "deleteBtnRender",
          width: 60
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
    // this.props.getRequest({
    //   //url : Configs[env].BACKEND_HOST + "/api/Routes",
    //   url:'http://map.leafte.ch:1880/location/group_list',
    // });
    //this.getRoutes();
    let _this = this;

    fetch(Configs[env].BACKEND_HOST + "/api/Routes", {
      method: "GET",
      headers: { "Content-Type": "application/json", Cache: "no-cache" },
      credentials: "include"
    }).then(function(response) {
        response.json().then(data => _this.setState({ rowData: data }));
    }).catch(function(error) {
        //console.log(error);
    });
      
  }
  componentWillUnmount() {
    
  }

  getRoutes(){
    const { endpoint } = this.state.url_endpoint;
    console.log('#getRoutes',endpoint);
    const socket = socketIOClient(endpoint);
    socket.on("Routes", data => this.setState({ rowData: data.msg }));

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
            rowData={this.state.rowData}
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
  }  
};
const mapActionsToProps =  {
  getRequest : apiCallRequest,
  success : apiCallSuccess,
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
)(Routes);
