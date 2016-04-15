import React from 'react'
import Loading from './loading'

class IssueDetailUI extends React.Component {
  render() {
    let issue = this.props.issue;
    if (issue.isLoading) {
      return Loading();
    }
    return <div className='row'>
      <div className='col-md-12'>
        <pre style={{width:'100%'}}>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
      </div>;
  }
}

export default IssueDetailUI
