import BaseAdapter from './base-adapter';
import Tag from '../../models/tag';

class TagAdapter extends BaseAdapter {
  constructor(){
    super(Tag);
  }

  async create(tag) {
    const newTag = new Tag(tag);
    return newTag.save();
  }
}

const tagAdapter = new TagAdapter();
export default tagAdapter;
