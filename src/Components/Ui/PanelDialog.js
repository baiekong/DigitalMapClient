import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import Loading from './Loading';

import { connect } from 'react-redux'
import { uiPanelDialogOpen } from '../../reducers/ui';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
});

class PanelDialog extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      loading : false
    }
  }
  componentWillReceiveProps(nextProps){
    //if(this.props.isLoading !== nextProps.isLoading && nextProps.isLoading === false)
    //    this.props.onDialogOpen(false);
  }
  handleSave = () => {
    this.setState({
      loading : true
    });
    //todo save

    setTimeout(()=>{
      this.props.onDialogOpen(false);
    },1000)
  }
  handleClose = () => {
    this.props.onDialogOpen(false);
  }

  render() {
    const { classes ,...other} = this.props;
    return (
      <Dialog 
        onClose={this.handleClose} 
        aria-labelledby="responsive-dialog-title" 
        {...other}>
        
          <AppBar position='static'>
            <Toolbar>
              {this.props.title || "Title Name"}
            </Toolbar>
          </AppBar>
        { 
          this.props.isLoading && <Loading type={"linear"}/> 
        }
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            { this.props.discription } 
          </DialogContentText>
          {
            this.props.form()
          }
          
        </DialogContent>
        {/* <DialogActions>
              <Button variant="contained" size="small" color="primary" aria-label="Save"
                onClick={this.handleSave}
              >
                Save
              </Button>
              <Button variant="contained" size="small" variant="outlined" color="secondary" aria-label="Cancel"
                onClick={this.handleClose}
              >
                Cancel
              </Button>
        </DialogActions> */}
      </Dialog>
    );
  }
}
PanelDialog.propTypes = {
  title: PropTypes.string,
  discription : PropTypes.string,
  form : PropTypes.func.isRequired,
};
const mapStateToProps = function(state) {
  return {
    isLoading: state.api.fetching,
  }
}
const mapActionsToProps =  {
  onDialogOpen: uiPanelDialogOpen
};
const PanelDialogConnect = connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(PanelDialog))

export default PanelDialogConnect;