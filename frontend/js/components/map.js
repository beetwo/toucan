import React, { PropTypes} from 'react';
import isEmpty from 'lodash/isEmpty'

import  Leaflet  from 'leaflet';
import { Map, TileLayer, LayerGroup, GeoJson, Marker } from 'react-leaflet';
import geojsonExtent from 'geojson-extent';
import { browserHistory } from 'react-router'

import getMarkerForIssue from './markers/markers';

require('leaflet/dist/leaflet.css');

class IssueMarker extends React.Component {

    render () {
      //console.log('Marker', this.props);

      let issue = this.props.issue
      let props = {
        position: this.props.position,
        layerContainer: this.props.layerContainer,
        onClick: () => this.props.handleMarkerClick(issue)
      };
      let icon = getMarkerForIssue(issue);
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
  position: PropTypes.array.isRequired
}

class LeafletMap extends React.Component {

    constructor (props) {
        super(props);
        this._map = null;
        this.handleMarkerClick = this.handleMarkerClick.bind(this)
    }

    getMap() {
        return this._map.getLeafletElement();
    }

    handleMarkerClick(issue) {
      console.log(issue);
    }

    render() {
        let geojson = this.props.geojson;
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

        let markers = locations.map(l => {
           return <IssueMarker key={l.id}
                               position={l.coordinates.slice(0,2).reverse()}
                               handleMarkerClick={this.handleMarkerClick}
                               issue={l}/>
        });

        let extents = geojsonExtent(JSON.parse(JSON.stringify(geojson)));
        extents = [
            extents.slice(0,2).reverse(),
            extents.slice(2,4).reverse()
        ];

        return (
            <Map bounds={extents}
                 ref={(m) => this._map = m}>
                <TileLayer
                    url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
              {markers}
            </Map>
        );
    }
}

LeafletMap.propTypes = {
  geojson: PropTypes.object.isRequired
}

export default LeafletMap
