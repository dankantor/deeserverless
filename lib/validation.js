import {ValidationError} from "./error.js";

class Validation {

  /**
   * @description Validate a string
   * @static
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
   * @param {String} [thisName="validateString"] Set to have better error messaging, ie
   * error.message = "UserModel id is required."
   * @throws {ValidationError}
   * @example
   * set id(string) {
   *   this.validateString(string, {name: "id"})
   *   this.#id = string;
   * }
   */
  static validateString(string, options = {}, thisName = "validateString") {
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
          message: `${thisName} ${opts.name} is required.`
        });
      }
      if (typeof string !== "string") {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must be a string.`
        });
      }
      if (string.trim() === "") {
        throw new ValidationError({
          message: `${thisName} ${opts.name} is required.`
        });
      }
    }
    if (string !== undefined && string !== null) {
      if (typeof string !== "string") {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must be a string.`
        });
      }
      if (opts.minLength !== null) {
        if (string.length < opts.minLength) {
          throw new ValidationError({
            message: `${thisName} ${opts.name} must be greater than ${opts.minLength} characters.`
          });
        }
      }
      if (string.length > opts.maxLength) {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must not exceed ${opts.maxLength} characters.`
        });
      }
    }
  }

  /**
   * @description Validate a number
   * @static
   * @param {Number} number The number to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true] If true, will check the string
   * for undefined, null, and empty
   * @param {Number} [options.minValue=Number.MIN_SAFE_INTEGER] If set will
   * check the number for a minimum value.
   * @param {Number} [options.maxValue=Number.MAX_SAFE_INTEGER] If set will
   * check the number for a maximum value.
   * @param {String} [options.name] Set to have better error messaging, ie
   * error.message = "UserModel count is required."
   * @param {String} [thisName="validateNumber"] Set to have better error messaging, ie
   * error.message = "UserModel count is required."
   * @throws {ValidationError}
   * @example
   * set count(number) {
   *   this.validateNumber(number, {name: "count"})
   *   this.#count = number;
   * }
   */
  static validateNumber(number, options = {}, thisName = "validateNumber") {
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
          message: `${thisName} ${opts.name} is required.`
        });
      }
      if (typeof number !== "number") {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must be a number.`
        });
      }
    }
    if (number !== undefined && number !== null) {
      if (typeof number !== "number") {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must be a number.`
        });
      }
      if (number < opts.minValue) {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must not be less than ${opts.minValue}.`
        });
      }
      if (number > opts.maxValue) {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must not be greater than ${opts.maxValue}.`
        });
      }
    }
  }

  /**
   * @description Validate a url
   * @static
   * @param {String} url The url to be validated
   * @param {Object} options
   * @param {Boolean} [options.required=true]
   * @param {String[]} [options.protocols=[http:, https:]] By default a url must
   * have an http: or https: protocol. Pass in a list of protocols to override this.
   * @param {String} [options.name] Set to have better error messaging, ie
   * error.message = "UserModel imageUrl is required."
   * @param {String} [thisName="validateUrl"] Set to have better error messaging, ie
   * error.message = "UserModel imageUrl is required."
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
  static validateUrl(url, options = {}, thisName = "validateUrl") {
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
          message: `${thisName} ${opts.name} is required.`
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
            message: `${thisName} ${opts.name} must be a url.`
          });
        } else {
          throw new ValidationError({
            message: `${thisName} ${opts.name} ${err.message}`
          });
        }
      }
      if (testedUrl.origin !== url) {
        throw new ValidationError({
          message: `${thisName} ${opts.name} must be a url.`
        });
      }
      if (opts.protocols.includes(testedUrl.protocol) === false) {
        throw new ValidationError({
          message: `${thisName} ${opts.name} protocol must be ${opts.protocols.toString()}.`
        });
      }
    }
  }

}

export {Validation}