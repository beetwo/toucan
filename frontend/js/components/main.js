import React from 'react'
import Map from './map'

require('../../css/app.css');

class UI extends React.Component {

    render() {
        return (<div className="app-container">
            <div className="map-container">
              <Map geojson={this.props.geojson}/>
            </div>
            <div className="issues-container">
                {this.props.children}
            </div>
        </div>);
    }
}

export default UI
