import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

export default (props) => {
    console.log(props)
    return(
    <Card>
        <CardHeader title={props.name} />
        <CardContent></CardContent>
    </Card>
)}