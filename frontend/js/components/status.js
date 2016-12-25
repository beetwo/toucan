import React from 'react'
import classNames from 'classnames'

export default function({status}) {
    let cls = classNames('label', {
      'label-danger': status === 'resolved',
      'label-success': status === 'open'
    })
    return <span className={cls}>
        {status}
      </span>;
}
