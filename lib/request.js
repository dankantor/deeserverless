class Request {

  /**
   * @constructs
   * @description Create a new Request object. This is called automatically when
   *  a new App is instatiated. You do not need to call this directly.
   * @param {object} event - AWS Event
   */
  constructor(event) {
    this.event = event;
  }

  /**
   * @type {string}
   * @readonly
   * @description get the type of AWS event
   * @example 'aws:apigateway', 'aws:s3'
   */
  get type() {
    if (this.event.Records) {
      if (this.event.Records.length > 0) {
        if (this.#firstRecord.eventSource) {
          return this.#firstRecord.eventSource;
        }
      }
    } else if (this.event.userPoolId) {
      return 'aws:cognito';
    } else if (this.event.source === 'aws.events') {
      return 'aws:cloudwatch:events';
    }
    return 'aws:apigateway';
  }

  /**
   * @type {object}
   * @private
   * @readonly
   * @description get the first record from a list of records inside an AWS event
   */
  get #firstRecord() {
    return this.event.Records[0];
  }

  /**
   * @type {string}
   * @private
   * @readonly
   * @description AWS API Gateway event routeKey. Adds /index if routeKey is /
   */
  get #routeKey() {
    if (this.event.routeKey === `${this.method} /`) {
      return `${this.method} /index`;
    }
    return this.event.routeKey;
  }

  /**
   * @type {string}
   * @private
   * @description Converts an AWS API Gateway routeKey to a file
   */
   #routeKeyToFile() {
     if (this.#routeKey === "$default") {
       return this.#routeKey;
     }
     return `apigateway/${this.apiGatewayRouteKey}`;
   }

   /**
    * @type {string}
    * @readonly
    * @description get the route passed in from API Gateway with pathParameters as _.
    * @example "index" or "login" or "/user_userid"
    */
   get apiGatewayRouteKey() {
     let splits = this.#routeKey.split(' ');
     let parts = splits[1].split('/');
     parts.splice(0, 1);
     let newParts = [];
     parts.forEach((part, index) => {
       part = part.replace(/</g, '{');
       part = part.replace(/>/g, '}');
       if (part.length > 2 && part[0] === '{' && part[part.length - 1] === '}') {
         newParts.push(part.substring(1, part.length - 1));
       } else {
         newParts.push(part);
       }
     });
     let joinedParts = newParts.join('_');
     return joinedParts.substr(0, joinedParts.lastIndexOf('.')) || joinedParts;
   }

   /**
    * @type {string}
    * @readonly
    * @description get the route passed in from API Gateway without any substitutions.
    * @example "/user/{userid}"
    */
   get apiGatewayRouteKeyNoMethod() {
     let splits = this.#routeKey.split(' ');
     return splits[1];
   }

  /**
   * @type {string}
   * @private
   * @description Converts an AWS Cloudwatch scheduled event to a file
   */
  get #eventKey() {
    return this.event.cronFileName;
  }

  /**
   * @type {string}
   * @private
   * @description Extracts the table name from source ARN for DynamoDB events
   */
  get #eventSourceTable() {
    const regexp = /:table\/([-\w]+)\/stream\//;
    const match = this.#firstRecord?.eventSourceARN?.match(regexp);
    return match ? match[1] : '';
  }

  /**
   * @type {string}
   * @readonly
   * @description Turns types into file routes prepending the AWS type to the
   *  requested file.
   * @example "apigateway/index"
   */
  get file() {
    let file;
    switch (this.type) {
      case 'aws:ses':
        file = 'ses/incoming';
      break;
      case 'aws:s3':
        file = `s3/${this.#firstRecord.s3.bucket.name}`;
      break;
      case 'aws:cognito':
        file = `cognito/${this.event.triggerSource}`;
      break;
      case 'aws:cloudwatch:events':
        file = `crons/${this.#eventKey}`;
      break;
      case 'aws:dynamodb':
        file = `streams/${this.#eventSourceTable}`;
      break;
      default:
        file = this.#routeKeyToFile(this.#routeKey);
      break;
    }
    file = file.toLowerCase();
    return file;
  }

  /**
   * @type {string}
   * @private
   * @description get last part of file
   */
  get #lastFilePart() {
    let splits = this.file.split('_');
    let lastSplit = splits[splits.length - 1];
    lastSplit = lastSplit.replace(/apigateway\//, '');
    return lastSplit;
  }

  /**
   * @type {string}
   * @readonly
   * @description If a route ends in .extension this will return 'extension'
   * @returns {string} extension
   * @example "example.com/id/1.json" -> "json"
   */
  get fileExtension() {
    if (this.event.rawPath.includes('.')) {
      let splits = this.event.rawPath.split('.');
      let fileExtension = splits[splits.length - 1];
      if (this.acceptableFileExtensions.includes(fileExtension)) {
        return fileExtension;
      }
    }
    return undefined;
  }

  /**
   * @type {string}
   * @readonly
   * @description Only these extensions are considered for a fileExtension
   * @returns {string} extension
   * @example "example.com/id/1.json" -> "json"
   */
  get acceptableFileExtensions() {
    return [
      "js", "json", "html", "xml", "rss",
      "jpg", "jpeg", "png", "gif", "webp", "svg", "ico", "bmp", "tiff",  // Images
      "css",  // Stylesheets
      "woff", "woff2", "ttf", "otf", "eot",  // Fonts
      "mp3", "wav", "ogg", "aac", "flac",  // Audio
      "mp4", "webm", "ogg", "mov", "avi",  // Video
      "pdf", "csv", "txt", "md", "doc", "docx", "xls", "xlsx",  // Documents
      "zip", "tar", "gz", "rar", "7z",  // Archives
      "exe", "apk", "dmg", "app", "deb", "rpm",  // Applications
      "php", "asp", "aspx", "jsp", "cgi", "pl", "py",  // Server-side scripts
      "map", "wasm", "manifest", "appcache", "htaccess",  // Web-specific
      "yaml", "yml", "toml", "ini"  // Configuration files
    ]
  }

  /**
   * @type {string}
   * @readonly
   * @description AWS API Gateway http method
   * @example "GET", "POST"
   */
  get method() {
    return this.event.requestContext.http.method;
  }

  /**
   * @type {string}
   * @readonly
   * @description AWS API Gateway http stage
   * @example "dev", "prod"
   */
  get stage() {
    return this?.event?.requestContext?.stage;
  }

  /**
   * @type {string}
   * @readonly
   * @description AWS API Gateway raw path remove stage
   * @example "/dev/index" -> "/index"
   */
  get rawPathNoStage() {
    return this.event.rawPath.replace(`/${this.stage}`, "");
  }

  /**
   * @type {object}
   * @readonly
   * @description AWS API Gateway http query string parameters
   * @returns {object} key/value pairs representing query string parameters in
   *  AWS API Gateway request
   * @example "example.com?id=1" -> {"id": 1}
   */
  get queryStringParameters() {
    return this.event.queryStringParameters;
  }

  /**
   * @type {object}
   * @readonly
   * @description AWS API Gateway http path parameters
   * @returns {object} key/value pairs representing path parameters in
   *  AWS API Gateway request
   * @example "example.com/id/1" -> {"id": 1}
   */
  get pathParameters() {
    let pathParameters = {};
    for (let param in this.event.pathParameters) {
      let value = this.event.pathParameters[param];
      if (value.includes('.') && param === this.#lastFilePart) {
        let valueSplits = value.split('.');
        if (this.acceptableFileExtensions.includes(valueSplits[1])) {
          value = value.split('.')[0];
        }
      }
      pathParameters[param] = value;
    }
    return pathParameters;
  }

  /**
   * @type {object}
   * @readonly
   * @description AWS API Gateway http cookies
   * @returns {object} key/value pairs representing cookies in
   *  AWS API Gateway request
   * @example "foo=bar" -> {"foo": "bar"}
   */
  get cookies() {
    let cookies = {};
    try {
      this.event.cookies.forEach(cookie => {
        let splits = cookie.split('=');
        cookies[splits[0]] = splits[1];
      });
    } catch (err) {}
    return cookies;
  }

  /**
   * @type {object}
   * @readonly
   * @description AWS API Gateway http headers
   * @returns {object} key/value pairs representing headers in
   *  AWS API Gateway request. Note: all headers are forced to lowercase.
   * @example "Content-Type=application/json" -> {"content-type": "application/json"}
   */
  get headers() {
    let headers = {};
    if (this.event.headers) {
      let keys = Object.keys(this.event.headers);
      keys.forEach(key => {
        headers[key.toLowerCase()] = this.event.headers[key];
      });
    }
    return headers;
  }

  /**
   * @type {boolean}
   * @readonly
   * @description Compares cookie 'csrf' and header 'x-csrf'. If they match
   *  it will return true
   */
  get isValidCsrf() {
    if (this.cookies['csrf'] && this.headers['x-csrf'] &&
      this.cookies['csrf'] === this.headers['x-csrf']) {
      return true;
    }
    return false;
  }

  /**
   * @type {string|object}
   * @readonly
   * @description AWS API Gateway http body. Returns a string with Post body contents. If request was
   *  sent with application/json header, body is automatically JSON parsed and returns an object.
   */
  get body() {
    if (this.event.body && this.event.body !== '') {
      if (this?.headers?.['content-type'] === 'application/json') {
        return JSON.parse(this.event.body);
      }
      return this.event.body;
    }
    return null;
  }

}

export {Request};
