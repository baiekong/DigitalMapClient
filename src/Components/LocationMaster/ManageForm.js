import React, { Component } from 'react';
import { propTypes, reduxForm,Form, Field ,formValueSelector} from 'redux-form';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PlaceIcon from '@material-ui/icons/Place';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import CropDinIcon from '@material-ui/icons/CropDin';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import PanoramaHorizontalIcon from '@material-ui/icons/PanoramaHorizontal';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import PanelDialog from '../Ui/PanelDialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import Loading from '../Ui/Loading';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import {
  required,
  number,
} from '../../libs/validation'
import {
  apiCallRequest,
} from '../../reducers/api';
import {
  apiGetCallRequest,
} from '../../reducers/api';

import { uiPanelDialogOpen,uiSwitchForm } from '../../reducers/ui';
import { 
  uiDrawingMode,
  uiResetMap, 
  uiChangeMarker,
  uiChangeCircle,
  uiChangePolygon,
  uiAreaType,
  uiDrawingOptions 
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


class ManageForm extends Component {
  constructor(props){
      super(props);
      this.state = {
        drawingMode : null,
        marker : null,
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
      }
  }

  componentWillMount() {
    console.log("ManageForm #componentWillMount...");
    

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
      if(this.props.manageForm){
        this.props.initialize({ 
            logistic_point_group: this.props.manageForm.logistic_point_group || "",
            logistic_point_group_id : this.props.manageForm.logistic_point_group_id || "",
            location : this.props.manageForm.location_group || "",
            location_group_id : this.props.manageForm.location_group_id || "",
            location_group : this.props.manageForm.location_group || "",
            // time_control : new Date(Date.now())
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
        
      }
    }
  }
  componentDidMount() {
    this.props.onChangeMode(null);
    this.props.onResetMap(true);
    this.props.onDrawingOptions(this.state.drawingOptions);
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
          //logistic_point_group_id: nextProps.getDataPointDetail.logistic_point_group_id,
          //logistic_point: nextProps.getDataPointDetail.logistic_point,
          //location_group_id:this.props.manageForm.location_id,
          ...nextProps.getDataPointDetail
        });
        this.props.change('logistic_point_group',nextProps.getDataPointDetail.logistic_point);
        this.props.change('location',"[location group]");

        console.log('#componentWillReceiveProps getDataPointDetail',nextProps.getDataPointDetail);
        //Create Drawing 
        this.createMarker(nextProps.getDataPointDetail);
        if(nextProps.getDataPointDetail.type=='polygon')
          this.createPolygon(nextProps.getDataPointDetail);
        else if(nextProps.getDataPointDetail.type=='circle') 
          this.createCircle(nextProps.getDataPointDetail);
        
    } 
    if(this.props.areaType && this.props.areaType !== nextProps.areaType)
          this.props.change('type',nextProps.areaType||"");
    //when marker event
    if(nextProps.marker){
        console.log("#componentWillReceiveProps nextProps polygon",nextProps.polygon)
        console.log("#componentWillReceiveProps marker",this.props.marker)
        console.log("#componentWillReceiveProps circle",this.props.circle)
        console.log("#componentWillReceiveProps polygon",this.props.polygon)
        //only props are change
        if(this.props.marker==null || this.props.marker.getPosition().lat() !== nextProps.marker.getPosition().lat())
          this.props.change('lat',nextProps.marker.getPosition().lat()||"");
        if(this.props.marker==null || this.props.marker.lng !== nextProps.marker.getPosition().lng())
          this.props.change('lng',nextProps.marker.getPosition().lng()||"");
    }
    if(nextProps.circle){
        if(this.props.circle==null || this.props.circle.getRadius() !== nextProps.circle.getRadius())
          this.props.change('circle_radius',nextProps.circle.getRadius()||"");
        if(this.props.circle==null || this.props.circle.getCenter().lat() !== nextProps.circle.getCenter().lat())
          this.props.change('circle_lat',nextProps.circle.getCenter().lat()||"");
        if(this.props.circle==null || this.props.circle.getCenter().lng() !== nextProps.circle.getCenter().lng())
          this.props.change('circle_lng',nextProps.circle.getCenter().lng()||"");
    }
    if(nextProps.polygon){
        if(this.props.polygon==null || this.props.polygon !== nextProps.polygon){
          var encodeString = window.google.maps.geometry.encoding.encodePath(nextProps.polygon.getPath());
          console.log("#componentWillReceiveProps encodeString",encodeString)
          this.props.change('poly_encode',encodeString ||"");
        }
        /*if(this.props.polyline.encode !== nextProps.polyline.encode)
          this.props.change('polyline_encode',nextProps.polyline.encode ||"");*/
    }
  }

  createMarker= (detail) => {
    if(detail.lat && detail.lng){
      var marker = new window.google.maps.Marker({
        position: { 
          lat: detail.lat, 
          lng: detail.lng
        },
        title : detail.name 
      });
      console.log("#createMarker marker",marker)
      this.props.onChangeMarker(marker);
    }
  }
  createCircle= (detail) => {
    if(detail.circle_lat && detail.circle_lng){
      console.log('#createCircle detail ',detail)
      this.props.onChangeType(detail.type);
      var circle = new window.google.maps.Circle({
        center: {
          lat : detail.circle_lat,
          lng : detail.circle_lng,
        },
        radius: detail.circle_radius
      });
      this.props.onChangeCircle(circle);
    }
  }
  createPolygon= (detail) => {
    if(detail.polygon_encode){
      console.log('#createPolygon detail ',detail)
      var decodePath = window.google.maps.geometry.encoding.decodePath(detail.polygon_encode);
      var paths = [];
      decodePath.forEach(function(point) {
        //console.log('#createPolygon point',point);
        paths.push({lat:point.lat(),lng:point.lng()});
      });
      console.log('#createPolygon paths',paths);
      var polygon = new window.google.maps.Polygon({paths: paths});
      this.props.onChangeType(detail.type);
      this.props.onChangePolygon(polygon);
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

          logistic_point_group_id: form.logistic_point_group_id,
          logistic_point_group: form.logistic_point_group,
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
          logistic_point_group_id: form.logistic_point_group_id,
          logistic_point_group : form.logistic_point_group,
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
  handleClick(event) {
    this.props.onDialogOpen(true);
  }
  handleClickBack(event) {
    this.handleReset();
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

  render() {
    const { handleSubmit,submitting } = this.props;

    return (
      <div style={{ padding: "10px"}}>
        { this.props.isLoading && <Loading/> } 
        <Toolbar variant="dense">
          <Typography variant="h6" gutterBottom className={styles.titlePanel}>
            { this.props.mode } LOCATION MASTER
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
                    name='logistic_point_group_id'
                    component={renderInput}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="dense"
                  />
              
              <Field
                    type="hidden"
                    name='location_group_id'
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
                  <Field
                    disabled
                    name='logistic_point_group'
                    component={renderInput}
                    label='LOGISTICS POINT GROUP'
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    disabled
                    name='location_group'
                    component={renderInput}
                    label='LOCATION GROUP'
                    className={styles.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    margin="dense"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    label="LOGISTIC POINT"
                    name="logistic_point"
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
                <Grid item xs={12}>
                  <Field
                    name="time_control"
                    label="TC FROM"
                    type="date"
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
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={4}>
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
                </Grid>
                <Grid item xs={4}>
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
                </Grid>
                <Grid item xs={4}>
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
                </Grid>
                
                <Grid item xs={12}>
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
                </Grid>
                
              </Grid>
              <Grid item xs={12}>
                  <Button variant="contained" size="small" color="primary" aria-label="Save" className={styles.button} 
                    type="submit">
                    Save
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
    polyline: state.map.polyline,
    //rectangle : state.map.rectangle,
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
  onChangeMarker : uiChangeMarker,
  onChangeCircle : uiChangeCircle,
  onChangePolygon : uiChangePolygon,
  onDrawingOptions : uiDrawingOptions,
};

const enhance = compose(
  reduxForm({
    form: 'manageForm',
    // validate
  }),
  connect(mapStateToProps,mapActionsToProps),
  withStyles(styles)
);
export default enhance(ManageForm);