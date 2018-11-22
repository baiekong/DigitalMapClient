import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { uiSwitchForm } from '../../../reducers/ui';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
// import EditIcon from '@material-ui/icons/Create';
import {
    apiCallRequest,
} from '../../../reducers/api';



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
class EditBtnRenderer extends Component {
    constructor(props) {
        super(props);

        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        //this.props.context.componentParent.methodFromParent(`Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`)
        this.props.onSwitchForm({page:"manage",mode:"edit",editID:this.props.data._id});
    }

    render() {
        const { classes } = this.props;

        return (
            <span>
                {/* <Button variant="outlined" size="small" color="primary" className={classes.gridButton} onClick={this.invokeParentMethod} >
                    EDIT
                </Button> */}
                <IconButton
                    className={classes.iconStyle}
                    onClick={this.invokeParentMethod}
                >
                    <EditIcon/>
                </IconButton>
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
    onSwitchForm : uiSwitchForm,

};
const enhance = compose(
    connect(
        mapStateToProps,
        mapActionsToProps
    ),
    withStyles(styles)
);  

export default enhance(EditBtnRenderer)
