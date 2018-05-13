import BaseAdapter from './base-adapter';
import Tag from '../../models/tag';
import Post from '../../models/post';

/** Create sigleton adapters for common models.
 *  User adapter is too specific so that it is handled separately
 */
export const tagAdapter = new BaseAdapter(Tag);
export const postAdapter = new BaseAdapter(Post);
