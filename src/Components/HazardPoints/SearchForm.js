import React, { Component } from 'react';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import Hazards from './Hazards';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { searchLocation } from '../../reducers/search';
import compose from 'recompose/compose';
//import renderDatePicker from '../Ui/Renderer/DatePickerRenderer';
import { propTypes, reduxForm,Form, Field ,formValueSelector} from 'redux-form';
//import AutoSelect from 'react-select';
import {
  required,
  number,
} from '../../libs/validation'
import {
  apiGetCallRequest,
  apiGetCallSuccess,
  resetAPIResult,
  apiCallRequest
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

class SearchForm extends Component {
  state = {
    category: "0",
    categoryText : '',
    dateForm : moment().format("YYYY-MM-DD"),
    dateTo : "9999-12-31",
    name: 'hai',
    mode : '',
    actionsLocationPointGroup :false,
    actionsLocationGroup : false,
    //labelWidth: 0,
    drawingOptions : {
      drawingControl: false,
      editable : true,
      circleOptions: {
        fillColor: "#F44336",
        fillOpacity: 0.5,
        strokeWeight: 1,
        stokColor:"#F44336",
        strokeOpacity: 0.5,
      },
      polygonOptions: {
        fillColor: "#F44336",
        fillOpacity: 0.5,
        strokeWeight: 1,
        stokColor:"#F44336",
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
    this.props.initialize({
        category : "0"
    })
    if(this.props.manageForm){
      console.log("SearchForm #componentWillMount..");
      this.setState({ 
          categoryText : this.props.manageForm.category || "",
          category : this.props.manageForm.category_id || "",
          //date_from : "12/12/2018"
      });
      
    }
  }
  componentWillReceiveProps(nextProps,props){
    
    console.log("SearchForm #componentWillReceiveProps ... apiFetchResult",nextProps.apiFetchResult)
    //when request api and done
    if(nextProps.apiFetchResult){
      if(nextProps.apiFetchResult.statusText === "OK" &&
           nextProps.apiFetchResult.url === "http://map.leafte.ch:1880/location/add_point" ||
           nextProps.apiFetchResult.url === "http://map.leafte.ch:1880/location/edit_point"
        ){
            this.handleReset();
        }
    }
  }
  handleChange = event => {
    if(event.target.name === "category")
    {  
      this.setState({
        [event.target.name]:event.target.value,
        categoryText :event.currentTarget.innerText
      });
      this.props.resetAPIResult('POINT_LIST');
      this.props.onResetMap(true);
      
    }
    
  };
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
  handleManageHazard(event){
    let location = {
      category_id : this.state.category,
      category : this.state.categoryText,
    }
    this.props.addLocation(location);
    this.props.onSwitchForm({page:'manage'});
  }
  
  handleSearch = form => {
    console.log("#handleSearch form ",form);
    this.props.getHazards({
      label : "HAZARD_LIST",
      url : "http://map.leafte.ch:1880/hazards/point_list",
      filter : {
        category_id: form.category,
        date_from: form.date_from,
        date_to: form.date_to,
      }
    })
  }
  render() {
    const { handleSubmit,submitting } = this.props;

    return (
      <div style={{ padding: "10px"}}>
        <Typography variant="h6" gutterBottom className={styles.titlePanel}>HAZARD POINTS</Typography>
        <Card className={styles.card}>
          <CardContent>
            <Form 
                  autoComplete={"off"}
                  autoCorrect={"off"}
                  spellCheck={"off"}
                  onSubmit={handleSubmit(this.handleSearch.bind(this))}
              >
              <Grid container spacing={15}>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                      <Button  variant="contained" size="small"  color="primary" aria-label="Add" 
                        className={classNames(styles.button, styles.cssGreen)} 
                        onClick={this.handleManageHazard.bind(this)}>
                        ADD HAZARD POINT
                      </Button>
                  </Grid>
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
                        InputLabelProps={{
                          shrink: true,
                          id: 'category-field',
                        }}
                        margin="dense"
                        className={styles.textField}
                        validate={[required]}
                        fullWidth>
                        <option key={0} value={"0"}>All Category</option>
                        <option key={1} value={"1"}>Share Information</option>
                        <option key={2} value={"2"}>Warning</option>
                        <option key={3} value={"3"}>Prohibit Area</option>
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                      <Field
                        name="date_from"
                        label="DATE FROM"
                        type="date"
                        component={renderInput}
                        className={styles.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="dense"
                      />
                      
                  </Grid>
                  <Grid item xs={6}>
                      <Field
                        name="date_to"
                        label="DATE TO"
                        type="date"
                        component={renderInput}
                        className={styles.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="dense"
                      />
                      
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" size="small" color="primary" aria-label="Save" className={styles.button} 
                        type="submit">
                        SEARCH
                      </Button>
                  </Grid>
              </Grid>
            </Form>
          </CardContent>
        </Card>
        <br></br>
        <Card className={styles.card}>
          <CardContent>
            <Grid container spacing={20}>              
              <Grid item xs={6}>
                <Typography variant="h7">HAZARD POINTS</Typography>
              </Grid>
              
              
              <Grid item xs={12}>
                <Hazards/>
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
    apiFetchResult : state.api.result,
    dialogOpen : state.ui.uiPanelDialogOpen,
    formManage : state.ui.formManage,
    manageForm : state.locationForm.manageForm,
  }
}
const mapActionsToProps =  {
  onDrawingOptions : uiDrawingOptions,
  request : apiCallRequest,
  onDialogOpen : uiPanelDialogOpen,
  onSwitchForm : uiSwitchForm,
  getHazards : apiGetCallRequest,
  successGroupList : apiGetCallSuccess,
  addLocation : addLocation,
  addGroupLocation : addGroupLocation,
  onChangeMode : uiDrawingMode,
  onResetMap : uiResetMap,
  onChangeMarker : uiChangeMarker,
  searchLocation: searchLocation,
  resetAPIResult,
};
const enhance = compose(
  reduxForm({
    form: 'searchHazardForm',
    initialValues: { 
      category : "0"
    }
    // validate
  }),
  connect(mapStateToProps,mapActionsToProps),
  withStyles(styles)
);
export default enhance(SearchForm);