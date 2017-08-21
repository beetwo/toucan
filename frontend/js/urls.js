const urls = {
  createIssue(lat, lng) {
    return (
      "/toucan/issues/create/?" +
      "lat=" +
      encodeURIComponent(lat || "") +
      "&lng=" +
      encodeURIComponent(lng || "")
    );
  }
};

export default urls;
