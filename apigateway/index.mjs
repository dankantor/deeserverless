import {Page} from './../lib/page.mjs';

class Index extends Page {
  
  constructor(req, res) {
    super(req, res);
  }
  
  get() {
    console.log('res', this.res);
    this.res.statusCode = 200;
    this.res.done(); 
  }
  
  
}

export { Index as default };