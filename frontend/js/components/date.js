/**
 * Created by sean on 16/12/16.
 */
import React from 'react'

const locale = 'en-GB'

function parseDate(dateStringOrDate) {
    if (typeof dateStringOrDate === 'object') {
        return dateStringOrDate;
    }
    if (typeof dateStringOrDate === 'string') {
        return new Date(Date.parse(dateStringOrDate));
    }
}

export default function DateDisplay({date}) {
    date = parseDate(date);
    if (typeof date !== 'object') {
        return <span></span>;
    }

    return <span>
        <DateOnlyDisplay date={date} />
        &nbsp;
        <TimeOnlyDisplay date={date} />
    </span>;
}



export function TimeOnlyDisplay({date}) {
    date = parseDate(date)
    if (typeof date !== 'object') {
        return null;
    }
    return <span>{date.toLocaleTimeString(locale, {hour12: false, hour:'2-digit', minute:'2-digit'})}</span>

}

export function DateOnlyDisplay({date, opts}) {
    date = parseDate(date)
    if (typeof date !== 'object') {
        return null;
    }
    return <span>{date.toLocaleDateString(locale, opts)}</span>;
}

function getDateTuple(date) {
    return [
        date.getDate(),
        date.getMonth(),
        date.getFullYear()
    ];
}

export function DateOrTimeDisplay({date}) {
    date = parseDate(date)
    let cd = new Date(),
        [cday, cmonth, cyear] = getDateTuple(cd),
        [rday, rmonth, ryear] = getDateTuple(date);
    let isToday = (cday === rday) && (cmonth === rmonth) && (cyear === ryear);

    if (isToday) {
        return <TimeOnlyDisplay date={date} />;
    }

    let opts = {};

    // if it's the same year skip displaying the year
    if (cyear === date.getFullYear()) {
        opts = {
            day: 'numeric',
            month: 'numeric'
        }
    }
    return <DateOnlyDisplay date={date} opts={opts}/>
}
