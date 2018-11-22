import React, { Component } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import Configs from "../../config/config";
const env = process.env.NODE_ENV;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: "Username", field: "username" },
        { headerName: "Email", field: "email" },
        { headerName: "Group", field: "group" }
      ],
      rowData: null
    };
  }
  componentDidMount() {
    let _this = this;
    fetch(Configs[env].BACKEND_HOST + "/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json", Cache: "no-cache" },
      credentials: "include"
    })
      .then(function(response) {
        response.json().then(data => _this.setState({ rowData: data }));
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  componentWillUnmount() {}
  render() {
    return (
      <div style={{ width: "100%", height: "500px" }}>
        <div
          className="ag-theme-balham"
          style={{
            height: "98%",
            width: "100%"
          }}
        >
          <AgGridReact
            enableSorting={true}
            singleClickEdit={true}
            suppressMovableColumns={true}
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
          />
        </div>
      </div>
    );
  }
}

export default App;
