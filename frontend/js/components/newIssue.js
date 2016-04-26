import React from 'react'
import Icon from 'react-fa'

export default function(props) {
  let url = '/issues/create/?' + 'lat=' + encodeURIComponent(props.coordinates.lat) + '&lng=' + encodeURIComponent(props.coordinates.lng)
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
