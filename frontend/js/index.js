import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer, GeoJson } from 'react-leaflet';
import { GeoJsonCluster } from 'react-leaflet-geojson-cluster';
import geojsonExtent from 'geojson-extent';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'
import { createStore } from 'redux';

require('../css/app.css');

class LeafletMap extends React.Component {

    render() {

        const geojson = this.props.locations;

        if (geojson === null) {
            return <div>loading..</div>;
        }
        return (
            <Map bounds={this.props.extents}>
                <TileLayer
                    url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJsonCluster data={geojson} />
            </Map>
        );
    }
}


class Issues extends React.Component {

    render() {
        let issues = this.props.issues || [];
        let rows = issues.map(function (issue, index) {
            return (<tr key={issue.id}>
                    <td>
                        <Link to={"issue/" + issue.id}>{issue.title}</Link>
                    </td>
                    <td>{issue.priority}</td>
                    <td>{issue.visibility}</td>
                </tr>);
        });
        return (<table className="table">
            <tbody>
                {rows}
            </tbody>
        </table>);
    }
}
class IssueDetail extends React.Component {

    constructor (props) {
        super(props)
        this.state = {
            loading: true,
            issue: null
        }
    }

    componentDidMount() {
        this.setState({
            loading: true
        });
        this.loadIssue()
    }

    loadIssue() {
        let issue_id = parseInt(this.props.routeParams.IssueID);
        let issue = this.props.issues.find(issue => issue.id === issue_id);
        fetch(issue.issue_url)
            .then(response => response.json())
            .then(json => this.setState({
                loading: false,
                issue: json.properties
            }))
        console.log(issue);
    }

    render() {
        if (this.state.loading) {
            return <div>Issue</div>;
        } else {
            let issue=this.state.issue;
            return <div>
                <h1>{issue.title}</h1>
                <p>{issue.description}</p>
            </div>
        }
    }
}

class UI extends React.Component {

    render() {
        return <div className="app-container">
            <div className="map-container">
                <LeafletMap {...this.props} />
            </div>
            <div className="issues-container">
                {
                    this.props.children && React.cloneElement(
                        this.props.children, {
                            issues: this.props.issues
                    })
                }

            </div>
        </div>
    }
}


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            issues: null,
            extents: null
        };
    }

    componentWillMount() {
        fetch('/api/')
            .then(function(response){ return response.json();})
            .then(function(json){
                this.setState({
                    issues: json
                });
        }.bind(this));
    }

    render() {
        const geojson = this.state.issues;

        if (geojson === null) {
            return <h2>Loading ...</h2>;
        }

        // calculate reasonable extents
        // TODO: file a bug, this seems to delete the ids from the json structure
        let extents = geojsonExtent(JSON.parse(JSON.stringify(geojson)));

        extents = [
            extents.slice(0,2).reverse(),
            extents.slice(2,4).reverse()
        ];

        // simplify the issue data
        let issues = geojson.features.map(function(f){
            return {
                id: f.id,
                ...f.properties
            }
        });

        return <UI locations={geojson} extents={extents} issues={issues} {...this.props} />;

    }
};

render(
    (<Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Issues} />
            <Route path="issue/:IssueID" component={IssueDetail} />
        </Route>
    </Router>),
    document.getElementsByTagName('main')[0]);
