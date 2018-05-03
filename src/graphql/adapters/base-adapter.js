class BaseAdapter {
  constructor(model) {
    this.model = model;
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.delete = this.delete.bind(this);
  }

  async get(id, options=null) {
    return await this.model.findById(id);
  } 

  async getAll(options=null) {
    return await this.model.find();
  }

  async delete(id) {
    return await this.model.findByIdAndRemove(id);
  }
}

export default BaseAdapter;
