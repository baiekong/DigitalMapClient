import React, { Component } from 'react';
import { compose, withProps,withState,withHandlers,withStateHandlers } from "recompose"
import { 
  GoogleMap,
  withScriptjs, 
  withGoogleMap, 
  Marker,Circle,Polyline,Polygon,InfoWindow 
} from "react-google-maps"
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { 
    uiDrawingMode ,
    uiChangeMarker,
    uiChangeCircle,
    uiChangeRectangle,
    uiChangePolygon,
    uiChangePolyline,
    uiResetMap,
    uiSelectedMarker,
    uiCenterChanged
  } from '../reducers/map';
const { DrawingManager } = require("react-google-maps/lib/components/drawing/DrawingManager");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const styles = theme => ({
    gridButton: {
        padding: '0px 0px',
        minWidth: '50px',
        fontSize: '0.8em',
        minHeight: '20px'
    }
})

const iconLocation = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';


const MapComponent = compose(
  //connect(mapStateToProps),
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAWQwbZgCqup0ivtwF-l1OFLPt_AKqGYzQ&v=3&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: "90%" }} />,
    containerElement: <div style={{ height: "90%" }} />,
    mapElement: <div style={{ height: "90%" }} />,
  }),
  withStateHandlers(() => ({
    isOpen: false,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    ref={props.onMapMounted}
    zoom={props.zoom}
    center={props.center}
    //onClick={props.onMapClick}
    //onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Search Places"
        style={{
          boxSizing: "border-box",
          border: "1px solid transparent",
          width: "300px",
          height: "32px",
          marginTop: "10px",
          marginRight: "40px",
          padding: "0 12px",
          borderRadius: "3px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          fontSize: "14px",
          outline: "none",
          textOverflow: "ellipses",
        }}
      />
    </SearchBox>
    {props.marker &&  
      <Marker 
        key="selectMarker" 
        position={{
          lat:props.marker.getPosition().lat(),
          lng:props.marker.getPosition().lng()
        }} 
        icon={props.marker.icon ? props.marker.icon : iconLocation}
        onClick={props.onMarkerClick.bind(this, props.marker)}>
        {props.selectedMarker === props.marker && 
          <InfoWindow onCloseClick={props.onToggleOpen}>
          <div>
            <div><b>Logistic Group : </b></div>
            <div> {props.marker.title ? props.marker.title  : ''}</div>
          </div>
          </InfoWindow>}
      </Marker>
    }
    {props.circle &&
      <Circle 
        key="selectCircle" 
        ref={props.onCircleMounted}
        center={{
          lat:props.circle.getCenter().lat(),
          lng:props.circle.getCenter().lng()
        }} 
        onRadiusChanged={props.onRadiusChanged}
        onCenterChanged={props.onCircleCenterChanged}
        radius={props.circle.getRadius()} editable={true}/>
    }
    {props.polygon &&  
      <Polygon 
        key="selectPolygon" 
        ref={props.onPolygonMounted}
        path={props.polygon.getPath()} 
        editable={true}
        options={props.drawingOptions.polygonOptions}
        onPolygonMouseDown={props.onPolygonChangeStart}
        onPolygonTouchStart={props.onPolygonChangeStart}
        onPolygonMouseUp={props.onPolygonChangeEnd}
        onPolygonTouchEnd={props.onPolygonChangeEnd}
        onPolygonDragEnd={props.onPolygonDragEnd}/>
    }
    {props.isPolylineShown && 
        props.coordsArray.map((coords, index) =>
        <Polyline 
          path={coords} 
          onMouseOver={props.onPolylineMouseOver} 
          onClick={props.onPolylineClick}
        />)
    }
    {props.markers && props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
    {props.logistic_point && props.logistic_point.map((marker, index) =>
        <Marker 
        key={"marker_"+marker._id} 
        onClick={props.onMarkerClick.bind(this, marker)}
        icon={iconLocation}
        position={{ 
          lat: marker.lat,
          lng: marker.lng,
        }} >
        
        {props.selectedMarker === marker && <InfoWindow onCloseClick={props.onToggleOpen}>
          <div>
            <div>  {marker.logistic_point ? 'Logistic Point : '+marker.logistic_point : ''}</div>
            <div><b>Name : </b></div>
            <div>  {marker.name}</div>
            <div>  {marker.description}</div>
          </div>
        </InfoWindow>}
        </Marker>)
    }
    {props.logistic_point && props.logistic_point.map((polygon, index) =>
        polygon.type=='polygon' && 
        <Polygon key={"polygon_"+polygon._id}  path={polygon.path} options={props.drawingOptions.polygonOptions}/>
    )}
    
    {props.logistic_point && props.logistic_point.map((circle, index) =>
     circle.type=='circle' && 
     <Circle 
        key={"circle_"+circle._id}
        center={{
          lat:circle.circle_lat,
          lng:circle.circle_lng
        }} 
        radius={circle.circle_radius} />
    )}
    <DrawingManager
      options={props.drawingOptions}
      drawingMode={props.drawingMode}
      onOverlayComplete={props.onOverlayComplete}
      onMarkerComplete={props.onMarkerComplete}
      onCircleComplete={props.onCircleComplete}
      onPolygonComplete={props.onPolygonComplete}
      onPolylineComplete={props.onPolylineComplete}
      onRectangleComplete={props.onRectangleComplete}
    />
  </GoogleMap>
);


class BaseMap extends Component {
  state = {
    map : null,
    searchbox : null,
    center: {
      lat: 13.95,
      lng: 101.33
    },
    zoom: 11,
    isMarkerShown: false,
    markerPosition : null,
    drawingManager : null,
    marker : null,
    circle : null,
    rectangle : null,
    polygon : null,
    markers : null,
    logistic_point : null,
    bounds : null,
    selectedMarker : false,
    logistic_point_ori : null,
    coordsArray : [
      [{ lat:13.8583628, lng:100.4445223 }, { lat: 14.061604,lng:100.8455233 }]
    ]
  };

  componentDidMount() {
    //console.log("componentDidMount...");
    if(this.props.isReset)this.clearDrawing(true);
    //this.delayedShowMarker()
    this.loadEventPolygon();
  }
  componentWillReceiveProps(nextProps){
    setTimeout(() => {
        console.log("BaseMap : #componentWillReceiveProps... nextProps",nextProps);
        console.log("BaseMap : #componentWillReceiveProps... state",this.state);
        if(!nextProps.logistic_point || nextProps.logistic_point.length==0){
          //this.clearDrawing(true);
          //this.props.onResetMap(false);
        }
        
        if(this.props.formManage.page=='manage' && nextProps.mode!="add" && nextProps.mode!="edit" && !nextProps.drawingMode){
          //this.clearDrawing(true);
        } 
        if(this.props.formManage.page=='list'){
          if(this.state.logistic_point_ori==null || this.state.logistic_point_ori!=nextProps.logistic_point ){
          //this.clearDrawing(true);
            if(nextProps.logistic_point && window.google && nextProps.logistic_point.length>0){
              var dataList = [];
              var bounds = new window.google.maps.LatLngBounds();
              nextProps.logistic_point.forEach(function(detail) {
                var decodePath = window.google.maps.geometry.encoding.decodePath(detail.polygon_encode);
                var paths = []; 
                decodePath.forEach(function(point) {
                  paths.push({lat:point.lat(),lng:point.lng()});
                  //bounds.extend(new window.google.maps.LatLng(point.lat(),point.lng()));
                });
                if(detail.lat!=0 && detail.lng!=0) bounds.extend(new window.google.maps.LatLng(detail.lat,detail.lng));
                detail.path = paths;
                dataList.push(detail);
              });
              //Fit Bound
              if(this.state.map){
                this.state.map.fitBounds(bounds)

                if(nextProps.marker && nextProps.marker!=this.state.marker 
                  && nextProps.marker.lat!=0 && nextProps.marker.lng!=0) {
                  /*this.setState({center:{
                    lat : nextProps.marker.lat,
                    lng : nextProps.marker.lng,
                  }});*/
                }
              }
              //this.clearDrawing(true);
              this.setState({bounds:bounds});
              this.setState({logistic_point:dataList});
              this.setState({logistic_point_ori:nextProps.logistic_point});
              
            } else {
              //this.setState({logistic_point:[]});
              //this.clearDrawing(true);
            }
            /*if(nextProps.polygon){
              var path = window.google.maps.geometry.encoding.decodePath(nextProps.polygon.polygon_encode);
              window.google.maps.event.addListener(nextProps.polygon, 'set_at', function(potision) {
                console.log("set_at",potision);
              });
            }*/
          }
        }
    }, 3000)
  }
  handleMapMounted = (map) => {
    this.setState({map:map});
  }
  onBoundsChanged = () => {
    this.setState({
      bounds: this.state.map.getBounds(),
      center: this.state.map.getCenter(),
    })
  }
  onSearchBoxMounted = (searchbox) => {
    this.setState({searchbox:searchbox});
  }
  onPlacesChanged = () => {
    const places = this.state.searchbox.getPlaces();
    const bounds = new window.google.maps.LatLngBounds();
    //console.log("#onPlacesChanged places",places);
    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    });
    const nextMarkers = places.map(place => ({
      position: place.geometry.location,
    }));
    this.setState({center:nextMarkers[0].position})
    this.props.onCenterChanged(nextMarkers[0].position);
    // refs.map.fitBounds(bounds);
  }
  
  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }
  
  handleMapClick = (e) => {
    //console.log("#handleMapClick",e);
  }
  handleOverlayComplete= (overlay) => {
    console.log("#handleOverlayComplete",overlay);
    overlay.enableCoordinatesChangedEvent();

    window.google.maps.event.addListener(overlay, 'coordinates_changed', function (index, obj) {
        // Polygon object: yourPolygon
        console.log('coordinates_changed');
    });
  }
  ///////////////////////////MARKER///////////////////////////
  handlerMarkerComplete = (marker) => {
    console.log("#handlerMarkerComplete...",marker);
    marker.setMap(null);
    this.props.onChangeMarker(marker);
    //this.setState({marker:marker});
  }
  handleMarkerClick = (marker, event) => {
    //console.log("#handleMarkerClick",marker); 
    this.props.onSelectedMarker(marker);
    //this.delayedShowMarker()
  }
  onMarkerDragEnd = (e) => {
    console.log("#onMarkerDragEnd",e.latLng)
    var newCoods = [];
        newCoods.push([this.state.coordsArray[0][0],e.latLng])
        newCoods.push([this.state.coordsArray[0][1],e.latLng])
    this.setState({coordsArray:newCoods})
    this.setState({markerPosition:e.latLng})
  }
  ///////////////////////////CIRCLE///////////////////////////
  handleCircleMounted= (circle) => {
    //console.log("#handleCircleMounted");
    this.setState({circle:circle});
    
  }
  handleCircleComplete = (circle) => {
    circle.setMap(null);
    console.log("#handleCircleComplete",circle);
    //this.clearDrawing(false);
    this.setState({circle:circle},this.setCircle);
   
  }
  handleRadiusChanged = () => {
    console.log("#onRadiusChanged.... circle");
    //this.setCircle(this.state.circle);
    this.setCircle();
  }
  handleCircleCenterChanged = () => {
    console.log("#handleCircleCenterChanged... circle");
    //this.setCircle(this.state.circle);
     this.setCircle();
  }
  setCircle = () =>{
      this.clearDrawing(false);
      console.log("BaseMap #setCircle...",this.state.circle);
      this.props.onChangeCircle(this.state.circle);
      this.props.onChangeDrawingMode(null);
      //this.setState({circle:circle});
  }
  ///////////////////////////POLYGON///////////////////////////
  handlePolygonMounted= (polygon) => {
    console.log("#handlePolygonMounted",polygon);
    this.setState({polygon:polygon});
    this.props.onChangePolygon(polygon)
    
    //this.setState({polygon:polygon},this.loadEventPolygon);
  }
  
  handlePolygonComplete = (polygon) => {
    console.log("#onPolygonComplete polygon",polygon);
    polygon.setMap(null);
    this.clearDrawing(false);
    this.props.onChangePolygon(polygon);
    this.loadEventPolygon();
  }
  handlePolygonChangeStart = (polygon) => {
    console.log("#handlePolygonChangeStart polygon",polygon.getPath());
  }
  handlePolygonChangeEnd = (polygon) => {
    console.log("#handlePolygonChangeEnd polygon",polygon.getPath());
  }
  loadEventPolygon(){
    var self = this;
    console.log("#loadEventPolygon",this.props.polygon);
    if(this.props.polygon){
      this.props.polygon.getPaths().forEach(function (path, index) {

        window.google.maps.event.addListener(path, 'insert_at', function () {
            console.log('insert_at event');
        });

        window.google.maps.event.addListener(path, 'remove_at', function () {
            console.log('remove_at event');
        });

        window.google.maps.event.addListener(path, 'set_at', function () {
            console.log('set_at event',path);
            var encodeString = window.google.maps.geometry.encoding.encodePath(path);
            console.log('set_at event',encodeString);
            //self.clearDrawing(false);
            self.props.onChangePolygon({
              encode:encodeString,
              path : path,
              show:true
            });
            //objThis.setState({polygon:polygon});
        });
      });
    }
  }
  ///////////////////////////RECTANGLE///////////////////////////
  onRectangleComplete = (rectangle) => {
    //console.log("#onRectangleComplete",rectangle);
    this.clearDrawing(false);
    this.props.onChangeRectangle(rectangle.getBounds());
    this.setState({rectangle:rectangle});
  }
  ///////////////////////////POLYLINE///////////////////////////
  onPolylineComplete = (polyline) => {
    //console.log("#onPolylineComplete polygon",polyline.getPath());
    var encodeString = window.google.maps.geometry.encoding.encodePath(polyline.getPath());
    //console.log("#onPolylineComplete encodeString",encodeString);
    this.clearDrawing(false);
    this.props.onChangePolyline(encodeString);
    this.setState({polyline:polyline});
  }
  handlerPolygonDragEnd= (e) => {
    //console.log("#handlerPolygonDragEnd",e)
  }
  onPolylineMouseOver = (e) => {
    //console.log("#onPolylineMouseOver",e)
  }
  onPolylineClick = (e) => {
    //console.log("#onPolylineClick",e.latLng)
    this.setState({isMarkerShown:true,markerPosition:e.latLng})
  }
  removeMarkers(markers) {
    markers.forEach(m => m.setMap(null));
  }
  removeCircles(circles) {
    circles.forEach(c => c.setMap(null));
  }
  removePolygons(polygons) {
    polygons.forEach(p => p.setMap(null));
  }
  clearDrawing = (isMarker) => {
    console.log("BaseMap #clearDrawing...");
    if(this.props.marker && (isMarker || this.state.isMarker)) {
      this.props.marker.setMap(null);
      this.setState({marker:null});
    }
    if(this.props.circle && this.props.mode!='edit') {
      this.props.circle.setMap(null);
    }
    if(this.state.rectangle){ 
      this.state.rectangle.setMap(null);
    }
    if(this.props.polygon && this.props.mode!='edit'){ 
      this.props.polygon.setMap(null);
      this.setState({polygon:null});
    }
    if(this.state.polyline){ 
      this.state.polyline.setMap(null);
    }
    if(this.state.markers){ 
      this.removeMarkers(this.state.markers);
      this.setState({markers:null});
    }
    if(this.state.polygons){ 
      this.state.polygons.forEach(function(polygon){
        polygon.setMap(null);
      });
      this.setState({polygons:null});
    }
    this.setState({logistic_point:null});
    this.props.onChangeDrawingMode(null);
    //this.props.resetMap(null);
  }
  render() {
    return (
      <MapComponent
        onMapMounted={this.handleMapMounted}
        onCircleMounted={this.handleCircleMounted}
        onPolygonMounted={this.handlePolygonMounted}

        drawingMode={this.props.drawingMode}  
        drawingOptions={this.props.drawingOptions}
        onOverlayComplete={this.state.handleOverlayComplete}
        onPlacesChanged={this.onPlacesChanged}
        onSearchBoxMounted={this.onSearchBoxMounted}
        //onBoundsChanged={this.onBoundsChanged}

        isMarkerShown={this.props.isMarkerShown}
        selectedMarker={this.props.selectedMarker}
        markerPosition={this.state.markerPosition}
        coordsArray={this.state.coordsArray}
        zoom={this.state.zoom}
        center={this.props.center}
        markers={this.state.markers}
        marker={this.props.marker}
        circle={this.props.circle}
        polygon={this.props.polygon}
        logistic_point={this.props.logistic_point}
        isPolylineShown={false}

        onMarkerClick={this.handleMarkerClick}
        onMapClick={this.handleMapClick}
        onMarkerComplete={this.handlerMarkerComplete}

        onCircleComplete={this.handleCircleComplete}
        onRadiusChanged={this.handleRadiusChanged}
        onCircleCenterChanged={this.handleCircleCenterChanged}

        onPolygonComplete={this.handlePolygonComplete}
        onPolygonDragEnd={this.handlerPolygonDragEnd}
        onPolygonChangeStart={this.handlePolygonChangeStart}
        onPolygonChangeEnd={this.handlePolygonChangeEnd}

        onRectangleComplete={this.onRectangleComplete}
        onPolylineMouseOver={this.onPolylineMouseOver}
        onPolylineClick={this.onPolylineClick}
        onPolylineComplete={this.onPolylineComplete}
        onMarkerDragEnd={this.onMarkerDragEnd}
        bounds={this.state.bounds}
      />
    );
  }
}
const mapStateToProps = function(state) {
  return {
    drawingMode : state.map.drawingMode,
    logistic_point : state.map.logistic_point,
    center : state.map.center,
    marker : state.map.marker,
    circle : state.map.circle,
    polygon : state.map.polygon,
    rectangle : state.map.rectangle,
    polyline : state.map.polyline,
    isReset : state.map.isReset,
    isMarkerShown : state.map.isMarkerShown,
    mode : state.ui.formManage.mode,
    selectedMarker : state.map.selectedMarker,
    formManage : state.ui.formManage,
    drawingOptions : state.map.drawingOptions,
  }
}

const mapActionsToProps =  {
  onChangeDrawingMode : uiDrawingMode,
  onChangeMarker : uiChangeMarker,
  onChangeCircle : uiChangeCircle,
  onChangePolygon : uiChangePolygon,
  onChangeRectangle : uiChangeRectangle,
  onChangePolyline : uiChangePolyline,
  onResetMap : uiResetMap,
  onSelectedMarker : uiSelectedMarker,
  onCenterChanged : uiCenterChanged
};

export default connect(mapStateToProps,mapActionsToProps)(withStyles(styles)(BaseMap))