import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import {
  required,
  maxLength,
  minLength,
  number,
  minValue,
  email
} from '../libs/validation';

import { getLiterals } from '../reducers/literals';
import { getAuthResponse } from '../reducers/auth';
import { Redirect } from 'react-router-dom';
import {
  authLoginRequest,
  authLoginResponse,
  authLoginError
} from '../reducers/auth';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './Ui/Snackbar';

const styles = theme => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'flex-start',
    //background: 'url(https://source.unsplash.com/random/1600x900)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  card: {
    minWidth: 300,
    marginTop: '6em'
  },
  avatar: {
    margin: '1em',
    display: 'flex',
    justifyContent: 'center'
  },
  icon: {
    backgroundColor: theme.palette.secondary.main
  },
  hint: {
    marginTop: '1em',
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.grey[500]
  },
  form: {
    padding: '0 1em 1em 1em'
  },
  input: {
    marginTop: '1em'
  },
  actions: {
    padding: '0 1em 1em 1em'
  },
  margin: {
    margin: theme.spacing.unit
  },
  center:{
    position: 'relative',
    left: '20px'
  }
});

// see https://redux-form.com/7.4.2/examples/material-ui//
const renderInput = ({
  meta: { touched, error } = {},
  input: { ...inputProps },
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
);

class Login extends Component {
  state = {
    snackbarOpen: false
  };

  componentWillReceiveProps(nextProps) {}

  handleSnackbarClose = (event, reason) => {
    this.setState({ snackbarOpen: false });
  };

  login = auth => {
    this.setState({ snackbarOpen: true });
    this.props.userLogin(
      auth
      // this.props.location.state ? this.props.location.state.nextPathname : '/'
    );
  };

  render() {
    const { classes, handleSubmit, isLoading, auth } = this.props;

    if (auth && auth.authResult) {
      //localStorage.setItem('auth_token', auth.token);
      //document.cookie = "auth_token=" + auth.token;
      return <Redirect to='/' />;
    }
    return (
      <div className={classes.main}>
        {!isLoading &&
          auth !== null &&
          auth.authResult === false && (
            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              open={this.state.snackbarOpen}
              onClose={this.handleSnackbarClose}
              autoHideDuration={3000}
            >
              <SnackbarContentWrapper
                variant='error'
                className={classes.margin}
                message={auth.message}
                onClose={this.handleSnackbarClose}
              />
            </Snackbar>
          )}
        {!isLoading &&
          auth !== null &&
          auth.authResult === true && (
            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
              open={this.state.snackbarOpen}
              onClose={this.handleSnackbarClose}
              autoHideDuration={3000}
            >
              <SnackbarContentWrapper
                variant='success'
                className={classes.margin}
                message={auth.message}
                onClose={this.handleSnackbarClose}
              />
            </Snackbar>
          )}
        <Card className={classes.card}>
          <div className={classes.avatar}>
            <Avatar className={classes.icon}>
              <LockIcon />
            </Avatar>
          </div>
          <form onSubmit={handleSubmit(this.login)}>
            <div className={classes.hint}>Hint: demo / demo</div>
            <div className={classes.form}>
              <div className={classes.input}>
                <Field
                  name='username'
                  component={renderInput}
                  label='username'
                  disabled={isLoading}
                  validate={[required]}
                />
              </div>
              <div className={classes.input}>
                <Field
                  name='password'
                  component={renderInput}
                  label='password'
                  type='password'
                  disabled={isLoading}
                  validate={[required]}
                />
              </div>
            </div>
            <CardActions className={classes.actions}>
              <Button
                variant='contained'
                type='submit'
                color='primary'
                disabled={isLoading}
                className={classes.button}
                fullWidth
              >
                {isLoading && <CircularProgress className={classes.center} size={25} thickness={2} />}
                login
              </Button>
            </CardActions>
          </form>
        </Card>
      </div>
    );
  }
}

Login.propTypes = {
  ...propTypes,
  authProvider: PropTypes.func,
  classes: PropTypes.object,
  previousRoute: PropTypes.string
  //translate: PropTypes.func.isRequired,
  //userLogin: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoading: state.auth.fetching,
  literals: getLiterals(state),
  auth: getAuthResponse(state)
});

const mapDispatchToProps = dispatch => {
  return {
    userLogin: auth => dispatch(authLoginRequest(auth)),
    dispatch
  };
};

const enhance = compose(
  //translate,
  reduxForm({
    form: 'signIn'
    /* validate: (values, props) => {
            const errors = {};
            const { translate } = props;
            if (!values.username) {
                errors.username = 'Username Error'
            }
            if (!values.password) {
                errors.password = 'Password Error'
            }
            return errors;
        },*/
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
);

export default enhance(Login);
