import {Request} from './request.js';
import {Response} from './response.js';
import {isFrameworkError} from './error.js';

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
   * If the routed file itself does not exist the status code is set to 404 and the
   * response is resolved. Any other failure — including a route file whose own
   * imports are missing — is logged and resolved as a 500.
   * @private
   */
  async #route(req, res, fileExtension) {
    const file = `${process.cwd()}/${req.file}.${fileExtension}`;
    try {
      const File = await import(file);
      new File.default(req, res);
    } catch (err) {
      // A transitive ERR_MODULE_NOT_FOUND also names the route file after
      // "imported from", so only the quoted missing-module path identifies a
      // missing route file.
      if (err.code === 'ERR_MODULE_NOT_FOUND' &&
        (err.message.includes(`'${file}'`) || err.url?.endsWith(file))) {
        res.statusCode = 404;
        res.done();
      } else {
        console.error(err);
        res.statusCode = isFrameworkError(err) ? err.$metadata?.httpStatusCode || 500 : 500;
        res.done();
      }
    }
  }

}

export {App}
