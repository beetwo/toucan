import React from 'react'

import IssueList from './issueList'

require('../../css/app.css');

class UI extends React.Component {

    render() {
        console.log(this.props);
        return (<div className="app-container">
            <div className="map-container">
              <h3>Map</h3>
            </div>
            <div className="issues-container">
                <IssueList {...this.props} />
            </div>
        </div>);
    }
}

export default UI
