import User from '../../../models/user';
import Tag from '../../../models/tag';
import Comment from '../../../models/comment';
import UserType from './user-type';
import TagType from './tag-type';
import CommentType from './comment-type';
import {
  parseConnectionArgs,
  makeDataConnection,
} from '../type-resolvers/connection-type';

const PostType = async(post) => !post ? null : await ({
  id: post._id,
  title: post.title,
  body: post.body,
  feature_image_url: post.feature_image_url,
  created_at: post.created_at,
  updated_at: post.updated_at,
  author: async() => UserType(await User.findById(post.author)),
  comments: async(args) => {
    let { condition, order, cursorField } = parseConnectionArgs(args);
    condition.comment_on = post._id;
    const total = await Comment.find(condition).count();
    const comments = await Comment
      .find(condition)
      .sort(order)
      .limit(args.first);
    return makeDataConnection(CommentType, comments, cursorField, total);
  },
  tags: async(args, context) => {
    const tags = await Tag.find({_id: {$in: post.tags}});
    return tags.map(tag => TagType(tag));
  },
});

export default PostType;
