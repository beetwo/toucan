import React from 'react'
import Map from './map'
import NewIssue from './newIssue'
require('../../css/app.css');

class UI extends React.Component {

    render() {
        console.log(this.props);
        return (<div className="app-container">
            <div className="map-container">
              <Map geojson={this.props.geojson}
                   setCoordinates={this.props.setCoordinates}
                   coordinates={this.props.coordinates}
                   selectIssue={this.props.selectIssue}
                   selectedIssue={this.props.selectedIssue}/>
            </div>
            <div className="issues-container">
                { this.props.coordinates=== null ? null: <NewIssue coordinates={this.props.coordinates} removeAction={this.props.clearCoordinates} />}
                {this.props.children}
            </div>
        </div>);
    }
}

export default UI
