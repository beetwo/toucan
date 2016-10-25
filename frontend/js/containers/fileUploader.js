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

    constructor(props) {
      super(props);
      this.state = {
        files: []
      }
      this.onDrop = this.onDrop.bind(this);
    }

    reset() {
      this.setState({
        files: []
      });
    }

    onDrop(acceptedFiles, rejectedFiles) {
        let allFiles = this.state.files.concat(acceptedFiles);
        this.setState({
          files: allFiles
        });
    }

    render() {
        return (
          <div>
            {this.state.files.map((f, index) => <SingleFileUpload key={index} file={f} onAdded={this.props.onAdded} />)}
            {this.state.files.length >= 0 ? <hr /> : null}
            <Dropzone
              className='form-control'
              onDrop={this.onDrop}>
              <Icon name="paperclip"/>&nbsp;
              Drop files here to add as attachments
            </Dropzone>
          </div>);
    }
}
