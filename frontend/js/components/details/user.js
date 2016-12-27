/**
 * Created by sean on 22/12/16.
 */
import React from 'react'
import UserLink from '../userLink'
import DetailTable from './table'

class UserDetails extends React.Component {
    render() {
        console.log(this.props);
        let {
            username,
            first_name,
            last_name,
            membership,
            html_url
        } = this.props;
        let org = membership.org;

        let items = [
            ['Username', username],
            ['Full name', first_name || last_name ? `${first_name} ${last_name}` : <span className="text-muted">Not given</span>],
            ['Organisation', <UserLink username={org.short_name}>{org.name}</UserLink>]
        ];
        return <div>
            <h1>Profile for user {username}</h1>
            <DetailTable items={items}/>
            <UserLink linkTo={html_url} className="btn btn-default pull-right">
                More
            </UserLink>
        </div>;
    }
}

export default UserDetails;