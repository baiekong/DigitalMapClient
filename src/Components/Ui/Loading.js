import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import SvgIcon from '@material-ui/core/SvgIcon';

import purple from '@material-ui/core/colors/purple';
import { connect } from 'react-redux'

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
});

function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }
function Loading(props) {
  const { classes, type} = props;
  return (
    <div>
      
      {/* {
          props.showSuccess && 
          <CircularProgress className={classes.progress} size={100}>
            <HomeIcon className={classes.icon} />
          </CircularProgress>
      } */}
      { 
          type === "linear" ? <LinearProgress /> : <CircularProgress className={classes.progress} size={100}></CircularProgress>
      }
    </div>
  );
}

// Loading.propTypes = {
//   classes: PropTypes.object.isRequired,
// };
const mapStateToProps = function(state,ownProps) {
    return {
      type : ownProps.type || "linear",
    }
  }
const LoadingConnect = connect(mapStateToProps)(withStyles(styles)(Loading))

export default LoadingConnect;