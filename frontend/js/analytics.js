import React from "react";
import GoogleAnalytics from "react-ga";

class Analytics extends React.Component {
  constructor(props) {
    super(props);

    this.url = null;
    // Initial page load - only fired once
    this.trackPage(this.props.history, this.props.location);
  }

  componentWillReceiveProps(nextProps) {
    this.trackPage(nextProps.history, nextProps.location);
  }

  trackPage(history, location) {
    const next_url = history.createHref(location);
    if (next_url !== this.url) {
      this.url = next_url;
      GoogleAnalytics.set({ page: this.url });
      GoogleAnalytics.pageview(this.url);
    }
  }

  render() {
    return null;
  }
}

const DummyAnalytics = () => null;

const tracking_id = process.env.GA_TRACKING_ID || false;
if (tracking_id) {
  GoogleAnalytics.initialize(tracking_id);
}

const exportedComponent = tracking_id ? Analytics : DummyAnalytics;

export default exportedComponent;
