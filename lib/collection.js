import {ValidationError} from "./error.js";

class Collection {

  #data
  #model
  #models

  /**
   * @constructs
   * @description Create a new Collection object
   * @param {Object} data - An object that can later be used to set instance variables
   * @example
   *  let collection = new Collection({id: "foo"})
   *  collection.setVarsFromData();
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * @type {Object}
   * @description Get and Set the data property. Can be set by passing into
   * constructor or any time after.
   * @example collection.data = {id: "foo", count: 5};
   */
  get data() {
    return this.#data;
  }

  set data(data) {
    this.#data = data;
  }

  get model() {
    return this.#model;
  }

  set model(model) {
    this.#model = model;
  }

  get models() {
    return this.#models || [];
  }

  set models(models) {
    if (Array.isArray(models)) {
      this.#models = models;
    }
  }

  /**
   * @description Will set class members from all keys and values of the data
   * member.
   * @example
   * let model = new Model({id: "foo"});
   * model.setVarsFromData(); // model.id now set to "foo"
   */
  setVarsFromData() {
    if (this.data) {
      if (this.data.model) {
        this.model = this.data.model;
      }
      for (const [key, value] of Object.entries(this.data)) {
        if (key === "models") {
          this.models = this.getModelsFromObjects(value);
        } else {
          this[key] = value;
        }
      }
    }
  }

  getModelsFromObjects(objects) {
    let models = [];
    if (objects && this.model) {
       objects.forEach(object => {
         let model = new this.model(object);
         models.push(model);
       });
    }
    return models;
  }

  /**
   * @type {String}
   * @description Convenience function to get the constructor name of the class
   * that is extending this Collection.
   * @example
   * class UserCollection extends Collection {...}
   *
   * let userCollection = new UserCollection();
   * console.log(userCollection.collectionName) // UserCollection
   */
  get collectionName() {
    return this.constructor.name;
  }

  set collectionName(string) {
    if (string !== this.constructor.name) {
      console.warn(`Attempt to set collectionName to anything other than ${this.constructor.name} is disallowed.`);
    }
  }

  get modelIds() {
    let ids = [];
    this.models.forEach(model => {
      if (model.id) {
        ids.push(model.id);
      }
    });
    return ids;
  }

  get uniqueModelIds() {
    let uniques = [];
    let idSet = new Set();
    this.modelIds.forEach(modelId => {
      if (!idSet.has(modelId)) {
        idSet.add(modelId);
        uniques.push(modelId);
      }
    });
    return uniques;
  }

  // forEach(fn) {
  //   return this.models.forEach(model => fn.call(undefined, model));
  // }
  //
  // map(fn) {
  //   return this.models.map(model => fn.call(undefined, model));
  // }

  pushModels(list) {
    if (Array.isArray(list)) {
      this.models = [...this.models, ...list];
    }
  }

  matchModelsAndObjects(objects, objectProp, modelProp, callbackFn) {
    if (objects && Array.isArray(objects)) {
      this.models.forEach(model => {
        let foundObject = objects.find(object => object[objectProp] === model[modelProp]);
        if (foundObject && callbackFn) {
            callbackFn.call(undefined, model, foundObject);
        }
      });
    }
  }

  toJSON() {
    return this.models.map(model => {
      return model.toJSON();
    });
  }

}

export {Collection};

class TeamMemberModel {
  #actorId
  #actorModel
  constructor(data) {
    this.actorId = data.actorId;
  }
  get actorId() {
    return this.#actorId;
  }
  set actorId(string) {
    this.#actorId = string;
  }
  get actorModel() {
    return this.#actorModel;
  }
  set actorModel(actorModel) {
    this.#actorModel = actorModel;
  }
  toJSON() {
    return {
      actorId: this.actorId,
      actorModel: this.actorModel
    }
  }
}

class ActorModel {
  #id
  #name
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  }
  get id() {
    return this.#id;
  }
  set id(string) {
    this.#id = string;
  }
  get name() {
    return this.#name;
  }
  set name(string) {
    this.#name = string;
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
}

let userTeamCollection = new Collection({
  models: [{actorId: 3}, {actorId: 4}],
  model: TeamMemberModel
});
userTeamCollection.setVarsFromData();
let objects = [{id: 3, name: "Dan"}, {id: 4, name: "Jon"}];

userTeamCollection.matchModelsAndObjects(objects, "id", "actorId", (model, object) => {
  model.actorModel = new ActorModel(object);
})


// userTeamCollection.models.forEach(model => {
//
//   userTeamCollection.findModelFromObjects(objects, "id", "actorId", (model, object) => {
//     console.log(model);
//   })
//
//   // foo(objects, "id", "actorId", () => {
//   //   let actorModel = new ActorModel(foundModel);
//   //   model.actorModel = actorModel;
//   // });
//   //
//   // let foundModel = objects.find(object => object.id === model.actorId);
//   // if (foundModel) {
//   //   let actorModel = new ActorModel(foundModel);
//   //   model.actorModel = actorModel;
//   // }
// });
//
console.log(JSON.stringify(userTeamCollection));
//console.log(userTeamCollection.toJSON())
//userTeamCollection.setVarsFromData();
// userTeamCollection.models.forEach(model => {
//   model.actorId = [{id: 3, name: "Dan"}].find(object => object.id === model.actorId);
// })

// userTeamCollection.runFnOnModel(userTeamCollection.findModelFromObjects(objects, "id", "actorId"), (model) => {
//
// });
// if (model) {
//   model.actor = {id: 3, name: "Dan"}
// }
// console.log(model)
//console.log(userTeamCollection.uniqueModelIds)
// collection.models = collection.getModelsFromObjects([
//    {id: 1}, {id: 2}, {id: 1}
// ])
//collection.models = collection.getModelsFromObjects(undefined)

// collection.models = [...collection.models, ...collection.getModelsFromObjects([
//   {id: 1}, {id: 2}
// ])];
//
// collection.pushModels(collection.getModelsFromObjects([
//   {id: 1}, {id: 2}
// ]));
// collection.models.forEach(model => {
//   console.log(model.id)
// })


//collection.models = [1,2,3];
// collection.forEach(item => {
//   console.log(item);
// });
// let items = collection.map(item => {
//   return item + 2;
// });
// console.log(items);
