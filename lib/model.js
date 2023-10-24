import {ValidationError} from "./error.js";

class Model {

  #data

  /**
   * @constructs
   * @description Create a new Model object
   * @param {Object} data - An object that can later be used to set instance variables
   * @example
   *  let model = new Model({id: "foo", count: 5})
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

  /**
   * @description Will set class members from all keys and values of the data
   * member. If required keys are passed in, will try and set those as well.
   * @param {Object} options
   * @param {String[]} options.required
   * @example
   * let userModel = new UserModel({id: "foo"})
   * userModel.setVarsFromData({required: ["id"]}); // userModel.id has now been set
   *
   */
  setVarsFromData(options) {
    if (this.data) {
      for (const [key, value] of Object.entries(this.data)) {
        this[key] = value;
      }
    }
    if (options?.required) {
      for (const key of options.required) {
        this[key] = this[key];
      }
    }
  }

  /**
   * @description Returns an object with keys and values picked from class members.
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
      json[key] = this[key];
    }
    return json;
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
      if (string.trim() === "") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`
        });
      }
    }
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
    }
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

export {Model};
