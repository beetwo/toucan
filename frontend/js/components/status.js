import React from 'react'
import classNames from 'classnames'

export default function({status}) {
    let cls = classNames('btn', {
      'btn-danger': status === 'closed',
      'btn-success': status === 'open'
    })
    return <span className={cls}>
      {status}
    </span>;
}
