import {Page} from './../lib/page.mjs';

class Index extends Page {
  
  constructor(req, res) {
    super(req, res);
  }
  
  // set response status code to 200 and terminate connection
  get() {
    this.res.statusCode = 200;
    this.res.json = {"status": "ok"};
    this.res.done(); 
  }
  
  post() {
    this.res.statusCode = 200;
    this.res.done();
  }
  
  
}

export { Index as default };