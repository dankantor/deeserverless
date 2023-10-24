class ValidationError extends Error {

  /**
   * @constructs
   * @description Create a new ValidationError object
   * @param {Object} options
   * @param {String} [options.message=Validation Error] Custom error message
   * @param {String} [options.$metadata={httpStatusCode: 400}] Custom $metadata
   * @param {String} options.$fault Custom $fault
   * @example
   *  throw new ValidationError({
   *    message: "id is required",
   *  });
   */
  constructor(options = {}) {
    const message = options.message || "Validation Error";
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
    this.name = this.constructor.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata || {httpStatusCode: 400};
  }
}

class AuthenticationError extends Error {

  /**
   * @constructs
   * @description Create a new AuthenticationError object
   * @param {Object} options
   * @param {String} [options.message=Authentication Error] Custom error message
   * @param {String} [options.$metadata={httpStatusCode: 401}] Custom $metadata
   * @param {String} options.$fault Custom $fault
   * @example
   *  throw new AuthenticationError();
   */
  constructor(options = {}) {
    const message = options.message || "Authentication Error";
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
    this.name = this.constructor.name;
    this.$fault = options.$fault;
    this.$metadata = {httpStatusCode: 401}
  }
}

class NotFoundError extends Error {

  /**
   * @constructs
   * @description Create a new NotFoundError object
   * @param {Object} options
   * @param {String} [options.message=Not Found] Custom error message
   * @param {String} [options.$metadata={httpStatusCode: 404}] Custom $metadata
   * @param {String} options.$fault Custom $fault
   * @example
   *  throw new NotFoundError();
   */
  constructor(options = {}) {
    const message = options.message || "Not Found";
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthenticationError);
    }
    this.name = this.constructor.name;
    this.$fault = options.$fault;
    this.$metadata = {httpStatusCode: 404}
  }
}

export {ValidationError, AuthenticationError, NotFoundError}
