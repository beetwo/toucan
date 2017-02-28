/**
 * Created by sean on 28/02/17.
 */
import React from 'react'

import Form from "react-jsonschema-form";


const schema = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: {type: "string", title: "Title", default: "A new task"},
    done: {type: "boolean", title: "Done?", default: false}
  }
};


const log = (type) => console.log.bind(console, type);

const CreateIssue = (props) => {
      return <div className="issue-form-container">
          <Form schema={schema}
                onChange={log("changed")}
                onSubmit={log("submitted")}
                onError={log("errors")} />
      </div>;
}

export default CreateIssue