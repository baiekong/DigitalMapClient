import React, { Component } from "react";
import { setSidebarVisibility } from "../../reducers/ui";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import compose from "recompose/compose";
import { withStyles } from "@material-ui/core/styles";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import ConfirmBtnRenderer from "./ConfirmBtnRenderer";
import DateTimeFieldRenderer from "./DateTimeFieldRenderer";

import Configs from "../../config/config";
import "./grid.css";
const env = process.env.NODE_ENV;
const MIN_HEIGHT = 25;

const styles = theme => ({});

class Operation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Plan Arrival Time",
          field: "plan_arrival_time",
          cellRenderer: "dateTimeFieldRenderer",
          headerClass: "multiline",
          width: 70
        },
        {
          headerName: "Route",
          field: "route",
          headerClass: "multiline",
          width: 70
        },
        {
          headerName: "Tracking by",
          field: "tracking_by",
          headerClass: "multiline",
          width: 70
        },
        {
          headerName: "Run Seq.",
          field: "run_seq",
          headerClass: "multiline",
          width: 70
        },
        {
          headerName: "Truck license",
          field: "truck_license",
          headerClass: "multiline",
          width: 70
        },
        {
          headerName: "ETA",
          field: "ETA",
          headerClass: "multiline",
          width: 70
        },
        {
          headerName: "Part Usage Time",
          field: "part_usage_time",
          headerClass: "multiline",
          cellRenderer: "dateTimeFieldRenderer",
          width: 70
        },
        {
          headerName: "Actual Arrival Time",
          field: "actual_arrival_time",
          headerClass: "multiline",
          cellRenderer: "dateTimeFieldRenderer",
          width: 70
        },
        {
          headerName: "Status",
          field: "status",
          headerClass: "multiline",
          width: 100
        },
        {
          headerName: "Alternative Route/New Hazard Point",
          field: "alt_route_hazard_point",
          headerClass: "multiline",
          width: 100
        },
        {
          headerName: "Problem",
          field: "problem",
          headerClass: "multiline",
          width: 150
        },
        {
          headerName: "Action",
          field: "action",
          headerClass: "multiline",
          width: 150
        },
        {
          headerName: "Confirm",
          suppressSorting: true,
          field: "value",
          cellRenderer: "confirmBtnRenderer",
          colId: "params",
          width: 80
        }
      ],
      context: { componentParent: this },
      frameworkComponents: {
        confirmBtnRenderer: ConfirmBtnRenderer,
        dateTimeFieldRenderer: DateTimeFieldRenderer
      },
      headerHeight: 50,
      rowData: null
    };
  }
  componentDidMount() {
    const { setSidebarVisibility } = this.props;
    setSidebarVisibility(false);

    let _this = this;
    fetch(Configs[env].BACKEND_HOST + "/api/jobs", {
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
      });
  }
  autosizeHeaders(event) {
    if (event.finished !== false) {
      event.api.setHeaderHeight(MIN_HEIGHT);
      const headerCells = document.querySelectorAll(
        "#jobDataGrid .ag-header-cell-label"
      );

      let minHeight = MIN_HEIGHT;
      headerCells.forEach(cell => {
        minHeight = Math.max(minHeight, cell.scrollHeight);
      });
      event.api.setHeaderHeight(minHeight);
    }
  }
  methodFromParent(cell) {
    alert("Parent Component Method from " + cell + "!");
  }
  render() {
    return (
      <div style={{ width: "100%", height: "500px" }}>
        <div
          id="jobDataGrid"
          style={{
            boxSizing: "border-box",
            height: "98%",
            width: "100%"
          }}
          className="ag-theme-balham"
        >
          <AgGridReact
            paginationPageSize={35}
            columnDefs={this.state.columnDefs}
            enableSorting={true}
            suppressMovableColumns={true}
            debug={true}
            enableColResize={true}
            enableRangeSelection={true}
            pagination={true}
            onColumnResized={this.autosizeHeaders.bind(this)}
            onGridReady={this.autosizeHeaders.bind(this)}
            rowData={this.state.rowData}
            context={this.state.context}
            frameworkComponents={this.state.frameworkComponents}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({});

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
)(Operation);
