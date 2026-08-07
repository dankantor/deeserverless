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
    this.$metadata = options.$metadata || {httpStatusCode: 401};
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
      Error.captureStackTrace(this, NotFoundError);
    }
    this.name = this.constructor.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata || {httpStatusCode: 404};
  }
}

class PermissionError extends Error {

  /**
   * @constructs
   * @description Create a new PermissionError object
   * @param {Object} options
   * @param {String} [options.message=Permission Error] Custom error message
   * @param {String} [options.$metadata={httpStatusCode: 403}] Custom $metadata
   * @param {String} options.$fault Custom $fault
   * @example
   *  throw new PermissionError();
   */
  constructor(options = {}) {
    const message = options.message || "Permission Error";
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionError);
    }
    this.name = this.constructor.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata || {httpStatusCode: 403};
  }
}

class BadgatewayError extends Error {

  /**
   * @constructs
   * @description Create a new BadgatewayError object
   * @param {Object} options
   * @param {String} [options.message=Bad Gateway Error] Custom error message
   * @param {String} [options.$metadata={httpStatusCode: 502}] Custom $metadata
   * @param {String} options.$fault Custom $fault
   * @example
   *  throw new BadgatewayError();
   */
  constructor(options = {}) {
    const message = options.message || "Bad Gateway Error";
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadgatewayError);
    }
    this.name = this.constructor.name;
    this.$fault = options.$fault;
    this.$metadata = options.$metadata || {httpStatusCode: 502};
  }
}

/**
 * @description Returns true if the error is one of the framework's own error
 * classes (or a subclass of one). Only these errors have a message and
 * $metadata.httpStatusCode that are safe to expose to clients — other errors
 * (eg AWS SDK service exceptions) also carry $metadata.httpStatusCode but
 * their messages can leak internal details.
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
function isFrameworkError(error) {
  const frameworkErrors = [ValidationError, AuthenticationError, NotFoundError,
    PermissionError, BadgatewayError];
  return frameworkErrors.some((errorClass) => error instanceof errorClass);
}

export {ValidationError, AuthenticationError, NotFoundError, PermissionError, BadgatewayError, isFrameworkError}
