// Spec fixture for app.js routing: this route file exists but its own import
// does not, so importing it throws ERR_MODULE_NOT_FOUND for a module that is
// not the routed file itself.
import {Missing} from './does-not-exist.js';

class BrokenImport {

  constructor(req, res) {
    res.statusCode = 200;
    res.done();
  }

}

export { BrokenImport as default };
