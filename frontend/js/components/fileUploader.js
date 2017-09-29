import React from 'react';

export function ProgressBar({progress}) {
  progress = progress || 50;
  let s = {'width': progress + '%'};
  return (<div className="progress">
    <div className="progress-bar" style={s} />
  </div>)
}

export default function ImageUploader({preview, filename, progress, finished}) {
  return <div className='image-upload'>
      {
        preview ?
        <img src={preview} alt='file preview' />
        : null
      }
      {
        finished ?
         null
         : <ProgressBar progress={progress || 0} />
      }
      <br />
      <span className='attachement-name'>{filename}</span>
  </div>;
}
