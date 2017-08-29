import React from "react";
import OrganisationDetails from "./details/organisation";
import { SplitUIView } from "./main";
import Loading from "./loading";
import { DummyMap } from "./map";
import { Link } from "react-router-dom";
import history from "../history";

import { ToucanMap, ToucanMarkerClusterGroup } from "./map";
import { getOrganisationClusterMarker } from "./map/markers";

import { Marker } from "react-leaflet";
import Leaflet from "leaflet";
import { defaultMapBounds } from "../globals";

const OrgIconMarker = Leaflet.divIcon({
  className: "toucan-div-icon-marker marker-organisation",
  iconSize: null
});

const clusterOptions = { iconCreateFunction: getOrganisationClusterMarker };

const OrganisationsListMap = ({ organisations }) => {
  if (!organisations.length) {
    return null;
  }
  let locations = organisations.reduce((locations, org) => {
    let clickHandler = () => history.push(`/orgs/${org.id}/`);
    let org_locations = org.locations.map(org_loc => ({
      name: org_loc.city,
      coordinates: [...org_loc.location.coordinates].reverse(),
      key: `${org.id}-${org_loc.id}`,
      clickHandler
    }));

    return locations.concat(org_locations);
  }, []);

  let bounds = Leaflet.latLngBounds(locations.map(l => l.coordinates));
  return (
    <ToucanMap bounds={bounds.isValid() ? bounds : defaultMapBounds}>
      <ToucanMarkerClusterGroup options={clusterOptions}>
        {locations.map(location =>
          <Marker
            key={location.key}
            position={location.coordinates}
            icon={OrgIconMarker}
            onClick={location.clickHandler}
          />
        )}
      </ToucanMarkerClusterGroup>
    </ToucanMap>
  );
};

export { OrganisationsListMap };

const OrgListItem = ({ org }) => {
  return (
    <Link className="org" to={`/orgs/${org.id}/`}>
      <div className="flex-container flex-vCenter">
        <div className="flex-col col-lg">
          <div className="issue-basics">
            <span className="issue-title">
              {org.name}
            </span>
          </div>
          <div className="org-details">
            <span className="icon icon-pin org-pin" />
            <span className="org-location">
              {org.location || "Athens, Greece"}
            </span>
          </div>
        </div>
        <div className="flex-col">
          <div className="org-logo">
            <img src={org.logo} alt="" />
          </div>
        </div>
      </div>
    </Link>
  );
};

class OrganisationsList extends React.Component {
  render() {
    const { organisations } = this.props;
    const map = <OrganisationsListMap organisations={organisations} />;
    const org_list = (
      <div className="issue-list">
        <div className="issue-list-mapHandle">
          <a href="#" className="mapHandle">
            &nbsp;
          </a>
        </div>
        <div className="issue-list-form">
          <div className="issue-sortandfilter">
            <div className="flex-container">
              <div className="flex-col">
                <a
                  href="#"
                  className="dropdown-toggle"
                  data-toggle="collapse"
                  data-target="#orgFilter"
                >
                  <span className="icon icon-filter" />
                  Filter
                </a>
                <a className="filter-reset" href="#">
                  Reset
                </a>
              </div>
              <div className="flex-col text-right">
                <span className="text-muted">Sort by: </span>
                <a href="#">
                  Nearest <span className="icon icon-chevron" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="org-list-body">
          <div>
            <div className="filter collapse fullscreen-sm" id="orgFilter">
              <div className="fullscreen-header flex-container">
                <div className="flex-col">
                  <a
                    href="#"
                    className="fullscreen-close"
                    data-toggle="collapse"
                    data-target="#orgFilter"
                  >
                    <span className="icon icon-close" /> Filter
                  </a>
                </div>
                <div className="flex-col text-right">
                  <a href="#">Reset</a>
                </div>
              </div>
              <div className="fullscreen-content">Put filter options here</div>
              <div className="fullscreen-footer">
                <button
                  className="btn btn-primary btn-block"
                  data-toggle="collapse"
                  data-target="#orgFilter"
                >
                  Show results
                </button>
              </div>
            </div>
          </div>

          {this.props.organisations.map(org => {
            return <OrgListItem org={org} key={org.id} />;
          })}
        </div>
      </div>
    );
    return <SplitUIView map={map} issue_view={org_list} />;
  }
}

export default OrganisationsList;
