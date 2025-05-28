import {Validation} from "./validation.js";
import {ValidationError} from "./error.js";

class ModelCollectionBase {

  /**
  * @constructs
  * @description Base class for Model and Collection. Should not be instantiated
  * directly.
  */
  constructor() {}

  static _locks = new Map();
  static _cache = {};
  static _responseCache = {};

  /**
   * @description Will set class members from all keys and values of the data
   * member.
   * @example
   * let model = new Model({id: "foo"});
   * model.setVarsFromData(); // model.id now set to "foo"
   */
  setVarsFromData() {
    if (this.data) {
      for (const [key, value] of Object.entries(this.data)) {
        this[key] = value;
      }
    }
  }

  /**
   * @description Will set class members from all keys and values of the object
   * provided.
   * @param {Object} object
   * @example
   * let userModel = new UserModel({id: "foo"})
   * userModel.setVarsFromObject({count: 1}); // userModel.count has now been set
   *
   */
  setVarsFromObject(object) {
    if (object) {
      for (const [key, value] of Object.entries(object)) {
        this[key] = value;
      }
    }
  }

  /**
   * @description Returns an object with keys and values picked from class members.
   * Will not return a key/value pair if value is undefined.
   * @param {String[]} keys List of keys
   * @param {Boolean} [orderByAlpha=true] Returned keys will be in alphabetical
   * order unless this param is set to false
   * @returns {object} Object with keys and values picked from class members.
   * @example
   * let userModel = new UserModel({id: "foo", count: 4, email: "private@example.com"})
   * console.log(userModel.getObjectFromKeys(["id", "count"]) // {count: 4, id: "foo"}
   *
   */
  getObjectFromKeys(keys, orderByAlpha = true) {
    let json = {};
    if (orderByAlpha === true) {
      keys.sort();
    }
    for (const key of keys) {
      if (this[key] !== undefined) {
        json[key] = this[key];
      }
    }
    return json;
  }

  /**
   * @description Validate that certain properties are set on the model. By
   * default will check for undefined and null.
   * @param {String[]} keys List of keys
   * @param {Boolean} [checkForNull=true] If set to false will only check for
   * undefined (not null)
   * @throws {ValidationError}
   * @example
   * let userModel = new UserModel({id: "foo"})
   * userModel.setVarsFromData();
   * userModel.validateRequiredProperties(["id", "count"]); // will throw an
   * error because 'count' is undefined.
   *
   */
  validateRequiredProperties(keys, checkForNull = true) {
    for (const key of keys) {
      if (this[key] === undefined) {
        throw new ValidationError({
          message: `${this.constructor.name} ${key} is required.`
        });
      }
      if (checkForNull === true) {
        if (this[key] === null) {
          throw new ValidationError({
            message: `${this.constructor.name} ${key} is required.`
          });
        }
      }
    }
  }

  /**
   * @description Validate a string
   * @param {String} string The string to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true] If true, will check the string
   * for undefined, null, and empty
   * @param {Number} [options.minLength] If set will check the string for a
   * minimum length of characters.
   * @param {Number} [options.maxLength=100000] If set will check the string
   * for a maximum length of characters.
   * @param {String} [options.name] Set to have better error messaging, ie
   * error.message = "UserModel id is required."
   * @throws {ValidationError}
   * @example
   * set id(string) {
   *   this.validateString(string, {name: "id"})
   *   this.#id = string;
   * }
   */
  validateString(string, options = {}) {
    Validation.validateString(string, options, this.constructor.name);
  }

  /**
   * @description Validate a number
   * @param {Number} number The number to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true] If true, will check the string
   * for undefined, null, and empty
   * @param {Number} [options.minValue=Number.MIN_SAFE_INTEGER] If set will
   * check the number for a minimum value.
   * @param {Number} [options.maxValue=Number.MAX_SAFE_INTEGER] If set will
   * check the number for a maximum value.
   * @param {String} [options.name] Set to have better error messaging, ie
   * error.message = "UserModel id is required."
   * @throws {ValidationError}
   * @example
   * set count(number) {
   *   this.validateNumber(number, {name: "count"})
   *   this.#count = number;
   * }
   */
  validateNumber(number, options = {}) {
    Validation.validateNumber(number, options, this.constructor.name);
  }

  /**
   * @description Validate a url
   * @param {String} url The url to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true]
   * @param {String[]} [options.protocols=[http:, https:]] By default a url must
   * have an http: or https: protocol. Pass in a list of protocols to override this.
   * @throws {ValidationError}
   * @example
   * set imageUrl(url) {
   *   this.validateUrl(url, {name: "imageUrl"})
   *   this.#imageUrl = url;
   * }
   * @example
   * set ftpUrl(url) {
   *   this.validateUrl(url, {protocols: ["ftp:"]})
   *   this.#ftpUrl = url;
   * }
   */
  validateUrl(url, options = {}) {
    Validation.validateUrl(url, options, this.constructor.name);
  }

  /**
   * @description Validate an email address
   * @param {String} emailAddress The email address to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true]
   * @throws {ValidationError}
   * @example
   * set email(emailAddress) {
   *   this.validateEmail(emailAddress, {name: "email"})
   *   this.#email = emailAddress;
   * }
   */
  validateEmail(emailAddress, options = {}) {
    Validation.validateEmail(emailAddress, options, this.constructor.name);
  }

  /**
   * @description Validate a boolean
   * @param {Boolean} boolean The boolean to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true]
   * @throws {ValidationError}
   * @example
   * set hasUsername(boolean) {
   *   this.validateBoolean(boolean, {name: "hasUsername"})
   *   this.#hasUsername = boolean;
   * }
   */
  validateBoolean(boolean, options = {}) {
    Validation.validateBoolean(boolean, options, this.constructor.name);
  }

  /**
   * @description Validate an object is an instance of another object
   * @param {Object} object The object to be validated
   * @param {Object} constructor The constructor to be validated against
   * @param {Object} options
   * @param {Boolean} [options.required=true]
   * @throws {ValidationError}
   * @example
   * set userModel(userModel) {
   *   this.validateInstanceOf(userModel, UserModel, {name: "userModel"})
   *   this.#userModel = userModel;
   * }
   */
  validateInstanceOf(object, constructor, options = {}) {
    Validation.validateInstanceOf(object, constructor, options, this.constructor.name);
  }

  /**
   * @description Add an async execution delay
   * @param {Number} milliseconds
   * @example
   * let userModel = new UserModel({id: "foo"})
   * await userModel.delay(5000); // delay execution by 5000ms
   * userModel.doSomething();
   *
   */
  delay(milliseconds) {
    return new Promise( (resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, milliseconds);
    });
  }

  /**
   * @description Splits an array into chunks of a specified size.
   *
   * @param {Array} list - The array to be split into chunks.
   * @param {number} size - The size of each chunk.
   * @returns {Array[]} An array containing the chunks of the original array.
   *
   * @example
   * // returns [[1, 2], [3, 4], [5]]
   * chunk([1, 2, 3, 4, 5], 2);
   *
   * @example
   * // returns [[1, 2, 3], [4, 5]]
   * chunk([1, 2, 3, 4, 5], 3);
   */
  chunk(list, size) {
    return Array.from({ length: Math.ceil(list.length / size) }, (_v, i) =>
      list.slice(i * size, i * size + size)
    );
  }

  /**
   * @static
   * Stores a value in a temporary in-memory cache with an optional expiration time.
   *
   * @param {string} key - The key under which the value will be stored.
   * @param {*} value - The value to store in the cache.
   * @param {number} [expiresIn=30000] - Time in milliseconds before the cache entry expires. Defaults to 30 seconds.
   */
  static setCache(key, value, expiresIn = 30000) {
    let expireTime = new Date().getTime() + expiresIn;
    this._cache[key] = {expireTime, value};
  }

  /**
   * @static
   * Retrieves a value from the cache if it exists and hasn't expired.
   *
   * @param {string} key - The key of the cached value to retrieve.
   * @returns {*} The cached value if it exists and is still valid, otherwise `null`.
   */
  static getCache(key) {
    try {
      let cachedObject = this?._cache?.[key];
      if (cachedObject) {
        let now = new Date().getTime();
        if (now < cachedObject.expireTime) {
          return cachedObject.value;
        }
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  /**
   * @static
   * Clears a value from the cache.
   *
   * @param {string} key - The key of the cached value to clear.
   */
  static clearCache(key) {
    delete this._cache[key];
  }

  /**
   * @private
   * @description Cache a full Response under `key` by pulling out its text + metadata.
   */
  static async _setResponseCache(key, response, expiresIn) {
    const clone = response.clone();
    const bodyText = await clone.text();
    const init = {
      status: clone.status,
      statusText: clone.statusText,
      headers: Array.from(clone.headers.entries())
        .reduce((h, [k,v]) => { h[k] = v; return h; }, {})
    };
    const expireTime = Date.now() + expiresIn;
    this._responseCache[key] = { expireTime, bodyText, init };
  }

  /**
   * @private
   * @description Return a fresh Response if still in cache, or null.
   */
  static _getResponseCache(key) {
    const entry = this._responseCache[key];
    if (entry && Date.now() < entry.expireTime) {
      let bodyText = entry.bodyText;
      if (entry?.init?.status === 204 || entry?.init?.status === 205) {
        bodyText = null;
      }
      return new Response(bodyText, entry.init);
    }
    return null;
  }

  /**
   * @static
   * Clears a value from the cache.
   *
   * @param {string} key - The key of the cached value to clear.
   */
  static _clearResponseCache(key) {
    delete this._responseCache[key];
  }

  /**
   * Acquires an asynchronous lock for a given name.
   * If the lock is already held, waits in a queue until it becomes available,
   * or rejects if a timeout is specified and exceeded.
   *
   * @param {string} [name='default'] - The name of the lock to acquire. Locks are independent by name.
   * @param {number|null} [timeoutMs=null] - Optional timeout in milliseconds. If set, the lock attempt will fail after this duration.
   * @returns {Promise<void>} A promise that resolves when the lock is acquired or rejects on timeout.
   */
  static async acquireLock(name = "default", timeoutMs = null) {
    if (!this._locks.has(name)) {
      this._locks.set(name, { locked: false, queue: [] });
    }

    const lock = this._locks.get(name);

    if (!lock.locked) {
      lock.locked = true;
      return;
    }

    return new Promise((resolve, reject) => {
      const entry = { resolve, reject };

      // Handle timeout if specified
      if (timeoutMs !== null) {
        entry.timer = setTimeout(() => {
          entry.timedOut = true;
          reject(new Error(`Lock "${name}" timed out after ${timeoutMs}ms`));
        }, timeoutMs);
      }

      lock.queue.push(entry);
    });
  }

  /**
   * Releases a previously acquired lock for a given name.
   * If there are queued waiters, the next one will be granted the lock.
   *
   * @param {string} [name='default'] - The name of the lock to release.
   */
  static releaseLock(name = "default") {
    const lock = this._locks.get(name);
    if (!lock) return;

    while (lock.queue.length > 0) {
      const next = lock.queue.shift();
      if (next.timedOut) continue; // Skip timed-out requests
      if (next.timer) clearTimeout(next.timer);

      next.resolve();
      return;
    }

    lock.locked = false;
  }

  /**
   * Attempts to acquire the lock immediately.
   * Returns true if the lock was acquired, false otherwise.
   *
   * @param {string} [name='default'] - The name of the lock to try acquiring.
   * @returns {boolean} True if the lock was acquired, false if it was already held.
   */
  static tryAcquireLock(name = "default") {
    if (!this._locks.has(name)) {
      this._locks.set(name, { locked: true, queue: [] });
      return true;
    }

    const lock = this._locks.get(name);
    if (!lock.locked) {
      lock.locked = true;
      return true;
    }

    return false;
  }

  /**
   * Checks if a lock is currently held.
   *
   * @param {string} [name='default'] - The name of the lock to check.
   * @returns {boolean} True if the lock is held, false otherwise.
   */
  static isLocked(name = "default") {
    const lock = this._locks.get(name);
    return lock ? lock.locked : false;
  }

  /**
   * @description Fetches a resource with support for locking, GET-only caching, and request abortion.
   * Only `GET` requests are eligible for caching. If a valid cached response exists, it is returned.
   */
  static async fetch(url, options = {}) {
    const opts = { ...options };
    const method = (opts.method || 'GET').toUpperCase();
    const shouldLock = !!opts.lockTimeoutMs;
    const isCacheable = method === 'GET' && typeof opts.cacheMs === 'number';
    const abortTimeoutMs = opts.abortTimeoutMs;

    if (shouldLock) {
      await this.acquireLock(url, opts.lockTimeoutMs);
    }

    try {
      if (isCacheable) {
        const cachedResponse = this._getResponseCache(url);
        if (cachedResponse) {
          return cachedResponse;          // brand-new Response every time
        }
      }

      const response = await this._fetchWithAbort(url, opts, abortTimeoutMs);

      if (isCacheable && this._isValidResponse(response)) {
        if (response.ok) {
          this._setResponseCache(url, response, opts.cacheMs);
        } else {
          this._clearResponseCache(url);
        }
      }

      return response;
    } finally {
      if (shouldLock) {
        this.releaseLock(url);
      }
    }
  }

  /**
   * @description Performs a fetch request with optional abort timeout support.
   * If the timeout is exceeded, the request is aborted using AbortController.
   *
   * @param {string} url - The URL to fetch.
   * @param {Object} options - Standard fetch options.
   * @param {number} [timeoutMs] - Optional timeout duration in milliseconds.
   * @returns {Promise<Response>} The response from the fetch call.
   * @throws {Error} If the request is aborted or another error occurs.
   * @private
   */
  static async _fetchWithAbort(url, options, timeoutMs) {
    if (!timeoutMs) return fetch(url, options);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    options.signal = controller.signal;

    try {
      return await fetch(url, options);
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error(`Fetch for ${url} aborted after ${timeoutMs}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * @description Checks whether the given object is a valid Response instance
   * that can be cloned and used safely.
   *
   * @param {*} obj - The object to validate.
   * @returns {boolean} True if the object appears to be a valid Response.
   * @private
   */
  static _isValidResponse(obj) {
    return !!(obj && typeof obj.clone === 'function' && typeof obj.text === 'function');
  }


}

export {ModelCollectionBase}
