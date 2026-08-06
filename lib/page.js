import {isFrameworkError} from './error.js';

class Page {
  
  /**
   * @constructs
   * @description Create a new Page object. This will call the Request method as a instance method
   *  (eg GET /index -> [FILE SYSTEM]/apigateway/index get(..)) and set Request -> this.req
   *  and Response -> this.res. If no file is found it will set the Response statusCode to 404 and
   *  terminate the request. If the method handler throws or rejects, the error is logged and the
   *  response is resolved. Framework errors (eg ValidationError) resolve with their
   *  $metadata.httpStatusCode and message; any other error resolves as a generic 500.
   * @param {Request} request - The Request object passed to your Class
   * @param {Response} response - The Response object passed to your Class
   */
  constructor(req, res) {
    this.req = req;
    this.res = res;
    const method = this.req.method.toLowerCase();
    if (this[method]) {
      Promise.resolve()
        .then(() => this[method]())
        .catch((error) => {
          console.error(error);
          const exposable = isFrameworkError(error);
          this.res.statusCode = exposable ? error.$metadata?.httpStatusCode || 500 : 500;
          this.res.json = {
            'status': exposable ? error.message : 'Internal Server Error'
          };
          this.res.done();
        });
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