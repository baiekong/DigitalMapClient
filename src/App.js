import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  Dashboard,
  PieChart,
  ViewList,
  Directions,
  Place,
  EditLocation,
  Warning,
  Person,
  Settings,
  Ballot
} from '@material-ui/icons';
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';
import MenuListItem from './Layout/MenuListItem';
import ContentRoutes from './routes';
import List from '@material-ui/core/List';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

import {
  isAuthenticated,
  authLoginRequest,
  authLoginResponse,
  authLoginError,
  getAuthResponse
} from './reducers/auth';

const dashboardListItems = {
  itemName: 'Dashboard',
  itemIcon: Dashboard,
  itemLink: null,
  nestedItems: [
    {
      itemName: 'Management',
      itemIcon: PieChart,
      itemLink: '/management'
    },
    {
      itemName: 'Operation',
      itemIcon: ViewList,
      itemLink: '/operation'
    }
  ]
};
const maintenanceListItems = {
  itemName: 'Maintenance',
  itemIcon: EditLocation,
  itemLink: null,
  nestedItems: [
    {
      itemName: 'Location Master',
      itemIcon: Place,
      itemLink: '/location_master'
    },
    {
      itemName: 'Route Master',
      itemIcon: Directions,
      itemLink: '/route_master'
    },
    {
      itemName: 'Hazard Points',
      itemIcon: Warning,
      itemLink: '/hazard_point'
    }
  ]
};
const configurationListItems = {
  itemName: 'Configuration',
  itemIcon: Settings,
  itemLink: null,
  nestedItems: [
    {
      itemName: 'Users',
      itemIcon: Person,
      itemLink: '/users'
    },
    {
      itemName: 'Settings',
      itemIcon: Ballot,
      itemLink: '/settings'
    }
  ]
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works

    [theme.breakpoints.up('xs')]: {
      marginTop: '3em'
    }
  },
  toolbar: theme.mixins.toolbar,
  center: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-50px'
  }
});

class App extends Component {
  componentDidMount() {
    this.props.dispatch(isAuthenticated());
  }
  render() {
    const { classes, isLoading, auth, dispatch} = this.props;

    if (!auth) {
      return <CircularProgress className={classes.center} size={'100px'} />;
    } else if (auth && !auth.authResult) {
      console.log('authentication failed');
      return <Redirect to='/login' />;
    } else {
      return (
        <div className={classes.root}>
          <Header />
          <Sidebar>
            <List>
              <MenuListItem name='Dashboard' listItems={dashboardListItems} />
              <MenuListItem
                name='Maintenance'
                listItems={maintenanceListItems}
              />
              <MenuListItem
                name='Configuration'
                listItems={configurationListItems}
              />
            </List>
          </Sidebar>
          <main className={classes.content}>
            <ContentRoutes dispatch={dispatch}/>
          </main>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  isLoading: state.auth.fetching,
  auth: getAuthResponse(state)
});

const mapDispatchToProps = dispatch => {
  return {
    userLogin: auth => dispatch(authLoginRequest(auth)),
    dispatch
  };
};

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
);

export default enhance(App);
