import React, { Component } from "react";
import { render } from "react-dom";
import { connect } from "react-redux";
import ImMarker from "./ImMarker";

class MarkerGroup extends Component {
  render() {
    let icon = new window.google.maps.MarkerImage(
      "http://maps.google.com/mapfiles/ms/icons/blue.png",
      null /* size is determined at runtime */,
      null /* origin is 0,0 */,
      null /* anchor is bottom center of the scaled image */,
      new window.google.maps.Size(32, 32)
    );
    return <ImMarker {...this.props} icon={icon} />;
  }
}

export default MarkerGroup;
