import React, { Component } from "react";
import { render } from "react-dom";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import { compose, withProps, withStateHandlers } from "recompose";
import { connect } from "react-redux";

class ImMarker extends Component {
  componentWillUpdate(nextProps, nextState) {}
  selectInfo = arg => {
    this.props.MARKER_SELECTING(this.props.id);
    // console.log(this.props.marker_selecting);
    // console.log(this.props.id);
  };

  onDragEnd = e => {
    this.props.position.lat = e.latLng.lat();
    this.props.position.lng = e.latLng.lng();
    this.props.MARKER_MOVE(this.props);
  };

  render() {
    const id = this.props.id;
    let selected = false;
    if (this.props.marker_selecting === id) {
      selected = true;
    }

    return (
      <Marker
        position={this.props.position}
        icon={this.props.icon}
        key={this.props.key}
        defaultDraggable={true}
        onClick={this.selectInfo}
        mapClearInfo={this.props.mapClearInfo}
        onDragEnd={this.onDragEnd}
        defaultDraggable={true}
      >
        {selected ? (
          <InfoWindow>
            <div>
              Description: <br />
              {this.props.description}
              <br />
              {this.props.isGroup}
            </div>
          </InfoWindow>
        ) : null}
      </Marker>
    );
  }
}

const mapStateToProps = state => {
  return {
    marker_selecting: state.marker_selecting
  };
};

const mapDispatchToProps = dispatch => {
  return {
    MARKER_SELECTING: id => dispatch({ type: "MARKER_SELECTING", value: id }),
    MARKER_MOVE: id => dispatch({ type: "MARKER_MOVE", value: id })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImMarker);
