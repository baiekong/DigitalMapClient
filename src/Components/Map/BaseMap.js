import React from "react";
import { render } from "react-dom";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle,
  InfoWindow,
  Polyline
} from "react-google-maps";
import { compose, withProps, withStateHandlers } from "recompose";
import { Provider, connect } from "react-redux";

import MarkerGroup from "./MarkerGroup";
import MarkerLocation from "./MarkerLocation";
import CircleK from "./CircleK";

class BaseMap extends React.Component {
  render() {
    return (
      <GoogleMap
        options={{ gestureHandling: "greedy" }}
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
        defaultClickableIcons={true}
      >
        {this.props.markers.map((marker, index) => {
          if (marker.isGroup)
            return (
              <MarkerGroup
                key={index}
                id={index}
                position={marker.position}
                isGroup={marker.isGroup}
                description={marker.description}
              />
            );
          return (
            <MarkerLocation
              key={index}
              id={index}
              position={marker.position}
              isGroup={marker.isGroup}
              description={marker.description}
            />
          );
        })}

        {this.props.circles.map((circle, index) => {
          return (
            <CircleK
              key={index}
              id={index}
              center={circle.center}
              editable={circle.editable}
              color="blue"
              radius={circle.radius}
            />
          );
        })}
      </GoogleMap>
    );
  }
}

const mapStateToProps = state => {
  return {
    markers: state.markers,
    circles: state.circles,
    polygons: state.polygons,
  };
};

export default connect(mapStateToProps)(
  compose(
    withProps({
      googleMapURL:
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyDC8E4Ez8ZxXI5V0IGT0jeIaBLuN8Y9QwY",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `500px` }} />,
      mapElement: <div style={{ height: `100%` }} />
    }),
    withScriptjs,
    withGoogleMap
  )(BaseMap)
);
