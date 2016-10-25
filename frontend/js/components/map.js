import React, { PropTypes} from 'react';
import isEmpty from 'lodash/isEmpty'
import {dispatch} from 'redux'
import  Leaflet  from 'leaflet';
import { Map, TileLayer, LayerGroup, GeoJson, Marker, Popup } from 'react-leaflet';
import geojsonExtent from 'geojson-extent';
import { setCoordinates } from '../actions'
import getMarkerForIssue from './markers/markers';
import LocationControl from './locationControl';
import { defaultMapBounds } from '../globals';
import urls from '../urls';
import {history} from '../index'
require('leaflet/dist/leaflet.css');

class IssueMarker extends React.Component {

    render () {
      let issue = this.props.issue
      let props = {
        position: this.props.position,
        layerContainer: this.props.layerContainer,
        onClick: () => this.props.handleMarkerClick(),
        zIndexOffset: this.props.zIndexOffset || 0
      };
      let opts = {};
      if (this.props.isActive){
        opts.markerColor = 'orange'
      }
      let icon = getMarkerForIssue(issue, opts);
      if (icon != undefined) {
            props.icon = icon;
      }
      return <Marker {...props} />;
    }
}

IssueMarker.propTypes = {
  issue: PropTypes.object.isRequired,
  handleMarkerClick: PropTypes.func.isRequired,
  //layerContainer: PropTypes.object.isRequired,
  position: PropTypes.array.isRequired,
  isActive: PropTypes.bool.isRequired,
  zIndexOffset: PropTypes.number

}

class AddNewMarker extends React.Component {
  constructor (props) {
    super(props)
    this.handleMarkerPosition = this.handleMarkerPosition.bind(this);
  }

  handleMarkerPosition(e) {
    this.props.handleLatLng(e.target.getLatLng());
  }

  handleOnClick(e) {
    const latLng = e.target.getLatLng();
    document.location = urls.createIssue(latLng.lat, latLng.lng);
  }

  render () {
    const {layerContainer, map, position} = this.props;
    let i = getMarkerForIssue({}, {markerColor: 'green', icon: 'fa-plus'});
    return <Marker layerContainer={layerContainer}
                   map={map}
                   position={position}
                   icon={i}
                   onClick={this.handleOnClick}
                   draggable={true}
                   clickable={true}
                   title="Left-click to create issue"
                   onDragend={this.handleMarkerPosition} />;
  }
}


export class LeafletMap extends React.Component {

    constructor (props) {
        super(props);
        this._map = null;
        this._add_new_marker = null;
        // this will be set to true when user clicks the locate button
        // and reset during the render method
        this._panToUserLocation = false;

        this.state = {
          context: false,
          center: null,
        }

        // bind event handlers
        this.handleClick = this.handleClick.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleAddMarkerPositionChange = this.handleAddMarkerPositionChange.bind(this);
        this.handleLocate = this.handleLocate.bind(this);
        this.handleLocationFound = this.handleLocationFound.bind(this);
    }

    // these functions deal with setting Coordinates
    handleAddMarkerPositionChange (latLng) {
      this.props.setCoordinates(latLng);
    }

    handleRightClick(e) {
      this.props.setCoordinates({...e.latlng});
    }

    getMap() {
        return this._map.getLeafletElement();
    }

    handlePopupClose(e) {}
    handleClick(e) {}
    handleMove(e) {}

    handleLocate() {
      this.getMap().locate();
    }

    handleLocationFound(e) {
      this._panToUserLocation = true;
      this.setState({
        center: e.latlng,
        zoom: this.getMap().getZoom()
      });
    }

    handleMarkerClick (issue) {
      this.setState({
        zoom: this.getMap().getZoom()
      })
      history.push(`/issue/${issue.id}`);
    }

    render() {
        const {geojson, coordinates, visibleIssueIDs} = this.props;
        const has_coordinates = !isEmpty(coordinates);

        if (isEmpty(geojson)) {
          return null;
        }

        let locations = geojson.features.map((p) => {
            return {
                coordinates: p.geometry.coordinates,
                id: p.id,
                ...p.properties
            };
        });
        locations = locations.filter((l) => visibleIssueIDs.indexOf(l.id) != -1);

        let center = this.state.center;
        let markers = locations.map(
          (l) => {
            let props = {
              key: l.id,
              position: l.coordinates.slice(0,2).reverse(),
              handleMarkerClick: this.handleMarkerClick.bind(this, l),
              issue: l,
              isActive: l.id === this.props.selectedIssue
            };
            if (l.id === this.props.selectedIssue) {
              // optionally center the map if there is an active marker
              center = props.position
            }
            return <IssueMarker {...props} />
        })

        if (this._panToUserLocation) {
          this._panToUserLocation = false;
          center = this.state.center;
        }

        let bounds = this.props.bounds || this._computeBounds(geojson);

        return (
            <Map center={center}
                 bounds={bounds}
                 onClick={this.handleClick}
                 onContextmenu={this.handleRightClick}
                 onPopupclose={this.handlePopupClose}
                 onMoveEnd={this.handleMove}
                 onLocationfound={this.handleLocationFound}
                 animate={true}
                 ref={(m) => this._map = m}
                 zoom={this.state.zoom}
                 >
                <TileLayer
                    url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers}
                {has_coordinates ? <AddNewMarker ref={(e) => this._add_new_marker = e }
                                                   position={coordinates}
                                                   handleLatLng={this.handleAddMarkerPositionChange} /> : null }
                <LocationControl locate={this.handleLocate}/>
            </Map>
        );
    }

    _computeBounds(geojson) {
        let extents = geojsonExtent(Object.assign({}, geojson));
        if (extents == null) {
            return defaultMapBounds;
        }
        let point1 = extents.slice(0, 2).reverse()
        let point2 = extents.slice(2, 4).reverse()
        if (point1[0] === point2[0] && point1[1] === point2[1]) {
            // zoom out if point1 and point2 are equal
            const x = 0.01
            return [[point1[0] - x, point1[1] - x], [point2[0] + x, [point2[1] + x]]]
        }
        return [point1, point2]
    }
}

LeafletMap.propTypes = {
  geojson: PropTypes.object.isRequired,
  visibleIssueIDs: PropTypes.array.isRequired,
  coordinates: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  setCoordinates: PropTypes.func,
  selectIssue: PropTypes.func.isRequired,
  selectedIssue: PropTypes.number
}

export default LeafletMap
