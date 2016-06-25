const urls = {
  createIssue(lat, lng) {
    return '/issues/create/?' + 'lat=' + encodeURIComponent(lat) + '&lng=' + encodeURIComponent(lng)
  }
}

export default urls
