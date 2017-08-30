import L from "leaflet";

const filterOrganisationsByBoundary = (organisations, boundaries) => {
  const bounds = L.latLngBounds(
    L.latLng(boundaries[0]),
    L.latLng(boundaries[1])
  );
  let filteredOrgs = organisations.filter(o => {
    let points = o.locations.map(l => [...l.location.coordinates].reverse());
    return points.some(p => {
      let latLng = L.latLng(p);
      return bounds.contains(latLng);
    });
  });
  return filteredOrgs;
};

export { filterOrganisationsByBoundary };
