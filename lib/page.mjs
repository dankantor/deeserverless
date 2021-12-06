import {Html} from './html.mjs';

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
      }
      this.res.done();
    }
  }
  
  get html() {
    if (!this._html) {
      this._html = new Html();
    }
    return this._html;
  }
  
  get useCsrf() {
    return this._useCsrf;
  }
  
  set useCsrf(bool) {
    if (bool === true) {
      let csrf = Math.random().toString(36).slice(2);
      this.res.csrf = csrf;
      this.html.csrf = csrf;
    }
    this._useCsrf = bool;
  }
  
}

export {Page};