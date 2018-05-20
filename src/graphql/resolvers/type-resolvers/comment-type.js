import User from '../../../models/user';
import Comment from '../../../models/comment';
import UserType from './user-type';
import {
  parseConnectionArgs,
  makeDataConnection,
} from '../type-resolvers/connection-type';

const CommentType = async(comment) => !comment ? null : await ({
  id: comment._id,
  body: comment.body,
  updated_at: comment.updated_at,
  created_at: comment.created_at,
  comment_on: comment.comment_on,
  author: async() => UserType(await User.findById(comment.author)),
  sub_comments: async(args) => {
    let { condition, order, cursorField } = parseConnectionArgs(args);
    condition.comment_on = comment._id;
    const total = await Comment.find(condition).count();
    const subComments = await Comment
      .find(condition)
      .sort(order)
      .limit(args.first);
    return makeDataConnection(CommentType, subComments, cursorField, total);
  },
});

export default CommentType;
