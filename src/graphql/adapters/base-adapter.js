import 'babel-core/register';
import 'babel-polyfill';
import { parseConnectionQueryParams } from './helpers';
import base64 from 'base-64';

class BaseAdapter {
  constructor(model) {
    this.model = model;
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getAll = this.getAll.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(item, options = null) {
    const Model = this.model;
    let doc = new Model(item);
    return await doc.save();

    // let doc = new Model(item);

    // if (options && options.populate) {
    //   options.populate.forEach(p => (doc = doc.populate(p)));
    // }

    // return await doc.save();
  }

  async get(id, options = null) {
    return await this.model.findById(id);
    // console.log(options);
    // let doc = this.model.findById(id);

    // if (options && options.populate) {
    //   options.populate.forEach(p => (doc = doc.populate(p)));
    // }

    // return await doc;
  }

  async getAll(condition, options = null) {
    return await this.model.find(condition);
    // let doc = this.model.find(condition);

    // if (options && options.populate) {
    //   options.populate.forEach(p => (doc = doc.populate(p)));
    // }

    // return await doc;
  }

  async getDataConnection(params) {
    const { condition, count, order, cursorKey }
      = parseConnectionQueryParams(params);

    // console.log(`condition: ${JSON.stringify(condition)}`);
    // console.log(`count: ${count}`);
    // console.log(`order: ${order}`);
    // console.log(`cursorKey: ${cursorKey}`);

    // console.log(this.model);
    const data = await this.model.find(condition).sort(order).limit(count);
    // console.log(`data: ${data}`);

    if (data.length === 0) {
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: params.after,
        },
      };
    }

    const edges = data.map(item => {
      let cursorVal = item[[cursorKey]];
      // console.log(cursorVal instanceof Date);
      if (cursorVal instanceof Date)
        cursorVal = cursorVal.toISOString();
      return {
        node: item,
        cursor: base64.encode(`${cursorKey}: ${cursorVal}`),
      };
    });

    const pageInfo = {
      hasNextPage: data.length === count,
      endCursor: edges[edges.length - 1].cursor,
    };

    // console.log(edges);
    // console.log(pageInfo);

    return {edges, pageInfo};
  }

  async update(condition, update, options = null) {
    return await this.model
      // .where()
      .findOneAndUpdate(condition, update, {new: true});
  }

  async delete(condition) {
    return await this.model.where().findOneAndRemove(condition);
  }
}

export default BaseAdapter;
