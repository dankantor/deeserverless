class ValidationError extends Error {
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
