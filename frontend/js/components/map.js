import React, { PropTypes} from 'react';
import isEmpty from 'lodash/isEmpty'
import {dispatch} from 'redux'
import  Leaflet  from 'leaflet';
import { Map, TileLayer, LayerGroup, GeoJson, Marker, Popup } from 'react-leaflet';
import geojsonExtent from 'geojson-extent';
import { browserHistory } from 'react-router'
import { setCoordinates } from '../actions'
import getMarkerForIssue from './markers/markers';

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

  render () {
    const {layerContainer, map, position} = this.props;
    let i = getMarkerForIssue({}, {markerColor: 'green', icon: 'fa-plus'});
    return <Marker layerContainer={layerContainer}
                   map={map}
                   position={position}
                   icon={i}
                   onClick={this.props.onClickHandler}
                   draggable={true}
                   onDragend={this.handleMarkerPosition} />;
  }
}

const europeBounds = [[57.64, -10.44], [36.81, 44.98]]
export class LeafletMap extends React.Component {

    constructor (props) {
        super(props);
        this._map = null;
        this._add_new_marker = null;
        this.state = {
          context: false
        }
        // bind event handlers
        this.handleClick = this.handleClick.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleAddMarkerPositionChange = this.handleAddMarkerPositionChange.bind(this);
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

    handleMarkerClick (issue) {
      browserHistory.push(`/issue/${issue.id}`);
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

        // optionally center the map if there is an active marker
        let center = null;

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
              center = props.position
            }
            return <IssueMarker {...props} />
        })

        let bounds = this._computeBounds(geojson)

        return (
            <Map center={center}
                 bounds={bounds}
                 onClick={this.handleClick}
                 onContextmenu={this.handleRightClick}
                 onPopupclose={this.handlePopupClose}
                 onMoveEnd={this.handleMove}
                 animate={true}
                 ref={(m) => this._map = m}>
                <TileLayer
                    url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers}
                {has_coordinates ? <AddNewMarker ref={(e) => this._add_new_marker = e }
                                                   position={coordinates}
                                                   handleLatLng={this.handleAddMarkerPositionChange} /> : null }
            </Map>
        );
    }

    _computeBounds(geojson) {
        let extents = geojsonExtent(Object.assign({}, geojson));
        if (extents == null) {
            return europeBounds
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
