/**
 * Created by sean on 22/12/16.
 */
import React from 'react'
import DetailTable from './table'
import UserLink from '../userLink'

class OrganisationDetails extends React.Component {
    render() {
        let {
            name,
            short_name,
            logo,
            members,
            description,
            homepage
        } = this.props;

        let items = [
            // ['Name', name],
            ['Mention Handle', '@' + short_name],
            ['Homepage', homepage]

        ]
        return <div>
            <h1>
                <em>{name}</em>
            </h1>
            <hr />
            <p className="text-center">
                <img src={logo} style={{maxHeight:'200px', marginLeft:'auto', marginRight: 'auto'}} className="img-responsive"/>
            </p>
            <p style={{whiteSpace: 'pre'}} className="lead">{description}</p>

            <DetailTable items={items} />
            <hr />
            <h2>Members</h2>
            <ul>
            {
                members.map(m => <li key={m.id}><UserLink username={m.username} /></li>)
            }
            </ul>
            {/*<pre>{JSON.stringify(this.props, null, 2)}</pre>*/}
        </div>
    }
}

export default OrganisationDetails;