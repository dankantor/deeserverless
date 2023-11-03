import {ValidationError} from "./error.js";

class Model {

  #data

  /**
   * @constructs
   * @description Create a new Model object
   * @param {Object} data - An object that can later be used to set instance variables
   * @example
   *  let model = new Model({id: "foo", count: 5})
   *  model.setVarsFromData();
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * @type {Object}
   * @description Get and Set the data property. Can be set by passing into
   * constructor or any time after.
   * @example model.data = {id: "foo", count: 5};
   */
  get data() {
    return this.#data;
  }

  set data(data) {
    this.#data = data;
  }

  /**
   * @type {String}
   * @description Convenience function to get the constructor name of the class
   * that is extending this Model.
   * @example
   * class UserModel extends Model {...}
   *
   * let userModel = new UserModel();
   * console.log(userModel.modelType) // UserModel
   */
  get modelName() {
    return this.constructor.name;
  }

  set modelName(string) {
    if (string !== this.constructor.name) {
      console.warn(`Attempt to set modelName to anything other than ${this.constructor.name} is disallowed.`);
    }
  }

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
   * @returns {object} Object with keys and values picked from class members.
   * @example
   * let userModel = new UserModel({id: "foo", count: 4, email: "private@example.com"})
   * console.log(userModel.getObjectFromKeys(["id", "count"]) // {id: "foo", count: 4}
   *
   */
  getObjectFromKeys(keys) {
    let json = {};
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
    const opts = {
      required: true,
      minLength: options.minLength || null,
      maxLength: options.maxLength || 100000,
      name: options.name || "variable"
    }
    if (options.required === false) {
      opts.required = false;
    }
    if (opts.required === true) {
      if (string === undefined || string === null) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`
        });
      }
      if (typeof string !== "string") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a string.`
        });
      }
      if (string.trim() === "") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`
        });
      }
    }
    if (string !== undefined && string !== null) {
      if (typeof string !== "string") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a string.`
        });
      }
      if (opts.minLength !== null) {
        if (string.length < opts.minLength) {
          throw new ValidationError({
            message: `${this.constructor.name} ${opts.name} must be greater than ${opts.minLength} characters.`
          });
        }
      }
      if (string.length > opts.maxLength) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must not exceed ${opts.maxLength} characters.`
        });
      }
    }
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
    const opts = {
      required: true,
      minValue: options.minValue || Number.MIN_SAFE_INTEGER,
      maxValue: options.maxValue || Number.MAX_SAFE_INTEGER,
      name: options.name || "variable"
    }
    if (options.required === false) {
      opts.required = false;
    }
    if (opts.required === true) {
      if (number === undefined || number === null) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`
        });
      }
      if (typeof number !== "number") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a number.`
        });
      }
    }
    if (number !== undefined && number !== null) {
      if (typeof number !== "number") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a number.`
        });
      }
      if (number < opts.minValue) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must not be less than ${opts.minValue}.`
        });
      }
      if (number > opts.maxValue) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must not be greater than ${opts.maxValue}.`
        });
      }
    }
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
    const opts = {
      required: true,
      name: options.name || "variable",
      protocols: ["http:", "https:"]
    }
    if (options.required === false) {
      opts.required = false;
    }
    if (options.protocols) {
      opts.protocols = options.protocols
    }
    if (opts.required === true) {
      if (url === undefined || url === null) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`
        });
      }
    }
    let testedUrl;
    if (url !== undefined && url !== null) {
      try {
        testedUrl = new URL(url);
      } catch (err) {
        if (err.message.includes("Invalid URL")) {
          throw new ValidationError({
            message: `${this.constructor.name} ${opts.name} must be a url.`
          });
        } else {
          throw new ValidationError({
            message: `${this.constructor.name} ${opts.name} ${err.message}`
          });
        }
      }
      if (testedUrl.origin !== url) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a url.`
        });
      }
      if (opts.protocols.includes(testedUrl.protocol) === false) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} protocol must be ${opts.protocols.toString()}.`
        });
      }
    }
  }

  /**
   * @description Validate an email address
   * @param {String} email The email address to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true]
   * @throws {ValidationError}
   * @example
   * set email(emailAddress) {
   *   this.validateEmail(emailAddress, {name: "email"})
   *   this.#email = emailAddress;
   * }
   */
  validateEmail(email, options = {}) {
    const opts = {
      required: true,
      name: options.name || "variable"
    }
    if (options.required === false) {
      opts.required = false;
    }
    if (opts.required === true) {
      if (email === undefined || email === null) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`
        });
      }
    }
    if (email !== undefined && email !== null) {
      const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
      if (email.length > 254) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a valid email address (less than 254 chars).`
        });
      }
      let valid = emailRegex.test(email);
      if (!valid) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a valid email address.`
        });
      }
      let parts = email.split("@");
      if (parts[0].length > 64) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a valid email address (first part less than 65 chars).`
        });
      }
      let domainParts = parts[1].split(".");
      if (domainParts.some(part => {
        return part.length > 63;
      })) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} must be a valid email address (domain part less than 64 chars).`
        });
      }
    }
  }

}

export {Model};
