class BaseAdapter {
  constructor(model) {
    this.model = model;
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get(id, options = null) {
    return await this.model.findById(id);
  }

  async getAll(options = null) {
    return await this.model.find();
  }

  async update(condition, update) {
    // console.log(condition);
    // console.log(update);
    return await this.model.where().findOneAndUpdate(condition, update);
  }

  async delete(condition) {
    // console.log(condition);
    return await this.model.where().findOneAndRemove(condition);
  }
}

export default BaseAdapter;
