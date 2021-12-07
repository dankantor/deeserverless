/** @class Response */
class Response {
  
  #resolve;
  #statusCode;
  #body;
  #isHtml;
  #contentType;
  #location;
  #cookies;
  
  /**
   * @constructs
   * @description Create a new Response object. This is called automatically when
   * a new App is instatiated. You do not need to call this directly. 
   * @param {resolve} Resolve from a Promise
   */
  constructor(resolve) {
    this.#resolve = resolve;
  }
  
  // get #resolve() {
  //   return this.#_resolve;
  // }
  
  // set #resolve(r) {
  //   this.#_resolve = r;
  // }
  
  /**
   * @member
   * @type {number}
   * @description Get or Set the status code that is passed back to the event 
   * initiator (eg API Gateway, S3)
   * @default 500
   * @returns {number}
   */
  set statusCode(n) {
    this.#statusCode = n;
  }
  
  get statusCode() {
    return this.#statusCode || 500;
  }
  
  /**
   * @member
   * @type {string}
   * @description Get or Set the body that is passed back to the event 
   * initiator (eg API Gateway, S3)
   * @default undefined
   */
  set body(str) {
    this.#body = str;
  }
  
  get body() {
    return this.#body;
  }
  
  /**
   * @member
   * @type {object}
   * @description Convenience method to set the body to a JSON string from an object
   */
  set json(data) {
    this.#body = JSON.stringify(data);
  }
  
  /**
   * @member
   * @type {bool}
   * @description Get or Set content type to text/html by passing in a boolean
   * @param {boolean}
   * @default false
   */
  get isHtml() {
    if (this.#contentType === 'text/html') {
      return true;
    }
    return false;
  }
  
  set isHtml(bool) {
    if (bool === true) {
      this.#contentType = 'text/html';
    }
  }
  
  /**
   * @member
   * @type {string}
   * @description Get or Set content type
   * @param {string}
   * @default application/json
   */
  get contentType() {
    //console.log('c', this.#contentType)
    return this.#contentType || 'application/json';
  }
  
  set contentType(str) {
    this.#contentType = str;
  } 
  
  /**
   * @member
   * @type {string}
   * @description Get or Set location. Should be set in tandem with statusCode 
   * set to 3xx. 
   * @param {string}
   * @default undefined
   */
  get location() {
    return this.#location;
  }
  
  set location(url) {
    this.#location = url;
  }
  
  /**
   * @member
   * @description Set a cookie to be returned in the response headers 
   * @param {Object} cookie - Cookie object
   * @param {string} [cookie.key] - Set the name of the cookie
   * @param {string} [cookie.value] - Set the value of the cookie
   * @param {string} [cookie.maxAge=604800] - Set the Max-Age param of cookie in seconds
   * @param {string} [cookie.expires] - Set the Expires param of cookie in toUTCString 
   * format. Only will get set if maxAge is not explicitly set
   * @param {string} [cookie.secure=Secure] Set the Secure param to only serve 
   * cookie in https environments
   * @param {string} [cookie.domain] - Set the Domain param. If not set it will
   * be automatically set to the serving domain
   * @param {string} [cookie.sameSite=lax] Set the SameSite param. Possible
   * values are lax, strict, none
   */
  set cookie(obj) {
    const names = ['Set-Cookie', 'SEt-Cookie', 'SET-Cookie', 'SET-COokie', 
      'SET-COOkie', 'SET-COOKie', 'SET-COOKIe', 'SET-COOKIE', 'set-cookie', 
      'sEt-cookie', 'sET-cookie', 'sET-Cookie'
    ];
    if (!this.#cookies) {
      this.#cookies = {};
    }
    let foundName = names.find(name => { return !this._cookies[name] });
    let secure = 'Secure;';
    let domain = '';
    let maxAgeExpires = 'Max-Age=604800;';
    if (obj.maxAge) {
      maxAgeExpires = `Max-Age=${obj.maxAge};`;
    } else if (obj.expires) {
      maxAgeExpires = `Expires=${obj.expires};`;
    }
    let sameSite = obj.sameSite || 'lax';
    let value = `${obj.key}=${obj.value};${secure}${domain}HttpOnly;${maxAgeExpires}SameSite=${sameSite};Path=/;`;
    this._cookies[foundName] = value;
  }
  
  /**
   * @member
   * @readonly
   * @description Cookies that have been set
   * @returns {object} key/value pairs representing cookies
   */
  get cookies() {
    return this.#cookies || null;
  }
  
  set csrf(str) {
    this.cookie = {'key': 'csrf', 'value': str, 'sameSite': 'Strict'};
  }
  
  set header(obj) {
    if (!this._headers) {
      this._headers = {};
    }
    this._headers[obj.key] = obj.value;
  }
  
  get headers() {
    return this._headers || {};
  }
  
  set startTimer(key) {
    if (!this._timers) {
      this._timers = {};
    }
    this._timers[key] = {
      'startTime': new Date().getTime()
    };
  }
  
  set endTimer(key) {
    if (this._timers[key] && this._timers[key]['startTime']) {
      this._timers[key] = {
        'elapsedTime': new Date().getTime() - this._timers[key]['startTime']
      };
    }
  }
  
  get timers() {
    return this._timers || null;
  }
  
  get cacheHeader() {
    return this._cacheHeader;
  }
  
  set cacheHeader(n) {
    this._cacheHeader = n;
  }
  
  done() {
    this.#resolve(this.toJSON());
  }
  
  toJSON() {
    let data = {
      'statusCode': this.statusCode,
      'body': this.body,
      'headers': {
        'Content-Type': this.contentType
      }
    };
    data.headers = {...data.headers, ...this.headers};
    if (this.location) {
      data.headers.Location = this.location;
    }
    if (this.cacheHeader !== undefined) {
      data.headers['Cache-Control'] = `max-age=${this.cacheHeader}`;
    }
    if (this.cookies) {
      data.headers = {...data.headers, ...this.cookies};
    }
    if (this.timers) {
      let serverTimerHeader = '';
      let timers = Object.keys(this.timers);
      timers.forEach((timer, i) => {
        let timerObj = this.timers[timer];
        serverTimerHeader += `a${i};dur=${timerObj.elapsedTime};desc="${timer}",`;
      });
      data.headers['server-timing'] = serverTimerHeader;
    }
    return data;
  }
  
}

export {Response};