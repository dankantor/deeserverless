import {Model} from './../lib/model.js';

describe('#Model', () => {

  it('Creates a new Model with data passed in', () => {
    let model = new Model({id: "foo"});
    expect(model.data.id).toEqual("foo");
  });

  it('Creates a new Model and sets the modelName ', () => {
    let model = new Model({id: "foo"});
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
    userModel.setVarsFromData();
    expect(userModel.id).toEqual("foo");
  });

  it('Creates a new extended Model and sets data to vars correctly with required vars', () => {
    class UserModel extends Model {
      get count() {return 1}
      set count(n) {}
    }
    let userModel = new UserModel();
    let spy = spyOnProperty(userModel, "count", "set");
    userModel.setVarsFromData({required: ["count"]});
    expect(spy).toHaveBeenCalled();
  });

  it('Returns the correct object from getObjectFromKeys', () => {
    class UserModel extends Model {}
    let userModel = new UserModel({id: "foo"});
    userModel.setVarsFromData();
    let insertJSON = userModel.getObjectFromKeys(["id"]);
    expect(insertJSON.id).toEqual("foo");
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

  it('Does not throws an error when validateString is given an empty string but is not required', () => {
    let model = new Model();
    model.validateString("", {required: false});
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

});
