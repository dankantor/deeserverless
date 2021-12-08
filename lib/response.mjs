class Response {
  
  #resolve;
  #statusCode;
  #body;
  #isHtml;
  #contentType;
  #location;
  #cookies;
  
  /**
   * @description Create a new Response object. This is called automatically when
   * a new App is instatiated. You do not need to call this directly.
   * @param {resolve} resolve - Resolve from a Promise
   */
  constructor(resolve) {
    this.#resolve = resolve;
  }
  
  /**
   * @type {number}
   * @description Get or Set the status code that is passed back to the event 
   * initiator (eg API Gateway, S3)
   * @property {number} n - The status code
   * @default 500
   * @example response.statusCode = 200;
   */
  set statusCode(n) {
    this.#statusCode = n;
  }
  
  get statusCode() {
    return this.#statusCode || 500;
  }
  
  /**
   * @type {string}
   * @description Get or Set the body that is passed back to the event
   *  initiator (eg API Gateway, S3)
   * @property {string} str - Body that will be returned to the event initiator
   * @example response.body = "hello world";
   */
  set body(str) {
    this.#body = str;
  }
  
  get body() {
    return this.#body;
  }
  
  /**
   * @type {object}
   * @description Convenience method to set the body to a JSON string from an object
   * @property {object} obj - Object to stringify and set to body
   * @example response.json = {"status": "ok"};
   */
  set json(obj) {
    this.#body = JSON.stringify(obj);
  }
  
  /**
   * @type {string}
   * @description Get or Set content type
   * @property {string} str - The content type
   * @default application/json
   * @example response.contentType = 'text/html'
   */
  get contentType() {
    return this.#contentType || 'application/json';
  }
  
  set contentType(str) {
    this.#contentType = str;
  } 
  
  /**
   * @type {string}
   * @description Get or Set Location header 
   * @property {string} str - The location to set
   * @example response.location = 'https://example.com';
   */
  get location() {
    return this.#location;
  }
  
  set location(url) {
    this.#location = url;
  }
  
  /**
   * @type {object}
   * @description Set a cookie to be returned in the response headers 
   * @property {object} cookie - Cookie object
   * @property {string} cookie.key - Set the name of the cookie
   * @property {string} cookie.value - Set the value of the cookie
   * @property {number} [cookie.maxAge=604800] - Set the Max-Age param of cookie in seconds
   * @property {date} [cookie.expires] - Set the Expires param of cookie in toUTCString 
   *  format. Only will get set if maxAge is not explicitly set
   * @property {boolean} [cookie.secure=true] Set to false to serve cookie over http
   * @property {boolean} [cookie.httpOnly=true] Set to false to allow cookie to be
   *  accessed in client javascript
   * @property {string} [cookie.domain] - Set the Domain param. If not set it will
   *  be automatically set to the serving domain
   * @property {string} [cookie.sameSite=lax] Set the SameSite param. Possible
   *  values are lax, strict, none
   * @property {string} [cookie.path=/] Set the Path param
   * @example response.cookie = {"key": "userid", "value": "abc"}
   */
  set cookie(obj) {
    const names = ['Set-Cookie', 'SEt-Cookie', 'SET-Cookie', 'SET-COokie', 
      'SET-COOkie', 'SET-COOKie', 'SET-COOKIe', 'SET-COOKIE', 'set-cookie', 
      'sEt-cookie', 'sET-cookie', 'sET-Cookie'
    ];
    if (!this.#cookies) {
      this.#cookies = {};
    }
    let foundName = names.find(name => { return !this.#cookies[name] });
    let maxAgeExpires = 'Max-Age=604800;';
    if (obj.maxAge) {
      maxAgeExpires = `Max-Age=${obj.maxAge};`;
    } else if (obj.expires) {
      maxAgeExpires = `Expires=${obj.expires};`;
    }
    let secure = 'Secure;';
    if (obj.secure === false) {
      secure = '';
    }
    let httpOnly = 'HttpOnly;';
    if (obj.httpOnly === false) {
      httpOnly = '';
    }
    let domain = '';
    if (obj.domain) {
      domain = `${obj.domain};`;
    }
    let sameSite = obj.sameSite || 'lax';
    let path = obj.path || '/;';
    let value = `${obj.key}=${obj.value};${secure}${domain}${httpOnly}${maxAgeExpires}SameSite=${sameSite};Path=${path}`;
    this.#cookies[foundName] = value;
  }
  
  /**
   * @type {object}
   * @readonly
   * @description Cookies that have been set
   * @returns {object} key/value pairs representing cookies
   */
  get cookies() {
    return this.#cookies || null;
  }
  
  /**
   * @type {string}
   * @description Set a csrf cookie
   * @property {string} csrf
   * @example response.csrf = "abcd1234";
   */
  set csrf(str) {
    this.cookie = {'key': 'csrf', 'value': str, 'sameSite': 'Strict'};
  }
  
  /**
   * @type {object}
   * @description Set a custom header
   * @property {object} Header
   * @property {string} Header.key
   * @property {string} Header.value
   * @example response.header = {"key": "foo", "value": "bar"};
   */
  set header(obj) {
    if (!this._headers) {
      this._headers = {};
    }
    this._headers[obj.key] = obj.value;
  }
  
  /**
   * @type {object}
   * @readonly
   * @description headers that have been set
   * @returns {object} key/value pairs representing headers
   */
  get headers() {
    return this._headers || {};
  }
  
  /**
   * @type {string}
   * @description Start a timer. Used in conjunction with endTimer. If set, 
   *  Response will include a header server-timing
   * @property {string} key - The name of the timer to start
   * @example response.startTimer = "database";
   */
  set startTimer(key) {
    if (!this._timers) {
      this._timers = {};
    }
    this._timers[key] = {
      'startTime': new Date().getTime()
    };
  }
  
  /**
   * @type {string}
   * @description End a timer. Used in conjunction with startTimer. If set, 
   *  Response will include a header server-timing
   * @property {string} key - The name of the timer to start
   * @example response.endTimer = "database";
   */
  set endTimer(key) {
    if (this._timers[key] && this._timers[key]['startTime']) {
      this._timers[key] = {
        'elapsedTime': new Date().getTime() - this._timers[key]['startTime']
      };
    }
  }
  
  /**
   * @type {object}
   * @readonly
   * @description timers that have been set
   * @returns {object} key/value pairs representing timers
   */
  get timers() {
    return this._timers || null;
  }
  
  /**
   * @type {number}
   * @description Get and Set the Cache-Control header
   * @property {number} n - Seconds to set cache header to 
   * @example response.cacheHeader = 30;
   */
  get cacheHeader() {
    return this._cacheHeader;
  }
  
  set cacheHeader(n) {
    this._cacheHeader = n;
  }
  
  
  /**
   * @description Called when the request is done. The resolve of the Promise
   * passed in to the constructor will be called with JSON 
   * @returns {object} {statusCode, body, headers}
   */
  done() {
    this.#resolve(this.#toJSON());
  }
  
  #toJSON() {
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