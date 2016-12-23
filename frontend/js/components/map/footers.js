/**
 * Created by sean on 21/12/16.
 */
import React from 'react'
import Icon from 'react-fa'

import urls from '../../urls'

const getNavLink = function(lat,lng, title='Issue Location') {
    if (navigator && navigator.userAgent && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURI(title)}`
    }
    return `https://maps.google.com/?q=loc:${lat},${lng}`;
}

const MapFooter = function(props) {
    return <footer className="toucan-controls bg-primary">
        {props.children}
    </footer>
}

export class DetailFooter extends React.Component {
    render() {
        return <MapFooter>
            { this.props.linkTo ?
                <a href={getNavLink(this.props.linkTo[1], this.props.linkTo[0])}
                   target="_blank"
                   className="btn btn-primary text-center">
                    <Icon name="map-o" />&nbsp;
                    Navigate
                </a> :
                null
            }
            <div className="btn btn-primary text-center" onClick={this.props.close}>
                <Icon name="times" />&nbsp;
                Close Map
            </div>
        </MapFooter>
    }
}


export class CustomLocationSelectedFooter extends React.Component {
    render() {
        return (
            <MapFooter>
            <div className="btn btn-primary text-center" onClick={this.props.clearCoordinates}>
                <Icon name="times" />&nbsp;
                Clear Selection
            </div>
            <a href={urls.createIssue(this.props.coordinates.lat, this.props.coordinates.lng)}
               className="btn btn-primary text-center">
                <Icon name="plus"/>&nbsp;
                Add Issue
            </a>
            </MapFooter>
        )
    }
}
