//import {Html} from './html.mjs';

class Page {
  
  constructor(req, res) {
    this.req = req;
    this.res = res;
    if (this[this.req.method.toLowerCase()]) {
      this[this.req.method.toLowerCase()]();
    } else {
      this.res.statusCode = 404;
      this.res.body = {
        'status': 'Page not found'
      };
      this.res.done();
    }
  }
  
}

export {Page};