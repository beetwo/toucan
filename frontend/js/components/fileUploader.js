import React from 'react';

export function ProgressBar({progress}) {
  progress = progress || 50;
  let s = {'width': progress + '%'};
  return (<div className="progress">
    <div className="progress-bar" style={s} />
  </div>)
}

export default function ImageUploader({preview, filename, progress, finished}) {
  return <div className="media">
    <div className="media-left media-middle">
      { preview ?
        <img className="media-object"
             src={preview}
             alt='file preview'
             style={{maxWidth: '5em'}} /> : null }
    </div>
    <div className="media-body">
        <span className='text-muted'>{filename}</span>
        <br />
        <ProgressBar progress={progress || 0} />
    </div>
  </div>;
}
