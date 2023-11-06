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

});
