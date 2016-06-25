import React from 'react'
import Icon from 'react-fa'
import urls from '../urls'

export default function(props) {
  let url = urls.createIssue(props.coordinates.lat, props.coordinates.lng);
  return <div className='panel panel-success'>
    <div className='panel-body'>
      <a className='btn btn-xs btn-success' href={url}>
        <Icon name='plus' /> New Issue
      </a>
      <small className='pull-right'>
        <a href='#' onClick={props.removeAction}>
          No thanks
        </a>
      </small>
    </div>
  </div>
}
