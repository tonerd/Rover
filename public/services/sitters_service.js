import Fetch from '../utils/fetch';
import ServerRoutes from '../utils/server_routes';

class SittersService {
  constructor() {
    this.routes = new ServerRoutes();
    this.fetch = new Fetch();
  }

  getSittersByPageAndRating(start, size, minRating) {
    return this.fetch.post(this.routes.sitters.getByPageAndRating, { start, size, minRating });
  }
}

export default SittersService
