import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import Routes from './Routes';
import PanelDialog from '../Ui/PanelDialog';
import TextField from '@material-ui/core/TextField';
import {
  apiGetCallRequest,
  apiGetCallSuccess,
} from '../../reducers/api';
import {
  addLocation,
  addGroupLocation,
} from '../../reducers/ui/locationForm'
import { connect } from 'react-redux'
import { uiPanelDialogOpen,uiSwitchForm } from '../../reducers/ui';
import { uiDrawingMode,uiResetMap } from '../../reducers/map';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  formControl: {
    margin: theme.spacing.unit
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  cssGreen: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  titlePanel :{
    backgroundColor: green[500],
    color: theme.palette.getContrastText(green[500]),
  }
})

class SearchForm extends Component {
  state = {
    logistic: '',
    logisticText : '',
    location: '',
    locationText : '',
    name: 'hai',
    mode : '',
    actionsLocationPointGroup :false,
    actionsLocationGroup : false,
    //labelWidth: 0,
  };

  componentDidMount() {
    this.props.onChangeMode(null);
  }
  handleChange = event => {
    // this.setState({ 
    //   [event.target.name]:event.target.value,
    // });
    if(event.target.name === "logistic")
    {  
      this.setState({
        [event.target.name]:event.target.value,
        logisticText :event.currentTarget.innerText,
        location : '',
        locationText : '',
      });
      this.props.getGroupList({
        label : "LOCATION_GROUP_LIST",
        url : "http://map.leafte.ch:1880/location/group_list",
        filter : {
          logistic_point_id: event.target.value,
        }
      })
    }
    else if(event.target.name === "location")
      this.setState({
        [event.target.name]:event.target.value,
        locationText :event.currentTarget.innerText,
      })
    console.log(this.state.logistic);
  };
  onFilterTextBoxChanged = event => {
    console.log("onFilterTextBoxChanged",event);
    //this.state.api.setQuickFilter(document.getElementById('location-search').value);
  }
  handleAdd(event){
    this.setState({mode:'Add'});
    this.props.onDialogOpen(true);
  }
  handleEdit(event){
    this.setState({mode:'Edit'});
    this.props.onDialogOpen(true);
  }
  handleClick(event) {
    this.props.onDialogOpen(true);
  };
  formAddGroupForm(){}
  handleManageLocation(event){
    let location = {
      logistic_point_id : this.state.logistic,
      logistic_point_text : this.state.logisticText,
      location_id : this.state.location,
      location_text : this.state.locationText
    }
    this.props.addLocation(location);
    this.props.onSwitchForm('manage');
  }
  
  renderMenuItem(){
      
    if(this.props.grouplist !== undefined && this.props.grouplist !== null){      
          var menuItem = this.props.grouplist.result;
          return menuItem.map(function(data, index){
            return (
              <MenuItem key={index} value={data._id}>{data.name}</MenuItem>
            )
          });
    }
    else
        return null;
  }
  render() {
    return (
      <div style={{ padding: "10px"}}>
        <Typography variant="h6" gutterBottom className={styles.titlePanel}>
        ROUTE MASTER
        </Typography>
        
        <Grid container spacing={15}>
          <Grid item xs={7}></Grid>
          <Grid item xs={5}>
            <Button variant="contained" size="small"  color="secondary" aria-label="Add" className={classNames(styles.button, styles.cssGreen)} 
                onClick={this.handleManageLocation.bind(this)}>
                NEW LOGISTIC ROUTE
            </Button>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset" className={styles.formControl}>
              <RadioGroup
                aria-label="Search"
                name="search_group"
                className={styles.group}
                value={this.state.value}
                onChange={this.handleChange}
              >
                <FormControlLabel value="female" control={<Radio />} label="No Message Route" />
                <FormControlLabel value="male" control={<Radio />} label="Name" />
                <FormControlLabel value="other" control={<Radio />} label="Origin" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Routes/>
          </Grid>
          
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = function(state) {
  return {
    dialogOpen : state.ui.uiPanelDialogOpen,
    formManage : state.ui.formManage,
    grouplist : state.api.mapResult.get('LOCATION_GROUP_LIST'),
  }
}
const mapActionsToProps =  {
  onDialogOpen : uiPanelDialogOpen,
  onSwitchForm : uiSwitchForm,
  getGroupList : apiGetCallRequest,
  successGroupList : apiGetCallSuccess,
  addLocation : addLocation,
  addGroupLocation : addGroupLocation,
  onChangeMode : uiDrawingMode,
  resetMap : uiResetMap,
};

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(SearchForm))