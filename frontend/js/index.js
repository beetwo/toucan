import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Map, TileLayer, LayerGroup, GeoJson, Marker } from 'react-leaflet';
import { GeoJsonCluster } from 'react-leaflet-geojson-cluster';
import geojsonExtent from 'geojson-extent';
import { Router, Route, browserHistory, IndexRoute, Link } from 'react-router'
import { createStore } from 'redux';

var ReactMarkdown = require('react-markdown');

// require the css files
require('../css/app.css');
require('leaflet/dist/leaflet.css');

class IssueMarker extends React.Component {
    constructor (props, context) {
        super(props);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }

    handleMarkerClick () {
        browserHistory.push('/issue/' + this.props.issue.id);
    }

    render () {
        return <Marker position={this.props.position} map={this.props.map} onClick={this.handleMarkerClick} />;
    }
}

class LeafletMap extends React.Component {

    constructor (props) {
        super(props);
        this._map = null;
        this.handleClick = this.handleClick.bind(this);
        this.handleMove = this.handleMove.bind(this);
    }

    getMap() {
        return this._map.getLeafletElement();
    }

    handleClick(e) {
        // console.log(
        //     'clicked',
        //     e,
        //     arguments
        // );
    }

    handleMove() {
        if (this._map) {
            // console.log(this, this.getMap());
            // console.log(this.getMap().getBounds());
        }
    }

    componentWillReceiveProps(np) {
        console.log('Next props', np);
    }
    render() {

        const geojson = this.props.locations;

        if (geojson === null) {
            return <div>loading..</div>;
        }

        let locations = geojson.features.map((p) => {
            return {
                coordinates: p.geometry.coordinates,
                id: p.id,
                ...p.properties
            };
        });

        let markers = locations.map(l => {
            return <IssueMarker key={l.id}
                                position={l.coordinates.slice(0,2).reverse()}
                                issue={l}/>
        });

        let extents = geojsonExtent(JSON.parse(JSON.stringify(geojson)));
        extents = [
            extents.slice(0,2).reverse(),
            extents.slice(2,4).reverse()
        ];

        return (
            <Map bounds={extents}
                 onClick={this.handleClick}
                 onMoveEnd={this.handleMove}
                 ref={(m) => this._map = m}>
                <TileLayer
                    url='//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {markers}
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



class Comment extends React.Component {
  render(){
    let c = this.props.comment;
    return (<li className='media'>
      <div className="media-body">
        <h4 className="media-heading">{c.created_by.username}</h4>
        <p>{c.comment}</p>
      </div>
    </li>);
  }
}

class CommentList extends React.Component {
  render() {
    let comments = this.props.comments;
    if (comments.length > 0) {
      let cn = comments.map((c) => <Comment key={c.id} comment={c} />);
      return (
        <div>
          <h3>Comments</h3>
          <ul className='media-list'>{cn}</ul>
        </div>
      );
    }
    return <h3>No comments</h3>;
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

    componentWillReceiveProps(np) {
        this.loadIssue();
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
    }

    render() {
        if (this.state.loading) {
            return <div>Issue</div>;
        } else {
            let issue=this.state.issue,
                comments=issue.comments || [];

            return (<div>
              <div className="panel panel-default">
                  <div className="panel-heading">
                      <h3 className="panel-title">
                        {issue.title}
                      </h3>
                  </div>
                  <div className="panel-body">
                    <ReactMarkdown source={issue.description} />
                  </div>
              </div>
              <hr />
              <CommentList comments={comments} />
              <div>
                  <a href={issue.detail_url} target='_blank' className='btn btn-primary'>
                    Details
                  </a>
              </div>
            </div>);
        }
    }
}

class UI extends React.Component {

    render() {
        return <div className="app-container">
            <div className="map-container">
                <LeafletMap locations={this.props.locations} />
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

        // simplify the issue data
        let issues = geojson.features.map(function(f){
            return {
                id: f.id,
                ...f.properties
            }
        });

        return <UI locations={geojson} issues={issues} {...this.props} />;

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
