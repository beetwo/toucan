import React from "react";
import { SplitUIView } from "./main";
import { DummyMap } from "./map";

const OrganisationDetail = props => {
  const content = (
    // this should contain the organisation details
    <pre>
      {JSON.stringify(props, null, 2)}
    </pre>
  );
  return <SplitUIView map={<DummyMap />} issue_view={content} />;
};

export default OrganisationDetail;
