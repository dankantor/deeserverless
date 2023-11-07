import {ModelCollectionBase} from "./model-collection-base.js";
import {ValidationError} from "./error.js";

class Collection extends ModelCollectionBase {

  #data
  #model
  #models = []

  /**
   * @constructs
   * @description Create a new Collection object
   * @extends ModelCollectionBase
   * @param {Object} data - An object that can later be used to set instance variables
   * @example
   * let collection = new Collection({id: "foo"})
   * collection.setVarsFromData();
   */
  constructor(data) {
    super();
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

  /**
   * @type {Object}
   * @description Get and Set the model property. If set, any plain objects
   * pushed to models will be converted to this type.
   * @example
   * class UserModel {...}
   * let userCollection = new UserCollection();
   * userCollection.model = UserModel;
   */
  get model() {
    return this.#model;
  }

  /**
   * @type {Object[]}
   * @description List of models that the collection contains.
   * @example
   * class UserModel {...}
   * let userModel1 = new UserModel();
   * let userModel2 = new UserModel();
   * let userCollection = new UserCollection();
   * userCollection.model = UserModel;
   * userCollection.models = [userModel1, userModel2];
   */
  set model(model) {
    this.#model = model;
  }

  get models() {
    return this.#models;
  }

  set models(models) {
    if (Array.isArray(models)) {
      this.#models = models;
    } else {
      throw new ValidationError({
        message: `${this.constructor.name} models must be an array.`
      });
    }
  }

  /**
   * @type {String}
   * @description Convenience function to get the constructor name of the class
   * that is extending this Collection.
   * @example
   * class UserCollection extends Collection {...}
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

  /**
   * @type {Object[]}
   * @description Returns a list of ids from 'models'.
   * class UserModel {...}
   * let userModel1 = new UserModel({id: 1});
   * let userModel2 = new UserModel({id: 2});
   * let userCollection = new UserCollection();
   * userCollection.model = UserModel;
   * userCollection.models = [userModel1, userModel2];
   * userCollection.modelIds // [1,2]
   */
  get modelIds() {
    let ids = [];
    this.models.forEach(model => {
      if (model.id) {
        ids.push(model.id);
      }
    });
    return ids;
  }

  /**
   * @type {Object[]}
   * @description Returns a list of unique ids from 'models'.
   * class UserModel {...}
   * let userModel1 = new UserModel({id: 1});
   * let userModel2 = new UserModel({id: 2});
   * let userModel3 = new UserModel({id: 2});
   * let userCollection = new UserCollection();
   * userCollection.model = UserModel;
   * userCollection.models = [userModel1, userModel2, userModel3];
   * userCollection.modelIds // [1,2]
   */
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

  /**
   * @description Will set class members from all keys and values of the data
   * member. If you pass in 'model' as a key and the Model as a value,
   * that will be used to create models when a 'models' array is also passed in.
   * The 'models' array can be plain objects that will be turned into models,
   * or can be fully formed models.
   * @example
   * let collection = new Collection({model: Model, models: [model, model, ...]});
   * collection.setVarsFromData(); // collection.model now set to Model models
   * passed in will now be set on collection.models.
   */
  setVarsFromData() {
    if (this.data) {
      if (this.data.model) {
        this.model = this.data.model;
      }
      for (const [key, value] of Object.entries(this.data)) {
        if (key === "models") {
          this.pushModels(value);
        } else {
          this[key] = value;
        }
      }
    }
  }

  /**
   * @description Push models or objects to the 'models' property. If given
   * models that match 'model' they will be added. If given plain objects
   * they will be converted to models (assuming 'model' is set). If 'model' is
   * not set, they will be added as plain objects.
   * @param {Object[]} list - A list of models or plain objects.
   * @example
   * let collection = new Collection({model: UserModel});
   * collection.pushModels([model1, model2]);
   * collection.pushModels([obj1, obj2]);
   */
  pushModels(list) {
    if (list !== undefined && list !== null) {
      if (Array.isArray(list) === false) {
        list = [list];
      }
      list.forEach(item => {
        if (this.model) {
          if (item instanceof this.model === true) {
            this.#models.push(item);
          } else {
            let model = new this.model(item);
            this.#models.push(model);
          }
        } else {
          this.#models.push(item);
        }
      });
    }
  }

  /**
   * @description Given a list of objects and properties to find, will return
   * the first model that matches thoe properties.
   * @param {Object[]} objects - A list of objects.
   * @param {String} objectProp - The property name of the given objects
   * to match against
   * @param {String} modelProp - The property name to search for in models
   * @param {Collection~matchModelsAndObjectsCallback} callbackFn - The callback function
   * that will be called when an object and model are matched.
   * @example
   * let collection = new Collection({
   *   models: [{id: 1, actorId: 1}, {id:2, actorId: 2}]
   * });
   * collection.setVarsFromData();
   * let objects = [{id: 1, name: "Dan"}, {id: 2, name: "Jon"}];
   * collection.matchModelsAndObjects(objects, "id", "actorId", (model, object) => {
   *  model.name = object.name;
   * });
   */
  matchModelsAndObjects(objects, objectProp, modelProp, callbackFn) {
    if (objects && Array.isArray(objects) && objectProp && modelProp) {
      this.models.forEach(model => {
        let foundObject = objects.find(object => object[objectProp] === model[modelProp]);
        if (foundObject && callbackFn) {
            callbackFn.call(undefined, model, foundObject);
        }
      });
    }
  }

  /**
 * This callback is displayed as a global member.
 * @callback Collection~matchModelsAndObjectsCallback
 * @param {Object} model model that was matched.
 * @param {Object} foundObject object that was matched.
 */

  /**
   * @description Method that will allow JSON.stringify(collection) to return
   * a list of models.
   * @returns {Object[]}
   */
  toJSON() {
    return this.models.map(model => {
      if (model.toJSON) {
        return model.toJSON();
      }
      return model;
    });
  }

}

export {Collection};

// class TeamMemberModel {
//   #actorId
//   #actorModel
//   constructor(data) {
//     this.actorId = data.actorId;
//   }
//   get actorId() {
//     return this.#actorId;
//   }
//   set actorId(string) {
//     this.#actorId = string;
//   }
//   get actorModel() {
//     return this.#actorModel;
//   }
//   set actorModel(actorModel) {
//     this.#actorModel = actorModel;
//   }
//   toJSON() {
//     return {
//       actorId: this.actorId,
//       actorModel: this.actorModel
//     }
//   }
// }
//
// class ActorModel {
//   #id
//   #name
//   constructor(data) {
//     this.id = data.id;
//     this.name = data.name;
//   }
//   get id() {
//     return this.#id;
//   }
//   set id(string) {
//     this.#id = string;
//   }
//   get name() {
//     return this.#name;
//   }
//   set name(string) {
//     this.#name = string;
//   }
//   toJSON() {
//     return {
//       id: this.id,
//       name: this.name
//     }
//   }
// }

// let userTeamCollection = new Collection({
//   models: [{actorId: 3}, {actorId: 4}],
//   model: TeamMemberModel
// });
// userTeamCollection.setVarsFromData();
// let objects = [{id: 3, name: "Dan"}, {id: 4, name: "Jon"}];
//
// userTeamCollection.matchModelsAndObjects(objects, "id", "actorId", (model, object) => {
//   model.actorModel = new ActorModel(object);
// })
// console.log(JSON.stringify(userTeamCollection));

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
