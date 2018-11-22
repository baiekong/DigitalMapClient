import React from "react";
import { Route, Switch } from "react-router";
import { connect } from "react-redux";
import compose from "recompose/compose";
import Foo from "./Components/Foo";
import Manager from "./Components/Manager";
import Test from "./Components/Test";
import Users from "./Components/Configuration/Users";
import Setting from "./Components/Configuration/Setting";
import Operation from "./Components/Operation";
import { setSidebarVisibility } from './reducers/ui';

const ContentRoutes = (props) => {
  const {dispatch} = props;
  return(

    <Switch>
      <Route path="/management" component={() => <Manager name="Manager" />} />
      <Route
        path="/operation"
        component={() => {
          // Force closing sidebar to have more main content space for Operation view
          dispatch(setSidebarVisibility(false));
          return <Operation name="Operation" />;
        }}
      />
      <Route
        path="/location_master"
        component={() => <Foo name="Location Master" />}
      />
      <Route
        path="/route_master"
        component={() => <Foo name="Route Master" />}
      />
      <Route
        path="/hazard_point"
        component={() => <Foo name="Hazard Points" />}
      />
      <Route path="/users" component={() => <Users name="Users" />} />
      <Route path="/settings" component={() => <Setting name="Settings" />} />
    </Switch>

)}

export default ContentRoutes;