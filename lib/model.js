class Model {

  #data

  constructor(data) {
    this.data = data;
  }

  get data() {
    return this.#data;
  }

  set data(data) {
    this.#data = data;
  }

  setVarsFromData(options) {
    if (this.data) {
      for (const [key, value] of Object.entries(this.data)) {
        this[key] = value;
      }
    }
    if (options?.required) {
      for (const key of options.required) {
        const value = this.data[key];
        this[key] = value;
      }
    }
  }

  validateString(string, options = {}) {
    const opts = {
      required: true,
      maxLength: options.maxLength || 100000,
      name: options.name || "variable"
    }
    if (options.required === false) {
      opts.required = false;
    }
    if (typeof string !== "string") {
      throw new ValidationError({
        message: `${this.constructor.name} ${opts.name} must be a string.`,
        $metadata: {httpStatusCode: 400}
      });
    }
    if (opts.required === true) {
      if (string === undefined || string === null) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`,
          $metadata: {httpStatusCode: 400}
        });
      }
      if (string.trim() === "") {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`,
          $metadata: {httpStatusCode: 400}
        });
      }
    }
    if (string.length > opts.maxLength) {
      throw new ValidationError({
        message: `${this.constructor.name} ${opts.name} must not exceed ${opts.maxLength} characters.`,
        $metadata: {httpStatusCode: 400}
      });
    }
  }

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
    if (typeof number !== "number") {
      throw new ValidationError({
        message: `${this.constructor.name} ${opts.name} must be a number.`,
        $metadata: {httpStatusCode: 400}
      });
    }
    if (opts.required === true) {
      if (number === undefined || number === null) {
        throw new ValidationError({
          message: `${this.constructor.name} ${opts.name} is required.`,
          $metadata: {httpStatusCode: 400}
        });
      }
    }
    if (number < opts.minValue) {
      throw new ValidationError({
        message: `${this.constructor.name} ${opts.name} must not be less than ${opts.minValue}.`,
        $metadata: {httpStatusCode: 400}
      });
    }
    if (number > opts.maxValue) {
      throw new ValidationError({
        message: `${this.constructor.name} ${opts.name} must not be greater than ${opts.maxValue}.`,
        $metadata: {httpStatusCode: 400}
      });
    }
  }

}

export {Model};
