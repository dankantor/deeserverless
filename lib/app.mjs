import {Request} from './request.mjs';
import {Response} from './response.mjs';

class App {
  
  /**
   * @summary App entry point 
   * @description Creates new Request and Response objects.
   * @returns {App}
   */
  constructor(event, context) {
    let request = new Request(event, context);
    return new Promise((resolve, reject) => {
      let response = new Response(event, context, resolve, reject);
      this.route(request, response);
    });
  }
  
  /**
   * @summary Requests get routed to a file on the filesystem 
   * @description If a route is found the file Class is instantiated. If no
   * file is found the status code is set to 404 and the response is terminated
   */
  async route(req, res) {
    try {
      const File = await import(`${process.cwd()}/${req.file}.mjs`);
      new File.default(req, res);
    } catch (err) {
      console.log(err);
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