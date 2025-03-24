import {Request} from './request.js';
import {Response} from './response.js';

class App {

  /**
   * @constructs
   * @summary App entry point
   * @description Creates new Request and Response objects.
   * @param {object} event AWS event
   * @param {object} context AWS context
   * @param {string} [fileExtension=js]
   * @returns {Promise} Promise object with statusCode, body and headers
   * @example
   * // Lambda in AWS SAM templte
   * import { App } from 'deeserverless';
   * export const lambdaHandler = async (event, context) => {
   *   return new App(event, context);
   * }
   */
  constructor(event, context, fileExtension = "js") {
    let request = new Request(event);
    return new Promise((resolve, reject) => {
      let response = new Response(resolve, reject);
      this.#route(request, response, fileExtension);
    });
  }

  /**
   * @summary Requests get routed to a file on the filesystem
   * @description If a route is found the file Class is instantiated with File.default.
   * And it passed the Request and Response objects.
   * If no file is found the status code is set to 404 and the response is resolved
   * @private
   */
  async #route(req, res, fileExtension) {
    try {
      const File = await import(`${process.cwd()}/${req.file}.${fileExtension}`);
      new File.default(req, res);
    } catch (err) {
      if (err.code === 'ERR_MODULE_NOT_FOUND') {
        res.statusCode = 404;
        res.done();
      } else {
        console.error(err);
        res.done();
      }
    }
  }

}

export {App}
