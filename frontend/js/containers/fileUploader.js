/**
 * Created by sean on 23/10/16.
 */
import React from 'react';
import Icon from 'react-fa'
import Dropzone from 'react-dropzone';
import {csrftoken} from '../utils';

import ImageUploader from '../components/fileUploader';


export class SingleFileUpload extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        started: false,
        finished: false,
        progress: 0
      };
      // bind relevant methods to this
      this.updateProgress = this.updateProgress.bind(this);
      this.transferComplete = this.transferComplete.bind(this);
    }

    updateProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        var percentComplete = progressEvent.loaded / progressEvent.total;
        this.setState({progress: percentComplete});
      }
      // Unable to compute progress information since the total size is unknown
    }

    transferComplete(evt) {
      let data = JSON.parse(this.request.response);
      this.props.onAdded(data.pk);
      this.setState({
        finished: true,
        progress: 100
      });
    }

    componentDidMount() {
      // create a formdata object and attach the file to it
      let formData = new FormData();
      formData.append('image', this.props.file, this.props.file.name);
      let request = new XMLHttpRequest();
      request.open('POST', '/api/media/image/', true);
      request.withCredentials = true;
      request.setRequestHeader('X-CSRFToken', csrftoken);
      // attach event handlers
      request.addEventListener('progress', this.updateProgress);
      request.addEventListener('load', this.transferComplete);
      request.send(formData);
      this.request = request;

      this.setState({started: true});
    }

    render() {
      let file = this.props.file;
      let widgetProps = {
          ...this.state,
          preview: file.preview,
          filename: file.name,
      };
      return <ImageUploader {...widgetProps} />;
    }
}


export class ToucanUploader extends React.Component {

    render() {
        return <div>
            <ul className='list-inline'>
              {this.props.files.map((f, index) => {
                return (<li key={index}>
                  <SingleFileUpload file={f} onAdded={this.props.onAdded} />
                </li>); })}
            </ul>
        </div>;
    }
}

export class UploadField extends React.Component {
    render() {
        return <Dropzone className="dropzoneWrapper" onDrop={this.props.onDrop}>{this.props.children}</Dropzone>;
    }
}

UploadField.propTypes = {
    onDrop: React.PropTypes.func.isRequired
};