/** @class Request */
class Request {
  
  /**
   * @constructs
   * @description Create a new Request object. This is called automatically when
   * a new App is instatiated. You do not need to call this directly. 
   */
  constructor(event) {
    this.event = event;
  }
  
  /**
   * @member
   * @readonly
   * @description get the type of AWS event
   * @returns {string}
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
    }
    return 'aws:apigateway';
  }
  
  /**
   * @private
   * @member
   * @readonly
   * @description get the first record from a list of records inside an AWS event
   * @returns {object}
   */
  get #firstRecord() {
    return this.event.Records[0];
  }
  
  /**
   * @private
   * @member
   * @readonly
   * @description AWS API Gateway event routeKey. Adds /index if routeKey is /
   * @returns {string} Method /route 
   */
  get #routeKey() {
    if (this.event.routeKey === `${this.method} /`) {
      return `${this.method} /index`;
    }
    return this.event.routeKey;
  }
  
  /**
   * @private
   * @member
   * @description Converts an AWS API Gateway routeKey to a file
   * @returns {string}
   */
  #routeKeyToFile(routeKey) {
    let splits = routeKey.split(' ');
    let parts = splits[1].split('/');
    parts.splice(0, 1, 'apigateway');
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
    return newParts.join('/');
  }
  
  /**
   * @member
   * @readonly
   * @description Turns types into file routes prepending the AWS type to the 
   * requested file.
   * @returns {string} 
   */
  get file() {
    let file;
    switch (this.type) {
      case 'aws:ses':
        file = `ses/incoming`;
      break;
      case 'aws:s3':
        file = `s3/${this.#firstRecord.s3.bucket.name}`;
      break;
      case 'aws:cognito':
        file = `cognito/${this.event.triggerSource}`;
      break;
      default:
        file = this.#routeKeyToFile(this.#routeKey);
      break;
    }
    return file;
  }
  
  /**
   * @member
   * @readonly
   * @description AWS API Gateway http method
   * @returns {string} 
   */
  get method() {
    return this.event.requestContext.http.method;
  }
  
  /**
   * @member
   * @readonly
   * @description AWS API Gateway http query string parameters
   * @returns {object} key/value pairs representing query string parameters in
   * AWS API Gateway request
   */
  get queryStringParameters() {
    return this.event.queryStringParameters;
  }
  
  /**
   * @member
   * @readonly
   * @description AWS API Gateway http path parameters
   * @returns {object} key/value pairs representing path parameters in
   * AWS API Gateway request
   */
  get pathParameters() {
    return this.event.pathParameters;
  }
  
  /**
   * @member
   * @readonly
   * @description AWS API Gateway http cookies
   * @returns {object} key/value pairs representing cookies in
   * AWS API Gateway request
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
   * @member
   * @readonly
   * @description AWS API Gateway http headers
   * @returns {object} key/value pairs representing headers in
   * AWS API Gateway request. Note: all headers are forced to lowercase.
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
  
  get isValidCsrf() {
    if (this.cookies['csrf'] && this.headers['x-csrf'] && 
      this.cookies['csrf'] === this.headers['x-csrf']) {
      return true;
    }
    return false;
  }
  
  /**
   * @member
   * @readonly
   * @description AWS API Gateway http body
   * @returns {string|object} String with Post body contents. If request was 
   * sent with application/json header, body is automatically JSON parsed to 
   * an object
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
