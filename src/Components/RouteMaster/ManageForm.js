import React, { Component } from 'react';
import { propTypes, reduxForm,Form, Field } from 'redux-form';
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PlaceIcon from '@material-ui/icons/Place';
import PanoramaFishEyeIcon from '@material-ui/icons/PanoramaFishEye';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import PanoramaHorizontalIcon from '@material-ui/icons/PanoramaHorizontal';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';
import classNames from 'classnames';
import PanelDialog from '../Ui/PanelDialog';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import {
  required,
  number,
} from '../../libs/validation'

import { uiPanelDialogOpen,uiSwitchForm } from '../../reducers/ui';
import { uiDrawingMode,uiChangeCircle } from '../../reducers/map';
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
        marker : {
          lat : 0,
          lng : 0
        }
      }
  }

  componentWillMount() {
    

    if(this.props.manageForm){
      this.props.initialize({ 
          logisticPoint: this.props.manageForm.logistic_point_text || "",
          logisticPointId : this.props.manageForm.logistic_point_id || "",
          location : this.props.manageForm.location_text || "",
          locationId : this.props.manageForm.location_id || "",
          type : this.props.drawingMode || null,
          origin : this.props.origin || "",
          destination : this.props.destination || "",
          rec_center : this.props.rectangle.center || "",
          rec_ne : this.props.rectangle.ne || "",
          rec_sw : this.props.rectangle.se || "",
          circle_radius : this.props.circle.radius || "",
          circle_lat : this.props.circle.lat || "",
          circle_lon : this.props.circle.lng || "",
          poly_encode : this.props.polygon.encode || "",
      });
    }
    this.props.onChangeMode('marker');
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSave(form){

  }
  handleClick(event) {
    this.props.onDialogOpen(true);
  }
  handleClickBack(event) {
    this.props.onSwitchForm('list');
  }
  handleDrawingMode(mode,event) {
    console.log("#handleDrawingMode mode",mode);
    this.setState({drawingMode: mode},this.setMode);
  }
  setMode(){
    this.props.onChangeMode(this.state.drawingMode);
  }
  dialogFormAddEdit(){
    return(
      <div style={{padding:"5px"}}>
        <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Logistic Point"
              type="text"
              fullWidth
            />
        <TextField
              
              margin="dense"
              id="name"
              label="Logistic Point 2"
              type="text"
              fullWidth
            />
        <TextField
              
              margin="dense"
              id="name"
              label="Logistic Point 3"
              type="text"
              fullWidth
            />
        <TextField
              
              margin="dense"
              id="name"
              label="Logistic Point 4"
              type="text"
              fullWidth
            />
      </div>
    )
  }
  
  renderGroupButton(){
    return(
      <Grid item xs={12}>
            <Button variant="fab" mini color="secondary" aria-label="Add" className={styles.button}
              onClick={this.handleDrawingMode.bind(this,"marker")}>
              <PlaceIcon />
            </Button>
          <Button variant="fab" mini color="primary" aria-label="Add" className={styles.button}
            onClick={this.handleDrawingMode.bind(this,"circle")}>
            <PanoramaFishEyeIcon />
          </Button>
          <Button variant="fab" mini color="primary" aria-label="Add" className={styles.button}
            onClick={this.handleDrawingMode.bind(this,"rectangle")}>
            <CropOriginalIcon />
          </Button>
          <Button variant="fab" mini color="primary" aria-label="Add" className={styles.button}
            onClick={this.handleDrawingMode.bind(this,"polygon")}>
            <PanoramaHorizontalIcon />
          </Button>
      </Grid>
    )
  }

  render() {
    const { handleSubmit,submitting } = this.props;

    return (
      <div style={{ padding: "10px"}}>
        <Toolbar variant="dense">
          <Typography variant="h6" gutterBottom className={styles.titlePanel}>
          ADD/EDIT ROUTE MASTER
          </Typography>
        </Toolbar>
        <PanelDialog 
          open={this.props.dialogOpen}
          title={"Add / Edit Location"}
          form={this.dialogFormAddEdit.bind(this)}
        />
        <Form 
            autoComplete={"off"}
            autoCorrect={"off"}
            spellCheck={"off"}
            onSubmit={handleSubmit(this.handleSave.bind(this))}
        >
           <Grid container spacing={15}>
            <Grid item xs={12}>
              <Field
                label="Name"
                name="name"
                component={renderInput}
                className={styles.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                validate={[required]}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                disabled
                name='origin'
                component={renderInput}
                label='Origin'
                className={styles.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                disabled
                name='destination'
                component={renderInput}
                label='Destination'
                className={styles.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
              />
            </Grid>
            <Grid item xs={7}></Grid>
            <Grid item xs={5}>
              <div>
                <Button variant="contained" size="small" color="primary" aria-label="Save" className={styles.button} 
                  type="submit"
                >
                  Save
                </Button>
                <Button variant="contained" size="small"  color="secondary" aria-label="Add" className={classNames(styles.button, styles.cssGreen)} 
                  onClick={this.handleClickBack.bind(this)}>
                  BACK
                </Button>
              </div>
            </Grid>
          </Grid>
        </Form>
      </div>
    );
  }
}
const mapStateToProps = function(state,ownProps) {
  console.log("#mapStateToProps state",state);
  console.log("#mapStateToProps ownProps",ownProps);
  return {
    dialogOpen : state.ui.uiPanelDialogOpen,
    drawingMode : state.map.drawingMode,
    marker : state.map.marker,
    circle : state.map.circle,
    polygon: state.map.polygon,
    rectangle : state.map.rectangle,
    logistic : ownProps.logistic,
    location : ownProps.location,
    manageForm : state.locationForm.manageForm
  }
}
const mapActionsToProps =  {
  onDialogOpen : uiPanelDialogOpen,
  onSwitchForm : uiSwitchForm,
  onChangeMode : uiDrawingMode,
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