class Request {
  
  constructor(event) {
    this.event = event;
  }
  
  get path() {
    return this.event.requestContext.http.path;
  }
  
  get type() {
    if (this.event.Records) {
      if (this.event.Records.length > 0) {
        if (this.firstRecord.eventSource) {
          return this.firstRecord.eventSource;
        }
      }
    } else if (this.event.userPoolId) {
      return 'aws:cognito';
    }
    return 'aws:apigateway';
  }
  
  get firstRecord() {
    return this.event.Records[0];
  }
  
  get routeKey() {
    if (this.event.routeKey === `${this.method} /`) {
      return `${this.method} /index`;
    }
    return this.event.routeKey;
  }
  
  get file() {
    let file;
    console.log('type', this.type);
    switch (this.type) {
      case 'aws:ses':
        file = `ses/incoming`;
      break;
      case 'aws:s3':
        file = `s3/${this.firstRecord.s3.bucket.name}`;
      break;
      case 'aws:cognito':
        file = `cognito/${this.event.triggerSource}`;
      break;
      default:
        file = this.routeKeyToPage(this.routeKey);
      break;
    }
    return file;
  }
  
  get method() {
    return this.event.requestContext.http.method;
  }
  
  get queryStringParameters() {
    return this.event.queryStringParameters;
  }
  
  get pathParameters() {
    return this.event.pathParameters;
  }
  
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
  
  get headers() {
    let keys = Object.keys(this.event.headers);
    let headers = {};
    keys.forEach(key => {
      headers[key.toLowerCase()] = this.event.headers[key];
    });
    return headers;
  }
  
  get isValidCsrf() {
    if (this.cookies['csrf'] && this.headers['x-csrf'] && 
      this.cookies['csrf'] === this.headers['x-csrf']) {
      return true;
    }
    return false;
  }
  
  get body() {
    if (this.event.body && this.event.body !== '') {
      if (this.headers?.['content-type'] === 'application/json') {
        return JSON.parse(this.event.body);
      }
      return this.event.body;
    }
    return null;
  }
  
  routeKeyToPage(routeKey) {
    let splits = routeKey.split(' ');
    let parts = splits[1].split('/');
    parts.splice(0, 1, 'pages');
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
  
}

export {Request};
