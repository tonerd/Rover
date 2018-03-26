class ServerRoutes {
  constructor() {
    this.baseUrl = '/api/';
  }

  get sitters() {
    let base = this.baseUrl + 'sitters';
    return {
      getByPageAndRating: base
    }
  }
}

export default ServerRoutes
