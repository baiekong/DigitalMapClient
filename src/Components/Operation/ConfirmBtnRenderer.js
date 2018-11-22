import React, {Component} from "react";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    gridButton: {
        padding: '0px 0px',
        minWidth: '50px',
        fontSize: '0.8em',
        minHeight: '20px'
    }
    })
class ConfirmBtnRenderer extends Component {
    constructor(props) {
        super(props);

        this.invokeParentMethod = this.invokeParentMethod.bind(this);
    }

    invokeParentMethod() {
        this.props.context.componentParent.methodFromParent(`Row: ${this.props.node.rowIndex}, Col: ${this.props.colDef.headerName}`)
    }

    render() {
        const { classes } = this.props;

        return (
            <span><Button variant="contained"  size="small" color="primary" className={classes.gridButton} onClick={this.invokeParentMethod} >
            Confirm
            </Button></span>
        );
    }
};

export default withStyles(styles)(ConfirmBtnRenderer)
