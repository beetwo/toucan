import React from 'react'
import Map , {CloseMapButton} from './map'
import NewIssue from './newIssue'
import MediaQuery from 'react-responsive'
import {mediumSize} from './responsive'

require('../../css/app.css');

function WrapMap(props, closeFunc) {
    console.log(closeFunc, CloseMapButton);
    return  <div className="map-container">
                  <Map geojson={props.geojson}
                       bounds={props.bounds}
                       visibleIssueIDs={props.issues.map(i => i.id)}
                       setCoordinates={props.setCoordinates}
                       coordinates={props.coordinates}
                       selectIssue={props.selectIssue}
                       selectedIssue={props.selectedIssue}
                       closeMap={props.closeFunc}
                  >
                  { closeFunc ? <CloseMapButton onClick={closeFunc} /> : null }
              </Map>
    </div>;
}


class UI extends React.Component {

    state = {
        displayMap: false
    }

    toggleMapDisplay = () => {
        this.setState({
            displayMap: !this.state.displayMap
        })
    }

    render() {

        return (<MediaQuery maxWidth={992}>
                {(isMobile) => {
                    // default: display both
                    let displayMap = true,
                        displayIssues = true;

                    // on mobile display one or the other
                    // depending on state
                    if (isMobile) {
                        if (this.state.displayMap) {
                            displayIssues = false;
                        } else {
                            displayMap = false;
                        }
                    }

                    return (<div className="app-container">
                        { displayMap ? WrapMap(this.props, this.toggleMapDisplay) : null }
                        {
                            displayIssues ?
                                <div className="issues-container">
                                    {
                                        this.props.coordinates === null ?
                                            null:
                                            <NewIssue coordinates={this.props.coordinates} removeAction={this.props.clearCoordinates} />
                                    }

                                    {
                                        React.cloneElement(
                                            this.props.children,
                                            {openMap: this.toggleMapDisplay}
                                        )
                                    }
                                </div> :
                                null
                        }
                    </div>)
                }}
        </MediaQuery>);
    }
}

export default UI
