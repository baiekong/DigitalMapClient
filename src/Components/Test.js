import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import {subscribeEvent, unsubscribeEvent,sentDataOnEvent} from '../websocket/actions';

const styles = theme => ({
  AppLogo: {
    height: '40vmin'
  }
});
class App extends Component {
  componentDidMount() {
    this.props.dispatch(subscribeEvent('message'));
  }
  componentWillUnmount(){
    this.props.dispatch(unsubscribeEvent('message'));
  }
  render() {
    const { fetching, dog, onRequestDog, error, onEmitButtonClick } = this.props;

    return (
      <div>
        <header>
          <h1>Welcome</h1>
        </header>
        <button onClick={onEmitButtonClick}>Emit</button>

        {dog ? (
          <p>Keep clicking for new dogs</p>
        ) : (
          <p>Replace the React icon with a dog!</p>
        )}

        {fetching ? (
          <button disabled>Fetching...</button>
        ) : (
          <button onClick={onRequestDog}>Request a Dog</button>
        )}
        <br />
        {dog ? <img src={dog} className='AppLogo' alt='logo' /> : ''}

        {error && <p style={{ color: 'red' }}>Uh oh - something went wrong!</p>}
      </div>
    );
  }
}

const mapStateToProps = state => {

  return {
    fetching: state.api.fetching,
    dog: state.api.dog,
    error: state.api.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestDog: () => dispatch({ type: 'API_CALL_REQUEST', data : 'test_data' }),
    onEmitButtonClick: () => dispatch(sentDataOnEvent('message','hello_test')),
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
