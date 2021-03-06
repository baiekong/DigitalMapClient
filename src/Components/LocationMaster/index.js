import React, { Component } from "react";
import { setSidebarVisibility,uiSwitchForm } from "../../reducers/ui";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import BaseMap from "../BaseMap";
import SearchForm from "./SearchForm";
import ManageForm from "./ManageForm";
import AddGroupForm from "./AddGroupForm";
import { uiResetMap } from '../../reducers/map';

const env = process.env.NODE_ENV;
const MIN_HEIGHT = 25;

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: 'auto',
  },
  gridForm : {
    padding : '0px'
  },
  subheader: {
    width: '100%',
  },
});

class LocationMaster extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }
  componentDidMount() {
    const { setSidebarVisibility } = this.props;
    console.log("formManage",this.props.formManage);
    setSidebarVisibility(false);

    let _this = this;
    
    /*fetch(Configs[env].BACKEND_HOST + "/api/jobs", {
      method: "GET",
      headers: { "Content-Type": "application/json", Cache: "no-cache" },
      credentials: "include"
    })
      .then(function(response) {
        console.log(response);
        response.json().then(data => _this.setState({ rowData: data }));
      })
      .catch(function(error) {
        console.log(error);
      });*/
  }
  autosizeHeaders(event) {
    if (event.finished !== false) {
      event.api.setHeaderHeight(MIN_HEIGHT);
      const headerCells = document.querySelectorAll(
        "#locationMap .ag-header-cell-label"
      );

      let minHeight = MIN_HEIGHT;
      headerCells.forEach(cell => {
        minHeight = Math.max(minHeight, cell.scrollHeight);
      });
      event.api.setHeaderHeight(minHeight);
    }
  }
  renderManageForm(){
    if(this.props.formManage.page === 'manage')
      return (<ManageForm/>);
    else if(this.props.formManage.page === 'group')
      return (<AddGroupForm
        type={this.state.mode}
        logistic={{ 
          value : this.state.logistic,
          text : this.state.logisticText
        }}
        location={{
          detail : this.state.locationDetail,
          value : this.state.location,
          text : this.state.locationText,
        }}/>);
    else return (<SearchForm/>);
  }
  methodFromParent(cell) {
    alert("Parent Component Method from " + cell + "!");
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          id="locationMap"
          style={{
            boxSizing: "border-box",
            height: "90%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <React.Fragment> 
            <GridList key="grid_location"
              cellHeight={800} cols={12}>
              <GridListTile key={0} cols={4} className={styles.gridForm}>
                {this.renderManageForm()}
              </GridListTile>
              <GridListTile key={0} cols={8}>
                <BaseMap isReset={this.props.isReset}/>
              </GridListTile>
            </GridList>
          </React.Fragment>  
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isReset : state.map.isReset,
  formManage : state.ui.formManage
});

const mapDispatchToProps = dispatch => {
  return {
    
    setSidebarVisibility: status => dispatch(setSidebarVisibility(status)),
    dispatch
  };
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(LocationMaster);
