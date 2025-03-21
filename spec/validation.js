import {Validation} from './../lib/validation.js';

describe('#Validation', () => {

  it('Validates a valid string', () => {
    Validation.validateString("foo");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a null input', () => {
    try {
      Validation.validateString(null);
    } catch (error) {
      expect(error.message).toEqual("validateString variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an undefined input', () => {
    try {
      Validation.validateString(undefined);
    } catch (error) {
      expect(error.message).toEqual("validateString variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an empty string', () => {
    try {
      Validation.validateString("");
    } catch (error) {
      expect(error.message).toEqual("validateString variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error with correct variable name when validateString is given a null string', () => {
    try {
      Validation.validateString(null, {name: "id"});
    } catch (error) {
      expect(error.message).toEqual("validateString id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateString is given an empty string but is not required', () => {
    Validation.validateString("", {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given a null input but is not required', () => {
    Validation.validateString(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given an undefined input but is not required', () => {
    Validation.validateString(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a number', () => {
    try {
      Validation.validateString(5);
    } catch (error) {
      expect(error.message).toEqual("validateString variable must be a string.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is less than given minLength', () => {
    try {
      Validation.validateString("foo", {minLength: 5});
    } catch (error) {
      expect(error.message).toEqual("validateString variable must be greater than 5 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than default maxLength', () => {
    try {
      let longString = ''.padStart(100001, "#");
      Validation.validateString(longString);
    } catch (error) {
      expect(error.message).toEqual("validateString variable must not exceed 100000 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than given maxLength', () => {
    try {
      Validation.validateString("foo", {maxLength: 2});
    } catch (error) {
      expect(error.message).toEqual("validateString variable must not exceed 2 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates a valid number', () => {
    Validation.validateNumber(5);
    expect(true).toEqual(true);
  });

  it('Throws an error when validateNumber is given a null input', () => {
    try {
      Validation.validateNumber(null);
    } catch (error) {
      expect(error.message).toEqual("validateNumber variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given an undefined input', () => {
    try {
      Validation.validateNumber(undefined);
    } catch (error) {
      expect(error.message).toEqual("validateNumber variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a string', () => {
    try {
      Validation.validateNumber("5");
    } catch (error) {
      expect(error.message).toEqual("validateNumber variable must be a number.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than default minValue', () => {
    try {
      Validation.validateNumber(Number.MIN_SAFE_INTEGER - 1);
    } catch (error) {
      expect(error.message).toEqual(`validateNumber variable must not be less than ${Number.MIN_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than given minValue', () => {
    try {
      Validation.validateNumber(5, {minValue: 10});
    } catch (error) {
      expect(error.message).toEqual(`validateNumber variable must not be less than 10.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than given minValue and minValue is 0', () => {
    expect(() => {
      Validation.validateNumber(-1, { minValue: 0 });
    }).toThrowError('validateNumber variable must not be less than 0.');
  });

  it('Throws an error when validateNumber is given a number that is greater than default maxValue', () => {
    expect(() => {
      Validation.validateNumber(Number.MAX_SAFE_INTEGER + 1)
    }).toThrowError(`validateNumber variable must not be greater than ${Number.MAX_SAFE_INTEGER}.`);
  });

  it('Throws an error when validateNumber is given a number that is greater than given maxValue', () => {
    try {
      Validation.validateNumber(5, {maxValue: 2});
    } catch (error) {
      expect(error.message).toEqual(`validateNumber variable must not be greater than 2.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateNumber is given a null input but is not required', () => {
    Validation.validateNumber(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateNumber is given an undefined input but is not required', () => {
    Validation.validateNumber(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Validates a valid url', () => {
    Validation.validateUrl("https://example.com");
    expect(true).toEqual(true);
  });

  it('Validates a valid url with a path', () => {
    Validation.validateUrl("https://example.com/foo");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non url', () => {
    try {
      Validation.validateUrl("foo");
    } catch (error) {
      expect(error.message).toEqual("validateUrl variable must be a url.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given a null input', () => {
    try {
      Validation.validateUrl(null);
    } catch (error) {
      expect(error.message).toEqual("validateUrl variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given an undefined input', () => {
    try {
      Validation.validateUrl(undefined);
    } catch (error) {
      expect(error.message).toEqual("validateUrl variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a null input but is not required', () => {
    Validation.validateUrl(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateUrl is given an undefined input but is not required', () => {
    Validation.validateUrl(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non http, https url', () => {
    try {
      Validation.validateUrl("ftp://example.com");
    } catch (error) {
      expect(error.message).toEqual("validateUrl variable protocol must be http:,https:.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a url with a protocol that is contained in provided protocols', () => {
    Validation.validateUrl("ftp://example.com", {protocols: ["https", "https:", "ftp:"]});
    expect(true).toEqual(true);
  });

  it('Validates a valid email address', () => {
    Validation.validateEmail("dan@example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given a non email address', () => {
    try {
      Validation.validateEmail("foo");
    } catch (error) {
      expect(error.message).toEqual("validateEmail variable must be a valid email address.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a null input', () => {
    try {
      Validation.validateEmail(null);
    } catch (error) {
      expect(error.message).toEqual("validateEmail variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given an undefined input', () => {
    try {
      Validation.validateEmail(undefined);
    } catch (error) {
      expect(error.message).toEqual("validateEmail variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateEmail is given a null input but is not required', () => {
    Validation.validateEmail(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateEmail is given an undefined input but is not required', () => {
    Validation.validateEmail(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given an email address longer than 254 chars', () => {
    try {
      let longString = ''.padStart(255, "a");
      Validation.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("validateEmail variable must be a valid email address (less than 254 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a first part larger than 64 chars', () => {
    try {
      let longString = ''.padStart(65, "#");
      Validation.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("validateEmail variable must be a valid email address (first part less than 65 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a domain part larger than 63 chars', () => {
    try {
      let longString = ''.padStart(64, "a");
      Validation.validateEmail(`dan@${longString}.com`);
    } catch (error) {
      expect(error.message).toEqual("validateEmail variable must be a valid email address (domain part less than 64 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates a valid true boolean', () => {
    Validation.validateBoolean(true);
    expect(true).toEqual(true);
  });

  it('Validates a valid false boolean', () => {
    Validation.validateBoolean(false);
    expect(true).toEqual(true);
  });

  it('Throws an error when validateBoolean is given a string', () => {
    try {
      Validation.validateBoolean("foo");
    } catch (error) {
      expect(error.message).toEqual("validateBoolean variable must be a boolean.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateBoolean is given a number', () => {
    try {
      Validation.validateBoolean(5);
    } catch (error) {
      expect(error.message).toEqual("validateBoolean variable must be a boolean.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateBoolean is given a null input', () => {
    try {
      Validation.validateBoolean(null);
    } catch (error) {
      expect(error.message).toEqual("validateBoolean variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateBoolean is given an undefined input', () => {
    try {
      Validation.validateBoolean(undefined);
    } catch (error) {
      expect(error.message).toEqual("validateBoolean variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateBoolean is given a null input but is not required', () => {
    Validation.validateBoolean(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateBoolean is given an undefined input but is not required', () => {
    Validation.validateBoolean(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Validates a valid instanceof', () => {
    class Model{}
    let model = new Model();
    Validation.validateInstanceOf(model, Model);
    expect(true).toEqual(true);
  });

  it('Throws an error when validateInstanceOf is not given a constructor to validate against', () => {
    try {
      class Model{}
      let model = new Model();
      Validation.validateInstanceOf(model);
    } catch (error) {
      expect(error.message).toEqual("validateInstanceOf variable must have a constructor to test instanceof.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateInstanceOf is given a null input', () => {
    try {
      class Model{}
      Validation.validateInstanceOf(null, Model);
    } catch (error) {
      expect(error.message).toEqual("validateInstanceOf variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateInstanceOf is given an undefined input', () => {
    try {
      class Model{}
      Validation.validateInstanceOf(undefined, Model);
    } catch (error) {
      expect(error.message).toEqual("validateInstanceOf variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateInstanceOf is given a wrong constructor', () => {
    try {
      class Model{}
      class Model2{}
      let model = new Model();
      Validation.validateInstanceOf(model, Model2, {name: "Model"});
    } catch (error) {
      expect(error.message).toEqual("validateInstanceOf Model must be an instanceof Model2.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateInstanceOf is given a null input but is not required', () => {
    class Model{}
    let model = new Model();
    Validation.validateInstanceOf(null, Model, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateInstanceOf is given an undefined input but is not required', () => {
    class Model{}
    let model = new Model();
    Validation.validateInstanceOf(undefined, Model, {required: false});
    expect(true).toEqual(true);
  });

});
