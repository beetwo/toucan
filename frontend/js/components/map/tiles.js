import React from "react";
import { TileLayer } from "react-leaflet";

const OSMTileLayer = () => {
  return (
    <TileLayer
      url="//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="© <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
    />
  );
};

const MapBoxTileLayer = ({ apiKey }) => {
  return (
    <TileLayer
      attribution={[
        '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
        '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        '<strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
      ].join(" ")}
      url={`https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=${apiKey}`}
    />
  );
};

const ToucanTileLayer = () => {
  return process.env.MAPBOX_API_KEY
    ? <MapBoxTileLayer apiKey={process.env.MAPBOX_API_KEY} />
    : <OSMTileLayer />;
};

export default ToucanTileLayer;
