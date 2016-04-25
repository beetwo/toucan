import React from 'react'
import Icon from 'react-fa'

var $ = require('jquery')

export default function(props) {
  console.log($);
  return <div className='panel panel-success'>
    <div className='panel-body'>
      <a className='btn btn-xs btn-success' href={'/issues/create/?' + $.param(props.coordinates)}>
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
