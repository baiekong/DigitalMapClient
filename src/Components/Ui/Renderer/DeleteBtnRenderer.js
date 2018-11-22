import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DeleteIcon from '@material-ui/icons/DeleteForever';

import { connect } from 'react-redux';

import compose from 'recompose/compose';
import {
    apiCallRequest,
} from '../../../reducers/api';
import {
    apiGetCallRequest,
} from '../../../reducers/api';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    gridButton: {
        padding: '0px 0px',
        minWidth: '50px',
        fontSize: '0.8em',
        minHeight: '20px'
    },
    iconStyle :{
        padding:0,
    }
})

class DeleteBtnRenderer extends Component {
    constructor(props) {
        super(props);
        //debugger
        this.invokeParentMethod = this.invokeParentMethod.bind(this);
        this.state = {
            open:false,
            name : this.props.data.name
        }
    }
    handleConfirm(){
        var id = this.props.data._id;
        this.props.request({
            url:"http://map.leafte.ch:1880/location/delete_point",
            form:{
                id:id   
            }
        })
        this.props.getLocations({
            label : "POINT_LIST",
            url : "http://map.leafte.ch:1880/location/point_list",
            filter : {
                //filter add here
            }
        });
        this.handleCancel();
    }
    handleCancel = () => {
        this.setState({ open: false });
    };
    invokeParentMethod() {
        console.log("open dialog :",this.state.openDialog)
        this.setState({open : true});
        //this.props.context.componentParent.methodFromParent(`Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`)
    }
    render() {
        const { classes } = this.props;

        return (
            <span>
                {/* <Button variant="outlined" size="small"  color="secondary" 
                  className={classes.gridButton} 
                  onClick={this.invokeParentMethod} >
                    DELETE
                </Button> */}
                <IconButton
                    className={classes.iconStyle}
                    onClick={this.invokeParentMethod}
                >
                    <DeleteIcon/>
                </IconButton>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                    >
                    <DialogTitle id="alert-dialog-slide-title">
                        Delete location point
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                        Confirm to delete { this.state.name }
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleConfirm.bind(this)} color="primary">
                            Confirm
                        </Button>
                        <Button onClick={this.handleCancel.bind(this)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </span>
        );
    }
};

const mapStateToProps = function(state,ownProps) {
    return {
        ...ownProps
    }
};

const mapActionsToProps =  {
    request : apiCallRequest,
    getLocations : apiGetCallRequest,
};
const enhance = compose(
    connect(
        mapStateToProps,
        mapActionsToProps
    ),
    withStyles(styles)
);  


export default enhance(DeleteBtnRenderer)
