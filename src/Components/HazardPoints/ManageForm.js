import React, { Component } from 'react';
import moment from 'moment';
import { propTypes, reduxForm,Form, Field ,formValueSelector} from 'redux-form';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PlaceIcon from '@material-ui/icons/Place';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import Select from '@material-ui/core/Select';
import PanoramaHorizontalIcon from '@material-ui/icons/PanoramaHorizontal';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import PanelDialog from '../Ui/PanelDialog';
import TextField from '@material-ui/core/TextField';
import Loading from '../Ui/Loading';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import EditIcon from '@material-ui/icons/Edit';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import UploadFileInput from '../Ui/UploadFileInput';
//import momentLocaliser from 'react-widgets/lib/localizers/moment'

import 'react-widgets/dist/css/react-widgets.css'

import {
  required,
  number,
} from '../../libs/validation'
import {
  apiCallRequest,
  apiGetCallRequest,
  resetAPIResult
} from '../../reducers/api';

import { uiPanelDialogOpen,uiSwitchForm } from '../../reducers/ui';
import { 
  uiDrawingMode,
  uiResetMap, 
  uiChangeMarker,
  uiChangeCircle,
  uiChangePolygon,
  uiAreaType 
} from '../../reducers/map';
import Toolbar from '@material-ui/core/Toolbar';
import compose from 'recompose/compose';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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
  />
);
const renderSelect = ({
  meta: { touched, error } = {},
  input: { ...inputProps },
  ...props
  }) => (
  
  <Select
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
  />
);
const renderDateTimePicker = ({ input: { onChange, value }, showTime }) =>
  <DateTimePicker
    onChange={onChange}
    format="DD MMM YYYY"
    time={showTime}
    value={!value ? null : new Date(value)}
  />

class ManageForm extends Component {
  constructor(props){
      super(props);
      this.state = {
        drawingMode : null,
        marker : null,
        now : new Date(),
        categoryList : [
          {value : 1 ,text : "Share Information"},
          {value : 2 ,text : "Warning"},
          {value : 3 ,text : "Prohibit Area"},
        ]
      }
  }

  componentWillMount() {
    console.log("ManageForm #componentWillMount...");
    
    this.getWarningItem();
    if(this.props.mode === "EDIT"){
      //load data form api for edit
      //location/point_detail
      
      console.log("Edit ID",this.props.pointDeatailID);
      this.props.getPointDetail({
        label : "POINT_DETAIL",
        url : "http://map.leafte.ch:1880/location/point_detail",
        filter : {
            id:this.props.pointDeatailID,
            //filter add here
        }
      })
    }
    else{ // mode ADD
      //if(this.props.manageForm){
        this.props.initialize({ 
            category: this.props.manageForm && this.props.manageForm.category || "",
            category_id : this.props.manageForm &&  this.props.manageForm.category_id || "",
            date_from : moment().format("DD/MM/YYYY"),
            date_to : "31/12/2018",
            time_from : "23:59",
            time_to : "00:00",
            // type : this.props.drawingMode || null,
            // lat : this.props.marker.lat || "",
            // lng : this.props.marker.lng || "",
            // rec_center : this.props.rectangle.center || "",
            // rec_ne : this.props.rectangle.ne || "",
            // rec_sw : this.props.rectangle.sw || "",
            // circle_radius : this.props.circle.radius || "",
            // circle_lat : this.props.circle.lat || "",
            // circle_lng : this.props.circle.lng || "",
            // poly_encode : this.props.polygon.encode || "",
        });
        
      //}
    }
    this.props.onResetMap(true);
    this.props.onChangeMode(null);
  }

  componentWillReceiveProps(nextProps,props){
    

    //when request api and done
    if(nextProps.apiFetchResult){
      if(nextProps.apiFetchResult.statusText === "OK" &&
           nextProps.apiFetchResult.url === "http://map.leafte.ch:1880/location/add_point" ||
           nextProps.apiFetchResult.url === "http://map.leafte.ch:1880/location/edit_point"
        ){
            this.handleReset();
        }
    }
    
    //if nextprops and props no change
    if(nextProps.getDataPointDetail !== this.props.getDataPointDetail){
        //console.log('get data point detail ',nextProps.getDataPointDetail)
        //this.props.change('lat',nextProps.marker.lat||"");
        this.props.initialize({
          //category_id: nextProps.getDataPointDetail.category_id,
          //logistic_point: nextProps.getDataPointDetail.logistic_point,
          //location_group_id:this.props.manageForm.location_id,
          ...nextProps.getDataPointDetail
        });
        this.props.change('category',nextProps.getDataPointDetail.logistic_point);
        this.props.change('location',"[location group]");

        //Create Drawing 
        this.createMarker(nextProps.getDataPointDetail);
        if(nextProps.getDataPointDetail.type=='polygon')
          this.createPolygon(nextProps.getDataPointDetail);
        else if(nextProps.getDataPointDetail.type=='circle') 
          this.createCircle(nextProps.getDataPointDetail);
        
    } 

    //when marker event
    if(nextProps.marker)
    {
        console.log("#componentWillReceiveProps marker",this.props.marker)
        console.log("#componentWillReceiveProps circle",this.props.circle)
        //only props are change
        if(this.props.marker && this.props.marker.lat !== nextProps.marker.lat)
          this.props.change('lat',nextProps.marker.lat||"");
        if(this.props.marker  && this.props.marker.lng !== nextProps.marker.lng)
          this.props.change('lng',nextProps.marker.lng||"");
        if(this.props.areaType !== nextProps.areaType)
          this.props.change('type',nextProps.areaType||"");

        /*if(this.props.rectangle.center !== nextProps.rectangle.center)
          this.props.change('rec_center',nextProps.rectangle.center||"");
        if(this.props.rectangle.ne !== nextProps.rectangle.ne)
          this.props.change('rec_ne',nextProps.rectangle.ne||"");
        if(this.props.rectangle.sw !== nextProps.rectangle.sw)
          this.props.change('rec_sw',nextProps.rectangle.sw||"");*/

        if(this.props.circle && this.props.circle.radius !== nextProps.circle.radius)
          this.props.change('circle_radius',nextProps.circle.radius||"");
        if(this.props.circle && this.props.circle.lat !== nextProps.circle.lat)
          this.props.change('circle_lat',nextProps.circle.lat||"");
        if(this.props.circle && this.props.circle.lng !== nextProps.circle.lng)
          this.props.change('circle_lng',nextProps.circle.lng||"");

        if(this.props.polygon && this.props.polygon.encode !== nextProps.polygon.encode)
          this.props.change('poly_encode',nextProps.polygon.encode ||"");
        /*if(this.props.polyline.encode !== nextProps.polyline.encode)
          this.props.change('polyline_encode',nextProps.polyline.encode ||"");*/
    }
  }

  createMarker= (detail) => {
    if(detail.lat && detail.lng){
      this.props.onChangeMarker({
        lat : detail.lat,
        lng : detail.lng,
        show:true
      });
    }
  }
  createCircle= (detail) => {
    if(detail.circle_lat && detail.circle_lng){
      console.log('#createCircle detail ',detail)
      this.props.onChangeType(detail.type);
      this.props.onChangeCircle({
        lat : detail.circle_lat,
        lng : detail.circle_lng,
        radius : detail.circle_radius,
        show:true
      });
    }
  }
  createPolygon= (detail) => {
    if(detail.polygon_encode){
      console.log('#createPolygon detail ',detail)
      var decodePath = window.google.maps.geometry.encoding.decodePath(detail.polygon_encode);
      var paths = [];
      decodePath.forEach(function(point) {
        console.log('#createPolygon point',point);
        paths.push({lat:point.lat(),lng:point.lng()});
      });
      console.log('#createPolygon paths',paths);
      this.props.onChangeType(detail.type);
      this.props.onChangePolygon({
        encode : detail.polygon_encode,
        path : paths,
        show:true
      });
    }
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSave(form){
    //debugger
    if(this.props.mode.toUpperCase() === "EDIT"){
      //please edit here
      this.props.request({
        url : "http://map.leafte.ch:1880/location/edit_point",
        form : {
          id:form._id,

          category_id: form.category_id,
          category: form.category,
          location_group_id: form.location_group_id,
          location_group: form.location_group,

          logistic_point : form.logistic_point,
          name : form.name,
          description :form.description, 
          time_control:form.time_control,
          
          lat : form.lat,
          lng : form.lng,
          type : form.type,
          
          /*rec_center :form.rec_center||"",
          rec_ne:form.rec_ne||"",
          rec_sw:form.rec_sw||"",*/

          circle_radius: form.circle_radius||"",
          circle_lat:form.circle_lat||"",
          circle_lng:form.circle_lng||"",
          
          polygon_encode :form.poly_encode||"",

        }
      })
    }
    else{
      this.props.request({
        url : "http://map.leafte.ch:1880/location/add_point",
        form : {
          category_id: form.category_id,
          category : form.category,
          location_group_id: form.location_group_id,
          location_group: form.location_group,

          logistic_point : form.logistic_point,
          name : form.name,
          description :form.description, 
          time_control:form.time_control,
          
          lat : form.lat,
          lng : form.lng,
          type : this.props.areaType,
          
          /*rec_center :form.rec_center||"",
          rec_ne:form.rec_ne||"",
          rec_sw:form.rec_sw||"",*/

          circle_radius: form.circle_radius||"",
          circle_lat:form.circle_lat||"",
          circle_lng:form.circle_lng||"",
          
          polygon_encode :form.poly_encode||"",
        }
      });
    }
  }
  renderWarningEdit(){
    return (
      <Grid item xs={4}>
        <Button variant="contained" size="small" color="primary" aria-label="Edit" 
          className={classNames(styles.button)}
          onClick={this.handleWarningEdit.bind(this)}>
          EDIT
        </Button>
      </Grid>);
  }

  getWarningItem(){
      this.props.resetAPIResult('POINT_LIST');
      this.props.getWarningList({
        label : "WARNING_LIST",
        url : "http://map.leafte.ch:1880/hazards/warning_list",
        filter : {
          enable: true,
        }
      });
  }
  renderWarningItem(){
      if(this.props.warningList !== undefined && this.props.warningList && this.props.warningList.result){      
        console.log("ManageForm #renderWarningItem warningList",this.props.warningList);
            var menuItem = this.props.warningList.result;
            return menuItem.map(function(data, index){
              return (
                <option key={index} value={data._id} detail={JSON.stringify(data)}>{data.name}</option>
              )
            });
      }
      else
          return null;
  }
  handleClick(event) {
    this.props.onDialogOpen(true);
  }
  handleClickBack(event) {
    this.handleReset();
  }
  handleWarningEdit(event){

  }
  handleReset(){
    this.props.onSwitchForm({page:'list'});
    this.props.reset();
    //reset map here
    //...
    this.props.onResetMap(true);
  }

  handleDrawingMode(mode,event) {
    console.log("#handleDrawingMode mode",mode);
    //this.props.onResetMap(false);
    this.setState({drawingMode: mode},this.setMode);
  }
  setMode(){
    if(this.state.drawingMode!='marker')
      this.props.onChangeType(this.state.drawingMode);
    this.props.onChangeMode(this.state.drawingMode);
  }

  
  renderGroupButton(){
    return(
        <Grid item xs={12}>
            <Button variant="fab" mini color="primary" aria-label="Create Circle" className={styles.button}
              onClick={this.handleDrawingMode.bind(this,"circle")}>
              <PanoramaFishEyeIcon className={styles.rightIcon}/>
            </Button>
            <Button variant="fab" mini color="primary" aria-label="Create Polygon" className={styles.button}
              onClick={this.handleDrawingMode.bind(this,"polygon")}>
              <PanoramaHorizontalIcon className={styles.rightIcon}/>
            </Button>
            
        </Grid>
    )
  }
  renderCategoryItem(){
    return this.state.categoryList.map(function(data, index){
      return (
        <option key={index} value={data.value}>{data.text}</option>
      )
    });
  }
  renderValueItem(value){
    console.log("#renderValueItem value",value);
    switch(value){
      case 1 :
        return `🚫  : ${this.state.categoryList[value-1].text}`;
      case 2 :
        return `❗  : ${this.state.categoryList[value-1].text}`;
      case 3 :
        return `⚠️  : ${this.state.categoryList[value-1].text}`;
    }
   
  }
  handleChangeDateFrom = (e) => {
    console.log("SearchForm #handleChangeDateFrom",e.target.value)
    this.setState({dateForm: e.target.value});
  }
  handleChangeDateTo = (e) => {
    console.log("SearchForm #handleChangeDateTo",e)
    this.setState({
      //dateTo: moment(date).format("YYYY-MM-DD"),
    });
  }
  render() {
    const { handleSubmit,submitting } = this.props;

    return (
      <div style={{ padding: "10px"}}>
        { this.props.isLoading && <Loading/> } 
        <Toolbar variant="dense">
          <Typography variant="h6" gutterBottom className={styles.titlePanel}>
            { this.props.mode } HAZARD POINT
          </Typography>
        </Toolbar>
        <Card className={styles.card}>
          <CardContent>
            <Form 
                autoComplete={"off"}
                autoCorrect={"off"}
                spellCheck={"off"}
                onSubmit={handleSubmit(this.handleSave.bind(this))}
            >
              {/* hidden field here */}
              <Field
                    type="hidden"
                    name='_id'
                    component={renderInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                  />
              <Field
                    type="hidden"
                    name='category_id'
                    component={renderInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                  />
              
              <Field
                    type="hidden"
                    name='type'
                    component={renderInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                  />
              {/* end hidden field */}
              <Grid container spacing={15}>
                <Grid item xs={12}>
                    <FormControl fullWidth className={styles.formControl}>
                      <InputLabel shrink htmlFor="category-field">
                        CATEGORY
                      </InputLabel>
                      <Field 
                        value={this.state.category}
                        onChange={this.handleChange}
                        name="category"
                        component={renderSelect}
                        label="CATEGORY"
                        renderValue={this.renderValueItem.bind(this)}
                        InputLabelProps={{
                          shrink: true,
                          id: 'category-field',
                        }}
                        margin="dense"
                        className={styles.textField}
                        fullWidth>
                        {this.renderCategoryItem()}
                      </Field>
                    </FormControl>
                </Grid>

                <Grid item xs={8}>
                  <FormControl fullWidth className={styles.formControl}>
                    <InputLabel shrink htmlFor="warning-field">
                    WARNING TYPE
                    </InputLabel>
                    <Field value={this.state.category}
                      onChange={this.handleChange}
                      name="warning"
                      fullWidth
                      component={renderSelect}
                      label="WARNING TYPE"
                      
                      InputLabelProps={{
                        shrink: true,
                        id: 'warning-field'
                      }}
                      margin="dense"
                      className={styles.textField}
                      >
                      {this.renderWarningItem()}
                    </Field>
                  </FormControl>
                </Grid>
                {this.renderWarningEdit}
                <Grid item xs={12}>
                  <Field
                    label="NAME"
                    name="name"
                    fullWidth
                    component={renderInput}
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    validate={[required]}
                  />
                </Grid>
                <Grid item xs={7}>
                <TextField
                    name="date_from"
                    label="DATE FROM"
                    type="date"
                    onChange={this.handleChangeDateFrom}
                    defaultValue={moment().format("YYYY-MM-DD")}
                    dateFormat="YYYY/MM/DD"
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={5}>
                  <Field
                    name="time_from"
                    label="TIME FROM"
                    type="time"
                    component={renderInput}
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    validate={[required]}
                  />
                </Grid>
                <Grid item xs={7}>
                <TextField
                        name="date_to"
                        label="DATE TO"
                        type="date"
                        onChange={this.handleChangeDateTo}
                        defaultValue={"9999-12-31"}
                        dateFormat="YYYY/MM/DD"
                        className={styles.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="dense"
                      />
                </Grid>
                <Grid item xs={5}>
                  <Field
                    name="time_to"
                    label="TIME TO"
                    type="time"
                    component={renderInput}
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    validate={[required]}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    name="description"
                    label="DETAIL"
                    component={renderInput}
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    margin="dense"
                    validate={[required]}
                  />
                </Grid>
                
                <Grid item xs={2}>
                  <IconButton color="primary" aria-label="Create Marker" className={styles.button}
                    onClick={this.handleDrawingMode.bind(this,"marker")}>
                    <PlaceIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={4}>
                  <Field
                    disabled
                    name="lat"
                    label="Lat"
                    component={renderInput}
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    validate={[required,number]}
                  />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={4}>
                  <Field
                    disabled
                    name="lng"
                    label="lng"
                    component={renderInput}
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    validate={[required,number]}
                  />
                </Grid>
                
                {
                  this.renderGroupButton()
                }
                  <Field
                    type="hidden"
                    name="type"
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    component={renderInput}
                    />
                  <Field
                    type="hidden"
                    name="circle_radius"
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    component={renderInput}
                    />
                  <Field
                    type="hidden"
                    name="circle_lat"
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    component={renderInput}
                      
                    />
                  <Field
                    type="hidden"
                    name="Circle lng"
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                    component={renderInput}
                    />
                
                  <Field
                      type="hidden"
                      name="polygon_encode"
                      className={styles.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="dense"
                      component={renderInput}
                    />
                <Grid item xs={12}>
                  <UploadFileInput/>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                  <Button variant="contained" size="small" color="primary" aria-label="Save" className={styles.button} 
                    type="submit">
                    SAVE
                  </Button>
                  <Button variant="outlined" size="small"  color="secondary" aria-label="Add" className={classNames(styles.button, styles.cssGreen)} 
                    onClick={this.handleClickBack.bind(this)}>
                    BACK
                  </Button>
                </Grid>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = function(state,ownProps) {
  //console.log("#mapStateToProps state",state);
  //console.log("#mapStateToProps ownProps",ownProps);
  return {
    isLoading : state.api.fetching,
    //successSave : state.api.result,
    apiFetchResult : state.api.result,
    dialogOpen : state.ui.uiPanelDialogOpen,
    drawingMode : state.map.drawingMode,
    areaType : state.map.areaType,
    marker : state.map.marker,
    circle : state.map.circle,
    polygon: state.map.polygon,
    warningList : state.api.mapResult.get('WARNING_LIST'),
    manageForm : state.locationForm.manageForm,
    
    mode : state.ui.formManage.mode || ownProps.mode === "edit"? "EDIT" : "ADD",
    pointDeatailID : state.ui.formManage.editID || "",

    logistic : ownProps.logistic,
    location : ownProps.location,

    getDataPointDetail : state.api.mapResult.get('POINT_DETAIL')
  }
}
const mapActionsToProps =  {
  request : apiCallRequest,
  onDialogOpen : uiPanelDialogOpen,
  onSwitchForm : uiSwitchForm,
  onChangeMode : uiDrawingMode,
  onChangeType : uiAreaType,
  onResetMap : uiResetMap,
  getPointDetail : apiGetCallRequest,
  getWarningList : apiGetCallRequest,
  onChangeMarker : uiChangeMarker,
  onChangeCircle : uiChangeCircle,
  onChangePolygon : uiChangePolygon,
  resetAPIResult
};

const enhance = compose(
  reduxForm({
    form: 'manageHazardForm',
    initialValues: { 
      date_from: moment().format("DD/MM/YYYY"), 
      date_to: "31/12/2018",
    }
    // validate
  }),
  connect(mapStateToProps,mapActionsToProps),
  withStyles(styles)
);
export default enhance(ManageForm);
