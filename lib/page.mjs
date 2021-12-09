class Page {
  
  /**
   * @constructs
   * @description Create a new Page object. This will call the Request method as a instance method
   *  (eg GET /index -> [FILE SYSTEM]/apigateway/index get(..)) and set Request -> this.req
   *  and Response -> this.res. If no file is found it will set the Response statusCode to 404 and 
   *  terminate the request.
   * @param {Request} request - The Request object passed to your Class
   * @param {Response} response - The Response object passed to your Class 
   */
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