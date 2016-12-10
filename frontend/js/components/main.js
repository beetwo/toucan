import React from 'react'
import Map from './map'
import NewIssue from './newIssue'
import MediaQuery from 'react-responsive'
import Icon from 'react-fa'
import {mediumSize} from './responsive'
import urls from '../urls'

require('../../css/app.css');

function WrapMap(props) {
    let { closable, onClose } = props;
    // construct the map
    let map = <Map geojson={props.geojson}
                   bounds={props.bounds}
                   visibleIssueIDs={props.issues.map(i => i.id)}
                   setCoordinates={props.setCoordinates}
                   coordinates={props.coordinates}
                   selectIssue={props.selectIssue}
                   selectedIssue={props.selectedIssue}
                   beforeMarkerNavigation={props.onMapNavigate}
                />;

    return  <div className="map-container">
        {map}
        {closable ?
            <footer className="toucan-controls bg-primary">
                {
                    !props.coordinates ?
                        <div className="btn btn-primary text-center" onClick={onClose}>
                            <Icon name="times" />&nbsp;
                            Close Map
                        </div> :
                        <div className="btn btn-primary text-center" onClick={props.clearCoordinates}>
                            <Icon name="times" />&nbsp;
                            Clear Selection
                        </div>

                }


                {
                    props.coordinates ?
                        <a href={urls.createIssue(props.coordinates.lat, props.coordinates.lng)}
                           className="btn btn-primary text-center">
                            <Icon name="plus"/>&nbsp;
                            Add Issue
                        </a>
                    : null
                }
        </footer> : null}
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

    onMapNavigate = (issue) => {
        console.log('Map navigation called...', issue);
        // this is called before the user clicks a marker on the map
        this.setState({
            displayMap: false
        })
    }

    render() {

        return (<MediaQuery maxWidth={992}>
                {(isMobile) => {
                    // default: display both
                    let displayMap = true,
                        displayIssues = true;

                    // on mobile display one or the other,
                    // depending on state
                    if (isMobile) {
                        if (this.state.displayMap) {
                            displayIssues = false;
                        } else {
                            displayMap = false;
                        }
                    }

                    return (<div className="app-container">
                        {
                            displayMap ?
                                <WrapMap {...this.props }
                                         closable={!displayIssues}
                                         onClose={this.toggleMapDisplay}
                                         onMapNavigate={this.onMapNavigate}
                                />
                                : null
                        }
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
                                            {
                                                mapOpenable: !displayMap,
                                                openMap: this.toggleMapDisplay
                                            }
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
