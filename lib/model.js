import {ModelCollectionBase} from "./model-collection-base.js";

class Model extends ModelCollectionBase {

  #data

  /**
   * @constructs
   * @description Create a new Model object
   * @extends ModelCollectionBase
   * @param {Object} data - An object that can later be used to set instance variables
   * @example
   *  let model = new Model({id: "foo", count: 5})
   *  model.setVarsFromData();
   */
  constructor(data) {
    super();
    this.data = data;
  }

  /**
   * @type {Object}
   * @description Get and Set the data property. Can be set by passing into
   * constructor or any time after.
   * @example model.data = {id: "foo", count: 5};
   */
  get data() {
    return this.#data;
  }

  set data(data) {
    this.#data = data;
  }

  /**
   * @type {String}
   * @description Convenience function to get the constructor name of the class
   * that is extending this Model.
   * @example
   * class UserModel extends Model {...}
   *
   * let userModel = new UserModel();
   * console.log(userModel.modelName) // UserModel
   */
  get modelName() {
    return this.constructor.name;
  }

  set modelName(string) {
    if (string !== this.constructor.name) {
      console.warn(`Attempt to set modelName to anything other than ${this.constructor.name} is disallowed.`);
    }
  }

}

export {Model};
