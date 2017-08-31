import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";
import isEmpty from "lodash/isEmpty";
import { dispatch } from "redux";
import Leaflet from "leaflet";
import {
  Map,
  MapControl,
  TileLayer,
  LayerGroup,
  GeoJson,
  Marker,
  Popup
} from "react-leaflet";
import getMarkerForIssue from "./markers";
import LocationControl from "./locationControl";
import MarkerClusterGroup from "react-leaflet-markercluster";

import { defaultMapBounds } from "../../globals";
import ToucanTileLayer from "./tiles";
import urls from "../../urls";
import { history } from "../../index";
import { setCoordinates } from "../../actions";
import { serializeBounds } from "./utils";

require("leaflet/dist/leaflet.css");

class IssueMarker extends React.Component {
  render() {
    let issue = this.props.issue;
    let props = {
      position: this.props.position,
      layerContainer: this.props.layerContainer,
      onClick: () => this.props.handleMarkerClick(issue),
      zIndexOffset: this.props.zIndexOffset || 0
    };
    let opts = {};
    if (this.props.isActive) {
      opts.markerColor = "orange";
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
};

class AddNewMarker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMarkerPosition = this.handleMarkerPosition.bind(this);
  }

  handleMarkerPosition(e) {
    this.props.handleLatLng(e.target.getLatLng());
  }

  handleOnClick(e) {
    const latLng = e.target.getLatLng();
    document.location = urls.createIssue(latLng.lat, latLng.lng);
  }

  render() {
    const { layerContainer, map, position } = this.props;
    let i = getMarkerForIssue({}, { markerColor: "green", icon: "fa-plus" });
    return (
      <Marker
        layerContainer={layerContainer}
        map={map}
        position={position}
        icon={i}
        onClick={this.handleOnClick}
        draggable={true}
        clickable={true}
        title="Left-click to create issue"
        onDragend={this.handleMarkerPosition}
      />
    );
  }
}

const AttributionImage = () => {
  return process.env.MAPBOX_API_KEY ? (
    <span className="mapbox-wordmark" />
  ) : null;
};

export class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this._map = null;
    this._add_new_marker = null;
    // this will be set to true when user clicks the locate button
    // and reset during the render method
    this._panToUserLocation = false;

    this.state = {
      bounds: props.initial_bounds,
      // this flag is set as soon as the user zooms in/out
      user_modified_zoom: false
    };

    if (props.selectedIssue && props.geojson) {
      let issue = this._getIssueById(props.selectedIssue, props.geojson);
      this.state = {
        ...this.state,
        zoom: 13,
        center: this._getIssueLatLng(issue)
      };
    }
    // bind event handlers
    this.handleClick = this.handleClick.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.handleAddMarkerPositionChange = this.handleAddMarkerPositionChange.bind(
      this
    );
    this.handleLocate = this.handleLocate.bind(this);
    this.handleLocationFound = this.handleLocationFound.bind(this);
    this.setUserModifiedFlag = this.setUserModifiedFlag.bind(this);
  }

  setUserModifiedFlag() {
    return this.setState(state => ({ user_modified_zoom: true }));
  }

  _getIssueById(issueId, geojson) {
    if (geojson && geojson.features) {
      return geojson.features.filter(p => p.id === issueId)[0];
    }
  }

  _getIssueLatLng(issue) {
    // maps from geojson to leaflet compatible coordinates
    return issue.geometry.coordinates.slice(0, 2).reverse();
  }

  componentWillReceiveProps(nextProps) {
    // console.debug('New props for map', nextProps, this.props);
    let currentIssue = this.props.selectedIssue,
      nextIssue = nextProps.selectedIssue;

    // return if no changes
    if (currentIssue === nextIssue) {
      return;
    }

    if (
      // we are moving from one issue to the next
      (currentIssue && nextIssue && currentIssue !== nextIssue) ||
      // or from all issues to selected Issues
      (!currentIssue && nextIssue)
    ) {
      // => recenter map without zooming
      // console.debug('Re-centering map without zoom', issue, nextIssue);
      let issue = this._getIssueById(nextIssue, nextProps.geojson);
      if (!issue) {
        return;
      }
      this.setState({
        zoom: this.getMap().getZoom(),
        center: this._getIssueLatLng(issue),
        bounds: null
      });
    }
    if (currentIssue && !nextIssue) {
      // console.debug('Moving from detail to overview map.')
      // moving from issueDetail to overview
      this.setState({
        zoom: null,
        center: null,
        bounds: this._computeBounds(nextProps.geojson)
      });
    }
  }

  // these functions deal with setting Coordinates
  handleAddMarkerPositionChange(latLng) {
    this.props.setCoordinates(latLng);
  }

  handleRightClick(e) {
    this.props.setCoordinates({ ...e.latlng });
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

  handleMarkerClick(issue) {
    if (this.props.beforeMarkerNavigation) {
      this.props.beforeMarkerNavigation(issue);
    }
    this.props.selectIssue(issue);
  }

  render() {
    const { geojson, coordinates, visibleIssueIDs } = this.props;
    const has_coordinates = !isEmpty(coordinates);
    let center = false;

    if (isEmpty(geojson)) {
      return null;
    }

    let locations = geojson.features.map(p => {
      return {
        coordinates: p.geometry.coordinates,
        id: p.id,
        ...p.properties
      };
    });
    locations = locations.filter(l => visibleIssueIDs.indexOf(l.id) != -1);

    let markers = locations.map(l => {
      let props = {
        key: l.id,
        position: l.coordinates.slice(0, 2).reverse(),
        handleMarkerClick: this.handleMarkerClick.bind(this, l),
        issue: l,
        isActive: l.id === this.props.selectedIssue
      };

      return (
        <IssueMarker {...props} zIndexOffset={props.isActive ? 1000 : 0} />
      );
    });

    if (this._panToUserLocation) {
      this._panToUserLocation = false;
      center = this.state.center;
    }

    let mapSettings = {
      bounds: this.state.bounds,
      center: center || this.state.center,
      zoom: this.state.zoom
    };

    return (
      <Map
        {...mapSettings}
        onClick={this.handleClick}
        onContextmenu={this.handleRightClick}
        onPopupclose={this.handlePopupClose}
        onMoveEnd={this.handleMove}
        onLocationfound={this.handleLocationFound}
        onZoomstart={this.setUserModifiedFlag}
        animate={true}
        useFlyTo={true}
        ref={m => (this._map = m)}
      >
        <ToucanTileLayer />
        {markers}
        {has_coordinates ? (
          <AddNewMarker
            ref={e => (this._add_new_marker = e)}
            position={coordinates}
            handleLatLng={this.handleAddMarkerPositionChange}
          />
        ) : null}
        <LocationControl locate={this.handleLocate} />
        {this.props.children}
        <AttributionImage />
      </Map>
    );
  }

  _computeBounds(geojson) {
    if (geojson && geojson.features && geojson.features.length === 0) {
      return defaultMapBounds;
    }
    let extents = geojsonExtent(Object.assign({}, geojson));
    if (extents == null) {
      return defaultMapBounds;
    }
    let point1 = extents.slice(0, 2).reverse();
    let point2 = extents.slice(2, 4).reverse();
    if (point1[0] === point2[0] && point1[1] === point2[1]) {
      // zoom out if point1 and point2 are equal
      const x = 0.01;
      return [[point1[0] - x, point1[1] - x], [point2[0] + x, [point2[1] + x]]];
    }
    return [point1, point2];
  }
}

LeafletMap.propTypes = {
  geojson: PropTypes.object.isRequired,
  visibleIssueIDs: PropTypes.array.isRequired,
  beforeMarkerNavigation: PropTypes.func,
  coordinates: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  setCoordinates: PropTypes.func,
  selectIssue: PropTypes.func.isRequired,
  selectedIssue: PropTypes.number,
  initial_bounds: PropTypes.array.isRequired
};

export default LeafletMap;

class ToucanMap extends React.Component {
  constructor(props) {
    super(props);
    this.onViewportChanged = this.onViewportChanged.bind(this);
    this.saveMapRef = this.saveMapRef.bind(this);
    this._map = null;
  }

  saveMapRef(elem) {
    if (elem && elem.leafletElement) {
      this._map = elem.leafletElement;
    }
  }

  onViewportChanged(viewport) {
    if (this._map) {
      let bounds = this._map.getBounds();
      this.props.onViewportChanged &&
        this.props.onViewportChanged(viewport, bounds);

      this.props.onBoundsChanged &&
        this.props.onBoundsChanged(serializeBounds(bounds));
    }
  }

  render() {
    let { children, onViewportChanged, ...props } = this.props;
    console.warn("Rendering map with props: ", props);
    return (
      <Map
        {...props}
        onViewportChanged={this.onViewportChanged}
        ref={this.saveMapRef}
      >
        <ToucanTileLayer />
        {children}
      </Map>
    );
  }
}

export { ToucanMap };

const markerClusterOptions = {
  showCoverageOnHover: false,
  spiderifyOnMaxZoom: false,
  spiderLegPolylineOptions: {
    weight: 0
    // opacity: 0
  }
};
const markerClusterWrapperOptions = {
  enableDefaultStyle: false
};

class ToucanMarkerClusterGroup extends React.Component {
  constructor(props) {
    super(props);
    this.setMarkerClusterGroup = this.setMarkerClusterGroup.bind(this);
    this.mcg = null;
  }

  setMarkerClusterGroup(e) {
    if (e && e.leafletElement) {
      this.mcg = e.leafletElement;
    }
  }

  componentDidUpdate() {
    console.log("MCG updated");
  }

  render() {
    let { children, options = {}, wrapperOptions = {}, ...props } = this.props;

    // merge the options if passed
    options = {
      ...markerClusterOptions,
      ...options
    };

    wrapperOptions = {
      ...markerClusterWrapperOptions,
      ...wrapperOptions
    };

    return (
      <MarkerClusterGroup
        ref={this.setMarkerClusterGroup}
        options={options}
        wrapperOptions={wrapperOptions}
        {...props}
      >
        {children}
      </MarkerClusterGroup>
    );
  }
}

export { ToucanMarkerClusterGroup };
