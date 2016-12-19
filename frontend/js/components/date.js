/**
 * Created by sean on 16/12/16.
 */
import React from 'react'

const locale = 'en-GB'

export default function DateDisplay({date}) {
    if (typeof date === 'string') {
        date = new Date(Date.parse(date));
    }
    if (typeof date !== 'object') {
        return <span></span>;
    }

    return <span>
        <span>{date.toLocaleDateString([])}</span>
        &nbsp;
        <span>{date.toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit'})}</span>
    </span>;
}