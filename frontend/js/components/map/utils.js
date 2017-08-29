import { latLngBounds, latLng } from "leaflet";

export function serializeBounds(bounds) {
  let ne = bounds.getNorthEast(),
    sw = bounds.getSouthWest();
  return [[ne.lat, ne.lng], [sw.lat, sw.lng]];
}

export function getBoundsFromPoints(points) {
  console.log(points);
  let bounds = latLngBounds(points);
  return serializeBounds(bounds);
}

export function getBoundsFromGeoJSON(gj) {
  let points = gj.features.map(f => {
    let coords = f.geometry.coordinates;
    return [coords[1], coords[0]];
  });
  return getBoundsFromPoints(...points);
}
