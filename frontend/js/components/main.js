import React from 'react'
import Map from './map/index'
import NewIssue from './newIssue'
import MediaQuery from 'react-responsive'
import Icon from 'react-fa'

import {mediumSize} from './responsive'
import urls from '../urls'
import {DetailFooter, CustomLocationSelectedFooter} from './map/footers'

import { ScrollContainer } from 'react-router-scroll';

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
    let selectedIssue = null;
    if (props.selectedIssue) {
        selectedIssue = props.geojson.features.filter((i) => i.id === props.selectedIssue)[0];
    }
    let footer =  closable ? (
        props.coordinates ?
            <CustomLocationSelectedFooter coordinates={props.coordinates}
                                                   clear={props.clearCoordinates}/>
            :
            <DetailFooter close={onClose} linkTo={selectedIssue ? selectedIssue.geometry.coordinates : false}/>

    ) : null;

    return  <div className="map-container">
        {map}
        {footer}
    </div>;
}

const shouldUpdateScroll = function(prevProps, props) {
    console.log('ShouldScroll?', prevProps, props);
    return true
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
        // console.log('Map navigation called...', issue);
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
                                <ScrollContainer scrollKey='issues-container' shouldUpdateScroll={shouldUpdateScroll}>
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
                                    </div>
                                </ScrollContainer>
                                :
                                null
                        }
                    </div>)
                }}
        </MediaQuery>);
    }
}

export default UI
