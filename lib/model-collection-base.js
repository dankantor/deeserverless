import {Validation} from "./validation.js";
import {ValidationError} from "./error.js";

class ModelCollectionBase {

  /**
  * @constructs
  * @description Base class for Model and Collection. Should not be instantiated
  * directly.
  */
  constructor() {}

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

}

export {ModelCollectionBase}
