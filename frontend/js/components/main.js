import React from 'react'
import Map from './map'
import NewIssue from './newIssue'
import {HiddenMedium} from './responsive'

require('../../css/app.css');

function WrapMap(props) {
    return  <div className="map-container">
                  <Map geojson={props.geojson}
                       bounds={props.bounds}
                       visibleIssueIDs={props.issues.map(i => i.id)}
                       setCoordinates={props.setCoordinates}
                       coordinates={props.coordinates}
                       selectIssue={props.selectIssue}
                       selectedIssue={props.selectedIssue}/>
    </div>;
}

class UI extends React.Component {

    render() {
        return (<div className="app-container">
            <HiddenMedium>
                <WrapMap {...this.props} />
            </HiddenMedium>
            <div className="issues-container">
                { this.props.coordinates=== null ? null: <NewIssue coordinates={this.props.coordinates} removeAction={this.props.clearCoordinates} />}
                {this.props.children}
            </div>
        </div>);
    }
}

export default UI
