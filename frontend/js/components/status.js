import React from 'react'
import classNames from 'classnames'

export default function({status, onOpen, onClose}) {
    let action = (e) => null;
    if (status == 'open') {
      action = onClose
    } else if (status == 'closed') {
        action = onOpen
    }
    let cls = classNames('btn', {
      'btn-danger': status === 'closed',
      'btn-success': status === 'open'
    })
    return <span className={cls} onClick={action}>
      {status}
    </span>;
}
