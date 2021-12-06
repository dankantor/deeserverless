import {Page} from './../lib/page.mjs';

class Index extends Page {
  
  constructor(req, res) {
    super(req, res);
  }
  
  get() {
    this.res.statusCode = 200;
    this.res.done(); 
  }
  
  
}

export { Index as default };