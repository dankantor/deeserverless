import {Collection} from './../lib/collection.js';

describe('#Collection', () => {

  it('Creates a new Collection with data passed in', () => {
    let collection = new Collection({id: "foo"});
    expect(collection.data.id).toEqual("foo");
  });

  it('Creates a new Collection and sets the collectionName', () => {
    let collection = new Collection({id: "foo"});
    expect(collection.collectionName).toEqual("Collection");
  });

  it('It does not set collectionName when it is different from the constructor name', () => {
    let collection = new Collection({id: "foo"});
    console.warn = jasmine.createSpy("warn");
    collection.collectionName = "test";
    expect(console.warn).toHaveBeenCalledWith('Attempt to set collectionName to anything other than Collection is disallowed.');
    expect(collection.collectionName).toEqual("Collection");
  });

  it('Creates a new extended Collection and sets data to vars correctly', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({id: "foo"});
    userCollection.setVarsFromData();
    expect(userCollection.id).toEqual("foo");
  });

  it('Creates a new extended Collection and sets data from models to vars correctly', () => {
    class UserCollection extends Collection {}
    class Model {}
    let model1 = new Model();
    let model2 = new Model();
    let userCollection = new UserCollection({models: [model1, model2], model: Model});
    userCollection.setVarsFromData();
    expect(userCollection.models[0].constructor.name).toEqual("Model");
    expect(userCollection.model).toBeDefined();
  });

  it('Creates a new extended Collection and sets data from models to vars correctly (when reversed)', () => {
    class UserCollection extends Collection {}
    class Model {}
    let model1 = new Model();
    let model2 = new Model();
    let userCollection = new UserCollection({model: Model, models: [model1, model2]});
    userCollection.setVarsFromData();
    expect(userCollection.models[0].constructor.name).toEqual("Model");
    expect(userCollection.model).toBeDefined();
  });

  it('Creates a new extended Collection and sets data from plain objects to vars correctly', () => {
    class UserCollection extends Collection {}
    class Model {}
    let obj1 = {}
    let obj2 = {}
    let userCollection = new UserCollection({model: Model, models: [obj1, obj2]});
    userCollection.setVarsFromData();
    expect(userCollection.models[0].constructor.name).toEqual("Model");
    expect(userCollection.model).toBeDefined();
  });

  it('Creates a new extended Collection and sets data from plain objects to vars correctly when not given a Model', () => {
    class UserCollection extends Collection {}
    let obj1 = {}
    let obj2 = {}
    let userCollection = new UserCollection({models: [obj1, obj2]});
    userCollection.setVarsFromData();
    expect(userCollection.models[0].constructor.name).toEqual("Object");
    expect(userCollection.model).toBeUndefined();
  });

  it('Creates a new extended Collection and sets data from models to vars correctly when given 1 model', () => {
    class UserCollection extends Collection {}
    class Model {}
    let model1 = new Model();
    let userCollection = new UserCollection({models: model1, model: Model});
    userCollection.setVarsFromData();
    expect(userCollection.models[0].constructor.name).toEqual("Model");
    expect(userCollection.model).toBeDefined();
  });

  it('Throws a validation error when setting models is not given an array', () => {
    try {
      let collection = new Collection();
      collection.models = "hello";
    } catch (error) {
      expect(error.message).toEqual("Collection models must be an array.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Pushes new models correctly when given a model', () => {
    class UserCollection extends Collection {}
    class Model {}
    let model1 = new Model();
    let model2 = new Model();
    let userCollection = new UserCollection({model: Model});
    userCollection.setVarsFromData();
    userCollection.pushModels([model1, model2])
    expect(userCollection.models[0].constructor.name).toEqual("Model");
    expect(userCollection.model).toBeDefined();
  });

  it('Pushes new models correctly when not given a model', () => {
    class UserCollection extends Collection {}
    let obj1 = {}
    let obj2 = {}
    let userCollection = new UserCollection();
    userCollection.pushModels([obj1, obj2])
    expect(userCollection.models[0].constructor.name).toEqual("Object");
    expect(userCollection.model).toBeUndefined();
  });

  it('Pushes new models correctly when given a model and plain objects', () => {
    class UserCollection extends Collection {}
    class Model {}
    let obj1 = {}
    let obj2 = {}
    let userCollection = new UserCollection({model: Model});
    userCollection.setVarsFromData();
    userCollection.pushModels([obj1, obj2]);
    expect(userCollection.models[0].constructor.name).toEqual("Model");
    expect(userCollection.model).toBeDefined();
  });

  it('Creates a new extended Collection and sets data to vars correctly after var is set later', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection();
    userCollection.id = "foo";
    expect(userCollection.id).toEqual("foo");
  });

  it('Creates a new extended Collection and sets vars to properties correctly', () => {
    class UserCollection extends Collection {
      get count() {return 1}
      set count(n) {}
    }
    let userCollection = new UserCollection();
    let spy = spyOnProperty(userCollection, "count", "set");
    userCollection.setVarsFromObject({
      count: 2
    });
    expect(spy).toHaveBeenCalled();
  });

  it('Returns the correct object from getObjectFromKeys', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({id: "foo"});
    userCollection.setVarsFromData();
    let insertJSON = userCollection.getObjectFromKeys(["id", "deep"]);
    expect(insertJSON.id).toEqual("foo");
  });

  it('Returns the correct object from getObjectFromKeys when a value is null', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({id: "foo", nullProp: null});
    userCollection.setVarsFromData();
    let insertJSON = userCollection.getObjectFromKeys(["id", "nullProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.nullProp).toBe(null);
  });

  it('Returns the correct object from getObjectFromKeys when a value is undefined', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({id: "foo", undefinedProp: undefined});
    userCollection.setVarsFromData();
    let insertJSON = userCollection.getObjectFromKeys(["id", "undefinedProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.undefinedProp).toBeUndefined();
  });

  it('Returns the correct object from getObjectFromKeys when a value is false', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({id: "foo", falseProp: false});
    userCollection.setVarsFromData();
    let insertJSON = userCollection.getObjectFromKeys(["id", "falseProp"]);
    expect(insertJSON.id).toEqual("foo");
    expect(insertJSON.falseProp).toBe(false);
  });

  it('Returns the correct list of modelIds', () => {
    class UserCollection extends Collection {}
    class Model {
      #id
      constructor(data) {
        this.id = data.id;
      }
      get id() {
        return this.#id;
      }
      set id(string) {
        this.#id = string;
      }
    }
    let model1 = new Model({id: 1});
    let model2 = new Model({id: 2});
    let userCollection = new UserCollection({models: [model1, model2], model: Model});
    userCollection.setVarsFromData();
    expect(userCollection.modelIds).toEqual([1,2]);
  });

  it('Returns the correct list of modelIds when model does not have an id property', () => {
    class UserCollection extends Collection {}
    class Model {}
    let model1 = new Model();
    let model2 = new Model();
    let userCollection = new UserCollection({models: [model1, model2], model: Model});
    userCollection.setVarsFromData();
    expect(userCollection.modelIds.length).toEqual(0);
  });

  it('Returns the correct list of uniqueModelIds', () => {
    class UserCollection extends Collection {}
    class Model {
      #id
      constructor(data) {
        this.id = data.id;
      }
      get id() {
        return this.#id;
      }
      set id(string) {
        this.#id = string;
      }
    }
    let model1 = new Model({id: 1});
    let model2 = new Model({id: 2});
    let model3 = new Model({id: 2});
    let userCollection = new UserCollection({models: [model1, model2, model3], model: Model});
    userCollection.setVarsFromData();
    expect(userCollection.uniqueModelIds).toEqual([1,2]);
  });

  it('Returns the correct list of uniqueModelIds when model does not have an id property', () => {
    class UserCollection extends Collection {}
    class Model {}
    let model1 = new Model();
    let model2 = new Model();
    let userCollection = new UserCollection({models: [model1, model2], model: Model});
    userCollection.setVarsFromData();
    expect(userCollection.uniqueModelIds.length).toEqual(0);
  });

  it('Returns the correct JSON when stringified', () => {
    class UserCollection extends Collection {}
    class Model {
      #id
      constructor(data) {
        this.id = data.id;
      }
      get id() {
        return this.#id;
      }
      set id(string) {
        this.#id = string;
      }
      toJSON() {
        return {id: this.id}
      }
    }
    let model1 = new Model({id: 1});
    let model2 = new Model({id: 2});
    let userCollection = new UserCollection({models: [model1, model2], model: Model});
    userCollection.setVarsFromData();
    expect(JSON.stringify(userCollection)).toBe('[{"id":1},{"id":2}]');
  });

  it('Returns the correct JSON when stringified', () => {
    class UserCollection extends Collection {}
    class Model {
      #id
      constructor(data) {
        this.id = data.id;
      }
      get id() {
        return this.#id;
      }
      set id(string) {
        this.#id = string;
      }
      toJSON() {
        return {id: this.id}
      }
    }
    let model1 = new Model({id: 1});
    let model2 = new Model({id: 2});
    let userCollection = new UserCollection({models: [model1, model2]});
    userCollection.setVarsFromData();
    expect(JSON.stringify(userCollection)).toBe('[{"id":1},{"id":2}]');
  });

  it('Returns the correct JSON when stringified and given plain objects', () => {
    class UserCollection extends Collection {}
    class Model {
      #id
      constructor(data) {
        this.id = data.id;
      }
      get id() {
        return this.#id;
      }
      set id(string) {
        this.#id = string;
      }
      toJSON() {
        return {id: this.id}
      }
    }
    let obj1 = {id: 1}
    let obj2 = {id: 2}
    let userCollection = new UserCollection({model: Model});
    userCollection.setVarsFromData();
    userCollection.pushModels([obj1, obj2]);
    let json = userCollection.toJSON();
    expect(JSON.stringify(userCollection)).toBe('[{"id":1},{"id":2}]');
  });

  it('Returns the correct JSON when stringified and given plain objects and no model', () => {
    class UserCollection extends Collection {}
    class Model {}
    let obj1 = {id: 1}
    let obj2 = {id: 2}
    let userCollection = new UserCollection();
    userCollection.setVarsFromData();
    userCollection.pushModels([obj1, obj2]);
    let json = userCollection.toJSON();
    expect(JSON.stringify(userCollection)).toBe('[{"id":1},{"id":2}]');
  });

  it('Matches the correct objects and models', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({
      models: [{id: 1, actorId: 1}, {id:2, actorId: 2}]
    });
    userCollection.setVarsFromData();
    let objects = [{id: 1, name: "Dan"}, {id: 2, name: "Jon"}];
    userCollection.matchModelsAndObjects(objects, "id", "actorId", (model, object) => {
      model.name = object.name;
    });
    expect(userCollection.models[0].name).toEqual("Dan");
  });

  it('Matches the correct objects and models when given undefined objects', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({
      models: [{id: 1, actorId: 1}, {id:2, actorId: 2}]
    });
    userCollection.setVarsFromData();
    userCollection.matchModelsAndObjects(undefined, "id", "actorId", (model, object) => {
      model.name = object.name;
    });
    expect(userCollection.models[0].name).toBeUndefined();
  });

  it('Matches the correct objects and models when given a single object for objects', () => {
    class UserCollection extends Collection {}
    let userCollection = new UserCollection({
      models: [{id: 1, actorId: 1}, {id:2, actorId: 2}]
    });
    userCollection.setVarsFromData();
    userCollection.matchModelsAndObjects({foo: "bar"}, "id", "actorId", (model, object) => {
      model.name = object.name;
    });
    expect(userCollection.models[0].name).toBeUndefined();
  });

  it('Validates required properties correctly', () => {
    let collection = new Collection({id: "foo"});
    collection.setVarsFromData();
    collection.validateRequiredProperties(["id"]);
    expect(true).toBe(true);
  });

  it('Throws a validation error when validateRequiredProperties is given an undefined property', () => {
    try {
      let collection = new Collection();
      collection.validateRequiredProperties(["id"]);
    } catch (error) {
      expect(error.message).toEqual("Collection id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws a validation error when validateRequiredProperties is given a null property', () => {
    try {
      let collection = new Collection();
      collection.id = null;
      collection.validateRequiredProperties(["id"]);
    } catch (error) {
      expect(error.message).toEqual("Collection id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates required properties correctly when checkForNull is false', () => {
    let collection = new Collection();
    collection.id = null;
    collection.validateRequiredProperties(["id"], false);
    expect(true).toBe(true);
  });

  it('Validates a valid string', () => {
    let collection = new Collection();
    collection.validateString("foo");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a null input', () => {
    try {
      let collection = new Collection();
      collection.validateString(null);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an undefined input', () => {
    try {
      let collection = new Collection();
      collection.validateString(undefined);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given an empty string', () => {
    try {
      let collection = new Collection();
      collection.validateString("");
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error with correct variable name when validateString is given a null string', () => {
    try {
      let collection = new Collection();
      collection.validateString(null, {name: "id"});
    } catch (error) {
      expect(error.message).toEqual("Collection id is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateString is given an empty string but is not required', () => {
    let collection = new Collection();
    collection.validateString("", {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given a null input but is not required', () => {
    let collection = new Collection();
    collection.validateString(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateString is given an undefined input but is not required', () => {
    let collection = new Collection();
    collection.validateString(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateString is given a number', () => {
    try {
      let collection = new Collection();
      collection.validateString(5);
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a string.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is less than given minLength', () => {
    try {
      let collection = new Collection();
      collection.validateString("foo", {minLength: 5});
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be greater than 5 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than default maxLength', () => {
    try {
      let collection = new Collection();
      let longString = ''.padStart(100001, "#");
      collection.validateString(longString);
    } catch (error) {
      expect(error.message).toEqual("Collection variable must not exceed 100000 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateString is given a string that is greater than given maxLength', () => {
    try {
      let collection = new Collection();
      collection.validateString("foo", {maxLength: 2});
    } catch (error) {
      expect(error.message).toEqual("Collection variable must not exceed 2 characters.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Validates a valid number', () => {
    let collection = new Collection();
    collection.validateNumber(5);
    expect(true).toEqual(true);
  });

  it('Throws an error when validateNumber is given a null input', () => {
    try {
      let collection = new Collection();
      collection.validateNumber(null);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given an undefined input', () => {
    try {
      let collection = new Collection();
      collection.validateNumber(undefined);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a string', () => {
    try {
      let collection = new Collection();
      collection.validateNumber("5");
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a number.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than default minValue', () => {
    try {
      let collection = new Collection();
      collection.validateNumber(Number.MIN_SAFE_INTEGER - 1);
    } catch (error) {
      expect(error.message).toEqual(`Collection variable must not be less than ${Number.MIN_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is less than given minValue', () => {
    try {
      let collection = new Collection();
      collection.validateNumber(5, {minValue: 10});
    } catch (error) {
      expect(error.message).toEqual(`Collection variable must not be less than 10.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is greater than default maxValue', () => {
    try {
      let collection = new Collection();
      collection.validateNumber(Number.MAX_SAFE_INTEGER + 1);
    } catch (error) {
      expect(error.message).toEqual(`Collection variable must not be greater than ${Number.MAX_SAFE_INTEGER}.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateNumber is given a number that is greater than given maxValue', () => {
    try {
      let collection = new Collection();
      collection.validateNumber(5, {maxValue: 2});
    } catch (error) {
      expect(error.message).toEqual(`Collection variable must not be greater than 2.`);
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateNumber is given a null input but is not required', () => {
    let collection = new Collection();
    collection.validateNumber(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateNumber is given an undefined input but is not required', () => {
    let collection = new Collection();
    collection.validateNumber(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Validates a valid url', () => {
    let collection = new Collection();
    collection.validateUrl("https://example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non url', () => {
    try {
      let collection = new Collection();
      collection.validateUrl("foo");
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a url.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given a null input', () => {
    try {
      let collection = new Collection();
      collection.validateUrl(null);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateUrl is given an undefined input', () => {
    try {
      let collection = new Collection();
      collection.validateUrl(undefined);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a null input but is not required', () => {
    let collection = new Collection();
    collection.validateUrl(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateUrl is given an undefined input but is not required', () => {
    let collection = new Collection();
    collection.validateUrl(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateUrl is given a non http, https url', () => {
    try {
      let collection = new Collection();
      collection.validateUrl("ftp://example.com");
    } catch (error) {
      expect(error.message).toEqual("Collection variable protocol must be http:,https:.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateUrl is given a url with a protocol that is contained in provided protocols', () => {
    let collection = new Collection();
    collection.validateUrl("ftp://example.com", {protocols: ["https", "https:", "ftp:"]});
    expect(true).toEqual(true);
  });

  it('Validates a valid email address', () => {
    let collection = new Collection();
    collection.validateEmail("dan@example.com");
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given a non email address', () => {
    try {
      let collection = new Collection();
      collection.validateEmail("foo");
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a valid email address.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a null input', () => {
    try {
      let collection = new Collection();
      collection.validateEmail(null);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given an undefined input', () => {
    try {
      let collection = new Collection();
      collection.validateEmail(undefined);
    } catch (error) {
      expect(error.message).toEqual("Collection variable is required.");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Does not throw an error when validateEmail is given a null input but is not required', () => {
    let collection = new Collection();
    collection.validateEmail(null, {required: false});
    expect(true).toEqual(true);
  });

  it('Does not throw an error when validateEmail is given an undefined input but is not required', () => {
    let collection = new Collection();
    collection.validateEmail(undefined, {required: false});
    expect(true).toEqual(true);
  });

  it('Throws an error when validateEmail is given an email address longer than 254 chars', () => {
    try {
      let longString = ''.padStart(255, "a");
      let collection = new Collection();
      collection.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a valid email address (less than 254 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a first part larger than 64 chars', () => {
    try {
      let longString = ''.padStart(65, "#");
      let collection = new Collection();
      collection.validateEmail(`${longString}@example.com`);
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a valid email address (first part less than 65 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Throws an error when validateEmail is given a domain part larger than 63 chars', () => {
    try {
      let longString = ''.padStart(64, "a");
      let collection = new Collection();
      collection.validateEmail(`dan@${longString}.com`);
    } catch (error) {
      expect(error.message).toEqual("Collection variable must be a valid email address (domain part less than 64 chars).");
      expect(error.$metadata.httpStatusCode).toEqual(400);
    }
  });

  it('Delays execution correctly', async () => {
    let collection = new Collection();
    let start = new Date().getTime();
    await collection.delay(10);
    let end = new Date().getTime();
    expect(end - start).toBeGreaterThan(5);
  });

  it("should split an array into chunks of specified size", function() {
    const input = [1, 2, 3, 4, 5];
    const size = 2;
    const expectedOutput = [[1, 2], [3, 4], [5]];
    let collection = new Collection();
    expect(collection.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle chunk sizes larger than the array length", function() {
    const input = [1, 2, 3];
    const size = 5;
    const expectedOutput = [[1, 2, 3]];
    let collection = new Collection();
    expect(collection.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle chunk sizes equal to the array length", function() {
    const input = [1, 2, 3];
    const size = 3;
    const expectedOutput = [[1, 2, 3]];
    let collection = new Collection();
    expect(collection.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle chunk sizes of 1", function() {
    const input = [1, 2, 3];
    const size = 1;
    const expectedOutput = [[1], [2], [3]];
    let collection = new Collection();
    expect(collection.chunk(input, size)).toEqual(expectedOutput);
  });

  it("should handle empty arrays", function() {
    const input = [];
    const size = 3;
    const expectedOutput = [];
    let collection = new Collection();
    expect(collection.chunk(input, size)).toEqual(expectedOutput);
  });

});
