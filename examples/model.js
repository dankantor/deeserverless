import {Model} from './../lib/model.js';

class UserModel extends Model {

  #id
  #count

  constructor(data) {
    super(data);
    this.setVarsFromData();
  }

  get id() {
    return this.#id;
  }

  set id(string) {
    this.validateString(string, {name: "id"})
    this.#id = string;
  }

  get count() {
    return this.#count;
  }

  set count(number) {
    this.validateNumber(number, {name: "count", required: false});
    this.#count = number;
  }

  async fetch() {
    this.setVarsFromData({required: ["id"]});
    this.count = 19;
    console.log("fetched", JSON.stringify(this));
  }

  async save() {
    this.setVarsFromData({required: ["id", "count"]});
    let insertJSON = this.getObjectFromKeys(["modelName", "id", "count"]);
    console.log("inserting", insertJSON);
  }

  toJSON() {
    return this.getObjectFromKeys(["id", "count"]);
  }

}

try {
  let userModel = new UserModel({id: "fetchExample"});
  await userModel.fetch();

  let userModel2 = new UserModel({id: "saveExample", count: 5});
  await userModel2.save();

} catch (err) {
  console.log(err.message)
}
