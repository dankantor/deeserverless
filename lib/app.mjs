import {Request} from './request.mjs';
import {Response} from './response.mjs';

/** @class App */
class App {
  
  /**
   * @constructs
   * @summary App entry point 
   * @description Creates new Request and Response objects.
   * @param {object} event AWS event
   * @param {object} context AWS context
   * @returns {Promise} Promise object with statusCode, body and headers
   */
  constructor(event, context) {
    let request = new Request(event);
    return new Promise((resolve, reject) => {
      let response = new Response(event, resolve, reject);
      this.#route(request, response);
    });
  }
  
  /**
   * @summary Requests get routed to a file on the filesystem 
   * @description If a route is found the file Class is instantiated with File.default. 
   * And it passed the Request and Response objects.
   * If no file is found the status code is set to 404 and the response is resolved
   * @private
   */
  async #route(req, res) {
    try {
      const File = await import(`${process.cwd()}/${req.file}.mjs`);
      new File.default(req, res);
    } catch (err) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        res.statusCode = 404;
        res.done();
      } else {
        res.done();
      }
    }
  }
  
}

export {App}