import Post from '../../models/post';
import BaseAdapter from './base-adapter';

class PostAdapter extends BaseAdapter {
  constructor() {
    super(Post);
  }
}

const postAdapter = new PostAdapter();
export default postAdapter;

