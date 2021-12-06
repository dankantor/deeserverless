class Response {
  
  constructor(event, context, resolve, reject) {
    this.event = event;
    this.resolve = resolve;
    this.reject = reject;
  }
  
  get statusCode() {
    return this._statusCode || 500;
  }
  
  set statusCode(n) {
    this._statusCode = n;
  }
  
  get body() {
    return this._body;
  }
  
  set body(str) {
    this._body = str;
  }
  
  set json(data) {
    this.body = JSON.stringify(data);
  }
  
  set isHtml(bool) {
    if (bool === true) {
      this.contentType = 'text/html';
    }
  }
  
  get contentType() {
    return this._contentType || 'application/json';
  }
  
  set contentType(str) {
    this._contentType = str;
  } 
  
  get location() {
    return this._location;
  }
  
  set location(url) {
    this._location = url;
  }
  
  set cookie(obj) {
    const names = ['Set-Cookie', 'SEt-Cookie', 'SET-Cookie', 'SET-COokie', 
      'SET-COOkie', 'SET-COOKie', 'SET-COOKIe', 'SET-COOKIE', 'set-cookie', 
      'sEt-cookie', 'sET-cookie', 'sET-Cookie'
    ];
    if (!this._cookies) {
      this._cookies = {};
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
  
  get cookies() {
    return this._cookies || null;
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
    }
  }
  
  set endTimer(key) {
    if (this._timers[key] && this._timers[key]['startTime']) {
      this._timers[key] = {
        'elapsedTime': new Date().getTime() - this._timers[key]['startTime']
      }
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
    this.resolve(this.toJSON());
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