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
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
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
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

class RouteForm extends Component {
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
    const bull = <span className={styles.bullet}>•</span>;
    return (
      <div style={{ padding: "10px"}}>
        <Typography variant="h6" gutterBottom className={styles.titlePanel}>
        ROUTE SUGGESTION
        </Typography>
        
        <Grid container spacing={15}>
          <Grid item xs={7}>
            <Typography variant="h7" gutterBottom className={styles.titlePanel}>
              ALTERNATIVE ROUTE
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Button variant="contained" size="small"  color="secondary" aria-label="Add" className={classNames(styles.button, styles.cssGreen)} 
                onClick={this.handleManageLocation.bind(this)}>
                REFRESH
            </Button>
          </Grid>
          <Grid item xs={12}>
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText inset primary="Current Location" />
              </ListItem>
              <ListItem button>
                <ListItemText inset primary="Destination" />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Card className={styles.card}>
              <CardContent>
                <Typography variant="h6" className={styles.title} color="textSecondary" gutterBottom>
                  Route 1 : Current Active Route
                </Typography>
                <Typography className={styles.pos} color="textSecondary">
                  
                </Typography>
                <Typography component="p">
                    Duration Time : 1 hr 16 mins
                </Typography>
                <Typography component="p">
                    Estimate Time Arrival : 11:30 (-5 mins)
                </Typography>
                <Typography component="p">
                    Duration Distance: 16.1 km(+5 km)
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Confirm</Button>
              </CardActions>
            </Card>
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

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(RouteForm))