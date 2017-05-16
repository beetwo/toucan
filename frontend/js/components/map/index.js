import React, { PropTypes} from 'react';
import ReactDOM from 'react-dom'
import isEmpty from 'lodash/isEmpty'
import {dispatch} from 'redux'
import  Leaflet  from 'leaflet';
import { Map, MapControl, TileLayer, LayerGroup, GeoJson, Marker, Popup } from 'react-leaflet';
import geojsonExtent from 'geojson-extent';
import getMarkerForIssue from './markers';
import LocationControl from './locationControl';

import { defaultMapBounds } from '../../globals';
import urls from '../../urls';
import {history} from '../../index'
import { setCoordinates } from '../../actions'

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


        if (props.selectedIssue && props.geojson) {
            let issue = this._getIssueById(props.selectedIssue, props.geojson)
            this.state = {
                zoom: 13,
                center: this._getIssueLatLng(issue)
            }
        } else if (props.bounds) {
            this.state = {
                bounds: props.bounds
            }
        }

        // bind event handlers
        this.handleClick = this.handleClick.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleAddMarkerPositionChange = this.handleAddMarkerPositionChange.bind(this);
        this.handleLocate = this.handleLocate.bind(this);
        this.handleLocationFound = this.handleLocationFound.bind(this);
    }

    _getIssueById(issueId, geojson) {
        if (geojson && geojson.features){
            return geojson.features.filter((p)=> p.id === issueId)[0]
        }
    }

    _getIssueLatLng(issue) {
        // maps from geojson to leaflet compatible coordinates
        return issue.geometry.coordinates.slice(0,2).reverse()
    }

    componentWillReceiveProps(nextProps) {
        // console.debug('New props for map', nextProps, this.props);
        let currentIssue = this.props.selectedIssue,
            nextIssue = nextProps.selectedIssue;

        // return if no changes
        if (currentIssue === nextIssue) {
            // console.debug(
            //     'Same issue as before, no map state change.',
            //     currentIssue,
            //     nextIssue,
            //     this.props,
            //     nextProps
            // )
            return;
        }

        if (
            (
                // we are moving from one issue to the next
                currentIssue &&
                nextIssue &&
                currentIssue !== nextIssue
            ) || (
                // or from all issues to selected Issues
                !currentIssue && nextIssue
            )
        ) {
            // => recenter map without zooming
            // console.debug('Re-centering map without zoom', issue, nextIssue);
            let issue = this._getIssueById(nextIssue, nextProps.geojson)
            if (!issue) {return;}
            this.setState({
                zoom: this.getMap().getZoom(),
                center: this._getIssueLatLng(issue),
                bounds: null
            })
        }
        if (currentIssue && !nextIssue) {
            // console.debug('Moving from detail to overview map.')
            // moving from issueDetail to overview
            this.setState({
                zoom: null,
                center: null,
                bounds: this._computeBounds(nextProps.geojson)
            })
        }
    }


    // these functions deal with setting Coordinates
    handleAddMarkerPositionChange (latLng) {
      this.props.setCoordinates(latLng);
    }

    handleRightClick(e) {
      this.props.setCoordinates({...e.latlng});
    }

    getMap() {
        return this._map.leafletElement;
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
        zoom: this.getMap().getZoom(),
        bounds: null
      });
    }

    handleMarkerClick (issue) {
        if (this.props.beforeMarkerNavigation) {
            this.props.beforeMarkerNavigation(issue);
        }
        history.push(`/issue/${issue.id}`);
    }

    render() {
        const {geojson, coordinates, visibleIssueIDs} = this.props;
        const has_coordinates = !isEmpty(coordinates);
        let center = false;

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

        let markers = locations.map(
          (l) => {
            let props = {
              key: l.id,
              position: l.coordinates.slice(0,2).reverse(),
              handleMarkerClick: this.handleMarkerClick.bind(this, l),
              issue: l,
              isActive: l.id === this.props.selectedIssue
            };

            return <IssueMarker {...props} zIndexOffset={props.isActive ? 1000 :0}/>
        })

        if (this._panToUserLocation) {
          this._panToUserLocation = false;
          center = this.state.center;
        }

        let bounds = this.props.bounds || this._computeBounds(geojson);

        let mapSettings = {
            bounds: this.state.bounds,
            center: center || this.state.center,
            zoom: this.state.zoom
        };
        
        return (
            <Map {...mapSettings}
                 onClick={this.handleClick}
                 onContextmenu={this.handleRightClick}
                 onPopupclose={this.handlePopupClose}
                 onMoveEnd={this.handleMove}
                 onLocationfound={this.handleLocationFound}
                 animate={true}
                 ref={(m) => this._map = m}
                 >
                <TileLayer
                    url={TILE_SRC}
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers}
                {has_coordinates ? <AddNewMarker ref={(e) => this._add_new_marker = e }
                                                   position={coordinates}
                                                   handleLatLng={this.handleAddMarkerPositionChange} /> : null }
                <LocationControl locate={this.handleLocate}/>
                {this.props.children}
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
    beforeMarkerNavigation: PropTypes.func,
    coordinates: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]),
    setCoordinates: PropTypes.func,
    selectIssue: PropTypes.func.isRequired,
    selectedIssue: PropTypes.number
}

export default LeafletMap
