import isString from 'lodash/isString'
import { Entity } from 'draft-js'


export default function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export var csrftoken = getCookie('csrftoken');


export function jsonPost(url, data) {
  return fetch(
    url,
    {
        method: 'post',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: isString(data) ? data : JSON.stringify(data)
      }
    )
}


export function convertDraft(contentState) {
  console.log(contentState)
  let blocks = contentState.getBlockMap().toArray()
  blocks.forEach((b) => {
    console.log('new block');
    b.findEntityRanges(
      (x) => {
        let e = x.getEntity();
        return true
      },
      (start, end) => { console.log(start, end) }
    );
  });
  return contentState.getPlainText();

}
