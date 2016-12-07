/**
 * Created by sean on 07/12/16.
 */
import React from 'react'
import MediaQuery from 'react-responsive'

const mediumDevice = 992;

export function VisibleMedium(props) {
    return <MediaQuery maxWidth={mediumDevice}>
        {props.children}
    </MediaQuery>;
}

export function HiddenMedium(props) {
    return <MediaQuery minWidth={mediumDevice}>
        {props.children}
    </MediaQuery>;
}