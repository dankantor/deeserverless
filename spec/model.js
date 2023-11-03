import {Model} from './../lib/model.js';

describe('#Model', () => {

  it('Creates a new Model with data passed in', () => {
    let model = new Model({id: "foo"});
    expect(model.data.id).toEqual("foo");
  });

  it('Creates a new Model and sets the modelName', () => {
    let model = new Model({id: "foo"});
    expect(model.modelName).toEqual("Model");
  });

  it('It does not set modelName when it is different from the constructor name', () => {
    let model = new Model({id: "foo"});
    console.warn = jasmine.createSpy("warn");
    model.modelName = "test";
    expect(console.warn).toHaveBeenCalledWith('Attempt to set modelName to anything other than Model is disallowed.');
    expect(model.modelName).toEqual("Model");
  });

  it('Creates a new extended Model and sets data to vars correctly', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo"});
    userModel.setVarsFromData();
    expect(userModel.id).toEqual("foo");
  });

  it('Creates a new extended Model and sets data to vars correctly after var is set later', () => {
    class UserModel extends Model {}
    let userModel = new UserModel();
    userModel.id = "foo";
    expect(userModel.id).toEqual("foo");
  });

  it('Creates a new extended Model and sets vars to properties correctly', () => {
    class UserModel extends Model {
      get count() {return 1}
      set count(n) {}
    }
    let userModel = new UserModel();
    let spy = spyOnProperty(userModel, "count", "set");
    userModel.setVarsFromObject({
      count: 2
    });
    expect(spy).toHaveBeenCalled();
  });

  it('Returns the correct object from getObjectFromKeys', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo"});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "deep"]);
    expect(insertJSON.id).toEqual("foo");
  });

  it('Returns the correct object from getObjectFromKeys when a value is null', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo", nullProp: null});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "nullProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.nullProp).toBe(null);
  });

  it('Returns the correct object from getObjectFromKeys when a value is undefined', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo", undefinedProp: undefined});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "undefinedProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.undefinedProp).toBeUndefined();
  });

  it('Returns the correct object from getObjectFromKeys when a value is false', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo", falseProp: false});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id", "falseProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.falseProp).toBe(false);
  });

  it('Validates required properties correctly', () => {
    let model = new Model({id: "foo"});
    model.setVarsFromData();
    model.validateRequiredProperties(["id"]);
    expect(true).toBe(true);
  });

  it('Throws a validation error when validateRequiredProperties is given an undefined property', () => {
    try {
      let model = new Model();
      model.validateRequiredProperties(["id"]);
    } catch (error) {
      expect(error.message).toEqual("Model id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws a validation error when validateRequiredProperties is given a null property', () => {
    try {
      let model = new Model();
      model.id = null;
      model.validateRequiredProperties(["id"]);
    } catch (error) {
      expect(error.message).toEqual("Model id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates required properties correctly when checkForNull is false', () => {
    let model = new Model();
    model.id = null;
    model.validateRequiredProperties(["id"], false);
    expect(true).toBe(true);
  });

  it('Validates a valid string', () => {
    let model = new Model();
    model.validateString("foo");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a null input', () => {
    try {
      let model = new Model();
      model.validateString(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateString(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an empty string', () => {
    try {
      let model = new Model();
      model.validateString("");
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error with correct variable name when validateString is given a null string', () => {
    try {
      let model = new Model();
      model.validateString(null, {name: "id"});
    } catch (error) {
      expect(error.message).toEqual("Model id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateString is given an empty string but is not required', () => {
    let model = new Model();
    model.validateString("", {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given a null input but is not required', () => {
    let model = new Model();
    model.validateString(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateString(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a number', () => {
    try {
      let model = new Model();
      model.validateString(5);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a string.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is less than given minLength', () => {
    try {
      let model = new Model();
      model.validateString("foo", {minLength: 5});
    } catch (error) {
      expect(error.message).toEqual("Model variable must be greater than 5 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than default maxLength', () => {
    try {
      let model = new Model();
      let longString = ''.padStart(100001, "#");
      model.validateString(longString);
    } catch (error) {
      expect(error.message).toEqual("Model variable must not exceed 100000 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than given maxLength', () => {
    try {
      let model = new Model();
      model.validateString("foo", {maxLength: 2});
    } catch (error) {
      expect(error.message).toEqual("Model variable must not exceed 2 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates a valid number', () => {
    let model = new Model();
    model.validateNumber(5);
    expect(true).toEqual(true);
  });

  it('Throws an error when validateNumber is given a null input', () => {
    try {
      let model = new Model();
      model.validateNumber(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateNumber(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a string', () => {
    try {
      let model = new Model();
      model.validateNumber("5");
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a number.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than default minValue', () => {
    try {
      let model = new Model();
      model.validateNumber(Number.MIN_SAFE_INTEGER - 1);
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be less than ${Number.MIN_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than given minValue', () => {
    try {
      let model = new Model();
      model.validateNumber(5, {minValue: 10});
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be less than 10.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is greater than default maxValue', () => {
    try {
      let model = new Model();
      model.validateNumber(Number.MAX_SAFE_INTEGER + 1);
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be greater than ${Number.MAX_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is greater than given maxValue', () => {
    try {
      let model = new Model();
      model.validateNumber(5, {maxValue: 2});
    } catch (error) {
      expect(error.message).toEqual(`Model variable must not be greater than 2.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateNumber is given a null input but is not required', () => {
    let model = new Model();
    model.validateNumber(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateNumber is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateNumber(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Validates a valid url', () => {
    let model = new Model();
    model.validateUrl("https://example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non url', () => {
    try {
      let model = new Model();
      model.validateUrl("foo");
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a url.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given a null input', () => {
    try {
      let model = new Model();
      model.validateUrl(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateUrl(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a null input but is not required', () => {
    let model = new Model();
    model.validateUrl(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateUrl is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateUrl(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non http, https url', () => {
    try {
      let model = new Model();
      model.validateUrl("ftp://example.com");
    } catch (error) {
      expect(error.message).toEqual("Model variable protocol must be http:,https:.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a url with a protocol that is contained in provided protocols', () => {
    let model = new Model();
    model.validateUrl("ftp://example.com", {protocols: ["https", "https:", "ftp:"]});
    expect(true).toEqual(true);
  });

  it('Validates a valid email address', () => {
    let model = new Model();
    model.validateEmail("dan@example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given a non email address', () => {
    try {
      let model = new Model();
      model.validateEmail("foo");
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a null input', () => {
    try {
      let model = new Model();
      model.validateEmail(null);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given an undefined input', () => {
    try {
      let model = new Model();
      model.validateEmail(undefined);
    } catch (error) {
      expect(error.message).toEqual("Model variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateEmail is given a null input but is not required', () => {
    let model = new Model();
    model.validateEmail(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateEmail is given an undefined input but is not required', () => {
    let model = new Model();
    model.validateEmail(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given an email address longer than 254 chars', () => {
    try {
      let longString = ''.padStart(255, "a");
      let model = new Model();
      model.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address (less than 254 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a first part larger than 64 chars', () => {
    try {
      let longString = ''.padStart(65, "#");
      let model = new Model();
      model.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address (first part less than 65 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a domain part larger than 63 chars', () => {
    try {
      let longString = ''.padStart(64, "a");
      let model = new Model();
      model.validateEmail(`dan@${longString}.com`);
    } catch (error) {
      expect(error.message).toEqual("Model variable must be a valid email address (domain part less than 64 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

});
