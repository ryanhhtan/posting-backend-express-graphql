import 'babel-core/register';
import 'babel-polyfill';

class BaseAdapter {
  constructor(model) {
    this.model = model;
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(item) {
    const Model = this.model;
    const newItem = new Model(item);
    return await newItem.save();
  }

  async get(id) {
    return await this.model.findById(id);
  }

  async getAll(condition) {
    return await this.model.find(condition);
  }

  async update(condition, update) {
    return await this.model
      .where()
      .findOneAndUpdate(condition, update, {new: true});
  }

  async delete(condition) {
    return await this.model.where().findOneAndRemove(condition);
  }
}

export default BaseAdapter;
