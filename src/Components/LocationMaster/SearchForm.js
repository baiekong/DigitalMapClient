import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import Locations from './Locations';
import PanelDialog from '../Ui/PanelDialog';
import AddGroupForm from './AddGroupForm';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { searchLocation } from '../../reducers/search';
//import AutoSelect from 'react-select';
import {
  apiGetCallRequest,
  apiGetCallSuccess,
  resetAPIResult,
} from '../../reducers/api';
import {
  addLocation,
  addGroupLocation,
} from '../../reducers/ui/locationForm'
import { connect } from 'react-redux'
import { uiPanelDialogOpen,uiSwitchForm } from '../../reducers/ui';
import { uiDrawingMode,uiResetMap,uiChangeMarker,uiDrawingOptions } from '../../reducers/map';

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
  padding5px: {
    display : 'flex',
    flexWrap:'wrap',
    padding: "5px",
    margin:'10px',
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
  selectStyles : {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  }
})

class SearchForm extends Component {
  state = {
    logistic: '',
    logisticText : '',
    location: '',
    locationText : '',
    locationDetail : '',
    name: 'hai',
    mode : '',
    actionsLocationPointGroup :false,
    actionsLocationGroup : false,
    //labelWidth: 0,
    drawingOptions : {
      drawingControl: false,
      editable : true,
      circleOptions: {
        fillColor: "#000000",
        fillOpacity: 0.5,
        strokeWeight: 1,
        stokColor:"#000000",
        strokeOpacity: 0.5,
      },
      polygonOptions: {
        fillColor: "#000000",
        fillOpacity: 0.5,
        strokeWeight: 1,
        stokColor:"#000000",
        strokeOpacity: 0.5,
      },
    }
  };


  componentDidMount() {
    this.props.onChangeMode(null);
    this.props.onResetMap(true);
    this.props.onDrawingOptions(this.state.drawingOptions);
  }
  componentWillMount(){
    if(this.props.manageForm){
      this.setState({ 
          logisticText : this.props.manageForm.logistic_point_group || "",
          logistic : this.props.manageForm.logistic_point_group_id || "",
          location: this.props.manageForm.location_group_id || "",
          locationText : this.props.manageForm.location_group || "",
      });
    }
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",this.state.logistic,this.state.location)
    
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
        locationDetail : '',
      });
      this.props.resetAPIResult('POINT_LIST');
      this.props.onResetMap(true);
      this.props.getGroupList({
        label : "LOCATION_GROUP_LIST",
        url : "http://map.leafte.ch:1880/location/group_list",
        filter : {
          logistic_point_group_id: event.target.value,
        }
      });
      
    }
    else if(event.target.name === "location"){
      
      let detail = event.currentTarget.attributes["detail"].value || {};
      this.props.onResetMap(true);
      this.setState({
        [event.target.name]:event.target.value,
        locationText : event.currentTarget.innerText,
        locationDetail :  JSON.parse(detail) || {}
      },this.renderGroupMarker)
      
      //console.log("#handleChange location",event.currentTarget);
      this.props.getLocations({
        label : "POINT_LIST",
        url : "http://map.leafte.ch:1880/location/point_list",
        filter : {
          //filter add here
          logistic_point_group_id : this.state.logistic,
          location_group_id : event.target.value // can't use state becasuse state not yet to set
        }
      })
      
      
    }
    //console.log(this.state.logistic);
    
  };
  renderGroupMarker = () => {
      console.log("#setGroupMarker locationDetail",this.state.locationDetail);
        
      var marker = new window.google.maps.Marker({
        position: { 
          lat: this.state.locationDetail.lat, 
          lng: this.state.locationDetail.lon
        },
        title : this.state.locationDetail.name ,
        icon : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      });
      console.log("#setGroupMarker marker",marker);
      this.props.onChangeMarker(marker);
  }
  onFilterTextBoxChanged = event => {
    console.log("onFilterTextBoxChanged",event);
    this.props.searchLocation(event.target.value);
    //this.props.filterResult({key:'LOCATION_GROUP_LIST',filter:event.target.value});
    //this.state.api.setQuickFilter(document.getElementById('location-search').value);
  }
  handleAdd(event){
    this.setState({mode:'Add'});
    this.props.onDialogOpen(true);
    //this.props.onSwitchForm({page:'group'});
  }
  handleEdit(event){
    this.setState({mode:'Edit'});
    this.props.onDialogOpen(true);
    //this.props.onSwitchForm({page:'group'});
  }
  handleClick(event) {
    this.props.onDialogOpen(true);
  };
  formAddGroupForm(){}
  handleManageLocation(event){
    let location = {
      logistic_point_group_id : this.state.logistic,
      logistic_point_group : this.state.logisticText,
      location_group : this.state.locationText,
      location_group_id : this.state.location
    }
    this.props.addLocation(location);
    this.props.onSwitchForm({page:'manage'});
  }
  handleDeleteLocation(event){

  }
  dialogFormAddEdit(){
    return(
      <AddGroupForm
        type={this.state.mode}
        logistic={{ 
          value : this.state.logistic,
          text : this.state.logisticText
        }}
        location={{
          detail : this.state.locationDetail,
          value : this.state.location,
          text : this.state.locationText,
        }}
      />
    );
  }
  renderMenuItem(){
      
    if(this.props.grouplist !== undefined && this.props.grouplist !== null){      
          var menuItem = this.props.grouplist.result;
          return menuItem.map(function(data, index){
            return (
              <MenuItem key={index} value={data._id} detail={JSON.stringify(data)}>{data.name}</MenuItem>
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
        LOCATION MASTER
        </Typography>
        
        <PanelDialog 
          open={this.props.dialogOpen}
          title={this.state.mode+" Location Group"}
          form={this.dialogFormAddEdit.bind(this)}
        />
        <Card className={styles.card}>
          <CardContent>
            <Grid container spacing={20}>
              <Grid item xs={7}>
                <FormControl required fullWidth>
                  <InputLabel shrink htmlFor="logistic-required">LOGISTICS POINT GROUP</InputLabel>
                  <Select
                    value={this.state.logistic}
                    onChange={this.handleChange}
                    name="logistic"
                    fullWidth
                    inputProps={{
                      id: 'logistic-required',
                    }}
                  >
                    <MenuItem key={0} value={"1"}>Supplier</MenuItem>
                    <MenuItem key={1} value={"2"}>Plant</MenuItem>
                    <MenuItem key={2} value={"3"}>Yard</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={5}>
                
              </Grid>
              <Grid item xs={7}>
                  <FormControl required fullWidth>
                    <InputLabel shrink htmlFor="location-required">LOCATION GROUP</InputLabel>
                    <Select
                      value={this.state.location}
                      onChange={this.handleChange}
                      styles={styles.selectStyles}
                      name="location"
                      fullWidth
                      placeholder="Search Location Group"
                      inputProps={{
                        id: 'location-required',
                      }}
                    >
                      {this.renderMenuItem()}
                    </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={5}>
                <br/>
                    <Button disabled={this.state.location == ''} variant="contained" size="small" color="primary" aria-label="Edit" 
                      className={classNames(styles.button, styles.cssGreen)}
                      onClick={this.handleEdit.bind(this)}>
                      EDIT
                    </Button>
                    <Button disabled={this.state.logistic == ''} variant="contained" size="small"  color="primary" aria-label="Add" 
                      className={classNames(styles.button, styles.cssGreen)} 
                      onClick={this.handleAdd.bind(this)}>
                      ADD
                    </Button>
                
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <br></br>
        <Card className={styles.card}>
          <CardContent>
            <Grid container spacing={20}>              
              <Grid item xs={6}>
                <Typography variant="h7">
                LOGISTICS POINT
                </Typography>
              </Grid>
              <Grid item xs={6}>
                  <Button disabled={this.state.location == ''} variant="contained" size="small"  color="primary" aria-label="Add" 
                    className={classNames(styles.button, styles.cssGreen)} 
                    onClick={this.handleManageLocation.bind(this)}>
                    ADD
                  </Button>
                  <Button disabled={this.state.location == ''} variant="outlined" size="small"  color="secondary" aria-label="Add" 
                    className={classNames(styles.button, styles.cssGreen)} 
                    onClick={this.handleDeleteLocation.bind(this)}>
                    DELETE
                  </Button>
              </Grid>
              <Grid item xs={7}>
                <FormControl required fullWidth noValidate autoComplete="on">
                  <TextField
                    id="location-search"
                    label="SEARCH LOCATION"
                    type="search"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    className={styles.textField}
                    onChange={this.onFilterTextBoxChanged.bind(this)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment variant="filled" position="end">
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Locations/>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = function(state) {
  return {
    dialogOpen : state.ui.uiPanelDialogOpen,
    formManage : state.ui.formManage,
    grouplist : state.api.mapResult.get('LOCATION_GROUP_LIST'),
    manageForm : state.locationForm.manageForm,
  }
}
const mapActionsToProps =  {
  onDrawingOptions : uiDrawingOptions,
  onDialogOpen : uiPanelDialogOpen,
  onSwitchForm : uiSwitchForm,
  getGroupList : apiGetCallRequest,
  getLocations : apiGetCallRequest,
  successGroupList : apiGetCallSuccess,
  addLocation : addLocation,
  addGroupLocation : addGroupLocation,
  onChangeMode : uiDrawingMode,
  onResetMap : uiResetMap,
  onChangeMarker : uiChangeMarker,
  searchLocation: searchLocation,
  resetAPIResult,
};

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(SearchForm))