import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import Locations from './Locations';
import PanelDialog from '../Ui/PanelDialog';
import MenuItem from '@material-ui/core/MenuItem';

import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';

import { propTypes, reduxForm,Form, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { uiPanelDialogOpen } from '../../reducers/ui';

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
  });
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

const renderInputArea = ({
    meta: { touched, error } = {},
    input: { ...inputProps },
    ...props
}) => (
<TextField
    error={!!(touched && error)}
    helperText={touched && error}
    multiline={true}
    rows={2}
    {...inputProps}
    {...props}
    fullWidth
/>
);

const renderSelectField = ({ input, label, meta: { touched, error }, children }) => (
    <Select
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
      children={children}/>
  )
  

class AddGroupForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            logisticText:'',
            logisticValue:'',
            locationText:'',
            locationValue:'',
        }
    }
    
    componentWillMount () { 
        console.log(this.props.logistic);
        console.log("location ",this.props.location);
        this.props.initialize({ 
            logisticPointGroup: this.props.logistic.text || "",
            logisticPointGroupId : this.props.logistic.value || "",
            locationGroup : this.props.location.text || "",
            detail: this.props.location.detail.description || "",
            lat : this.props.location.detail.lat || "",
            lon : this.props.location.detail.lon || ""
        });
    }
    componentDidMount(){
        this.props.getGroupList({
            label : "LOCATION_GROUP_LIST",
            url : "http://map.leafte.ch:1880/location/group_list",
            filter : {
                logistic_point_group_id: this.props.logistic.value
            }
        })
    }
    componentWillUnmount(){
        this.props.getGroupList({
            label : "POINT_LIST",
            url : "http://map.leafte.ch:1880/location/point_list",
            filter : {
              //filter add here
              logistic_point_group_id : this.props.logistic.value,
              location_group_id : this.props.location.value // can't use state becasuse state not yet to set
            }
          })
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.grouplist.statusText === "OK" &&
           (nextProps.grouplist.url === "http://map.leafte.ch:1880/location/add_group" || 
           nextProps.grouplist.url === "http://map.leafte.ch:1880/location/edit_group")
        ){
            this.props.onDialogOpen(false);

        }
    }
    handleSave(form){
        
        //event.preventDefault();
        //let data = this.props.form.addGroupForm;
        //this.props.validate()
        // let checkFieldTestResult = fieldValidatorCore.checkGroup("myGroup1");
        // if (checkFieldTestResult.isValid){
        //   //console.log("All fields with Gropu prop value as myGroup1 is valid");
        // } 

        console.log(form);
        let url = "http://map.leafte.ch:1880/location/add_group";
        if(this.props.type.toLowerCase() === "edit"){ 
            url = "http://map.leafte.ch:1880/location/edit_group";
        }
        
        //to do save
        // //location/group_list //get 
        this.props.request({
            url : url,
            form : {
                logistic_point_group_id: form.logisticPointGroupId,
                logistic_point_group : form.logisticPointGroup, //
                name :form.locationGroup, //location group name
                description:form.detail,
                lat : parseFloat(form.lat),
                lon : parseFloat(form.lon),
            }
        });
    }

    
    handleCancel(reset){
        this.props.onDialogOpen(false);
    }
    renderMenuItem(){
        
        if(this.props.grouplist !== null){
            if(Array.isArray(this.props.grouplist.result) && this.props.grouplist.result.length > 0)
            {
                return this.props.grouplist.result.forEach((data)=>{
                    //debugger
                    return (
                        <MenuItem key={data.id} value={data.id}>{data.name}</MenuItem>
                    )
                })
            }
            else return null;
        }
        else
            return null;
    }
    

    render(){
        const { handleSubmit,submitting } = this.props;
        return(
        <div style={{padding:"5px"}}>
            <Form 
                autoComplete={"off"}
                autoCorrect={"off"}
                spellCheck={"off"}
                onSubmit={handleSubmit(this.handleSave.bind(this))}
            >
                <Field
                    name='logisticPointGroup'
                    component={renderInput}
                    label='Logistics Point Group'
                    validate={[required]}
                    disabled={true}
                    />
                <Field
                    name='logisticPointGroupId'
                    component={renderInput}
                    type="hidden"
                />
                {/* <Field name="location" component={renderSelectField} label="location Group">
                    {
                        this.renderMenuItem()
                    }
                    
                    <MenuItem key={0} value={"1"}>Ten</MenuItem>
                    <MenuItem key={1} value={"2"}>Twenty</MenuItem>
                    <MenuItem key={2} value={"3"}>Thirty</MenuItem>
                </Field> */}
                
                
                <Field
                    name='locationGroup'
                    component={renderInput}
                    label='Location Group'
                    validate={[required]}
                    disabled={this.props.isLoading}
                    />
                <Field
                    name='detail'
                    component={renderInputArea}
                    label='Details'
                    validate={[required]}
                    disabled={this.props.isLoading}
                    />
                <Field
                    name='lat'
                    component={renderInput}
                    label='Lat'
                    validate={[required,number]}
                    disabled={this.props.isLoading}
                    />
                <Field
                    name='lon'
                    component={renderInput}
                    label='Lon'
                    validate={[required,number]}
                    disabled={this.props.isLoading}
                    />
        
                <DialogActions>
                    <Button variant="contained" size="small" color="primary" aria-label="Save"
                        disabled={submitting}
                        type="submit"
                    >
                        Save
                    </Button>
                    <Button variant="contained" size="small" variant="outlined" color="secondary" aria-label="Cancel"
                        onClick={this.handleCancel.bind(this)}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Form>
        </div>
        )
    }
}

const mapStateToProps = function(state,ownProps) {
    //console.log("test",ownProps);
    return {
        dialogOpen : state.ui.uiPanelDialogOpen,
        isLoading : state.api.fetching,
        logistic : ownProps.logistic,
        location : ownProps.location,
        grouplist : state.api.result,
        type : ownProps.type,
        // ...ownProps,
    }
}
const mapActionsToProps =  {
    onDialogOpen : uiPanelDialogOpen,
    request : apiCallRequest,
    getGroupList : apiGetCallRequest,
};

const enhance = compose(
    //translate,
    reduxForm({
        form: 'addGroupForm',
        // validate
    }),
    connect(
        mapStateToProps,
        mapActionsToProps
    ),
    withStyles(styles)
);  
export default enhance(AddGroupForm)