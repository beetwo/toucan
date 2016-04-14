import React from 'react'

class IssueDetailUI extends React.Component {
  render() {
    return <div className='row'>
      <div className='col-md-12'>
        <pre style={{width:'100%'}}>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
      </div>;
  }
}

export default IssueDetailUI
