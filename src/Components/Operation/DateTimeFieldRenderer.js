import React, {Component} from "react";
import moment from 'moment';

export default class DateTimeFieldRenderer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value
        }
    }

    formatDateTime(value) {
        
        return moment(value).format('HH:mm')
    }

    // noinspection JSUnusedGlobalSymbols
    refresh(params) {
        if(params.value !== this.state.value) {
            this.setState({
                value: params.value.toFixed(2)
            })
        }
        return true;
    }

    render() {
        return (
            <span>{this.formatDateTime(this.state.value)}</span>
        );
    }
};