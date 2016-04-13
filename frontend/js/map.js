import React from 'react';

import  Leaflet  from 'leaflet';
import { Map, TileLayer, LayerGroup, GeoJson, Marker } from 'react-leaflet';
import geojsonExtent from 'geojson-extent';
import { browserHistory } from 'react-router'

import getMarkerForIssue from './markers/markers';


require('leaflet/dist/leaflet.css');

class IssueMarker extends React.Component {
    constructor (props, context) {
        super(props);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }

    handleMarkerClick () {
        browserHistory.push('/issue/' + this.props.issue.id);
    }

    render () {
        let props = {
          position: this.props.position,
          layerContainer: this.props.map,
          onClick: this.handleMarkerClick
        };
        let icon = getMarkerForIssue(this.props.issue);
        console.log(icon);
        if (icon != undefined) {
          props.icon = icon;
        }

        return <Marker {...props} />;
    }
}

export class LeafletMap extends React.Component {

    constructor (props) {
        super(props);
        this._map = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleMove = this.handleMove.bind(this);
    }

    getMap() {
        return this._map.getLeafletElement();
    }

    handleClick(e) {
        // console.log(
        //     'clicked',
        //     e,
        //     arguments
        // );
    }

    handleMove() {
        if (this._map) {
            // console.log(this, this.getMap());
            // console.log(this.getMap().getBounds());
        }
    }

    render() {
        console.log(this.props);
        const geojson = this.props.locations;
        if (geojson === null) {
            return <div>loading..</div>;
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
                                issue={l}/>
        });

        let extents = geojsonExtent(JSON.parse(JSON.stringify(geojson)));
        extents = [
            extents.slice(0,2).reverse(),
            extents.slice(2,4).reverse()
        ];

        return (
            <Map bounds={extents}
                 onClick={this.handleClick}
                 onMoveEnd={this.handleMove}
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
