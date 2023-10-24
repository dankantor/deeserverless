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
   * @property {Object} options
   * @property {String[]} options.required
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
   * @property {String[]} keys List of keys
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
   * @property {String} string
   * @property {Object} options
   * @property {Boolean} [options.required=true] If true, will check the string
   * for undefined, null, and empty
   * @property {Number} [options.minLength] If set will check the string for a
   * minimum length of characters.
   * @property {Number} [options.maxLength=100000] If set will check the string
   * for a maximum length of characters.
   * @property {String} [options.name] Set to have better error messaging, ie
   * error.message = "UserModel id is required."
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
        throw new Error({
          message: `${this.constructor.name} ${opts.name} is required.`,
          $metadata: {httpStatusCode: 400}
        });
      }
      if (string.trim() === "") {
        throw new Error({
          message: `${this.constructor.name} ${opts.name} is required.`,
          $metadata: {httpStatusCode: 400}
        });
      }
    }
    if (typeof string !== "string") {
      throw new Error({
        message: `${this.constructor.name} ${opts.name} must be a string.`,
        $metadata: {httpStatusCode: 400}
      });
    }
    if (opts.minLength !== null) {
      if (string.length < opts.minLength) {
        throw new Error({
          message: `${this.constructor.name} ${opts.name} must be greater than ${opts.minLength} characters.`,
          $metadata: {httpStatusCode: 400}
        });
      }
    }
    if (string.length > opts.maxLength) {
      throw new Error({
        message: `${this.constructor.name} ${opts.name} must not exceed ${opts.maxLength} characters.`,
        $metadata: {httpStatusCode: 400}
      });
    }
  }

  /**
   * @description Validate a number
   * @property {Number} number
   * @property {Object} options
   * @property {Boolean} [options.required=true] If true, will check the string
   * for undefined, null, and empty
   * @property {Number} [options.minValue=Number.MIN_SAFE_INTEGER] If set will
   * check the number for a minimum value.
   * @property {Number} [options.maxValue=Number.MAX_SAFE_INTEGER] If set will
   * check the number for a maximum value.
   * @property {String} [options.name] Set to have better error messaging, ie
   * error.message = "UserModel id is required."
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
        throw new Error({
          message: `${this.constructor.name} ${opts.name} is required.`,
          $metadata: {httpStatusCode: 400}
        });
      }
    }
    if (typeof number !== "number") {
      throw new Error({
        message: `${this.constructor.name} ${opts.name} must be a number.`,
        $metadata: {httpStatusCode: 400}
      });
    }
    if (number < opts.minValue) {
      throw new Error({
        message: `${this.constructor.name} ${opts.name} must not be less than ${opts.minValue}.`,
        $metadata: {httpStatusCode: 400}
      });
    }
    if (number > opts.maxValue) {
      throw new Error({
        message: `${this.constructor.name} ${opts.name} must not be greater than ${opts.maxValue}.`,
        $metadata: {httpStatusCode: 400}
      });
    }
  }

}

export {Model};
