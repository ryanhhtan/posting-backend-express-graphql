import Comment from '../../../models/comment';
import CommentType from '../type-resolvers/comment-type';
import {
  parseConnectionArgs,
  makeDataConnection,
} from '../type-resolvers/connection-type';

import { deleletCommentsOn } from '../helpers';

const commentResolver = {
  createComment: async({comment_on, comment}, {userId}) => {
    if (!userId)
      throw new Error('Login before commmenting.');

    // console.log(comment_on);
    const newComment = new Comment({
      ...comment,
      comment_on,
      author: userId,
      created_at: Date.now(),
    });
    return CommentType(await newComment.save());
  },

  comments: async(args) => {
    let { condition, order, cursorField } = parseConnectionArgs(args);
    condition.comment_on = args.on;
    const total = await Comment.find(condition).count();
    const comments = await Comment.find(condition)
      .sort(order)
      .limit(args.first || 10);
    return makeDataConnection(CommentType, comments, cursorField, total);
  },

  deleteComment: async(args) => {
    return deleletCommentsOn(args.onId);
  },
};

export default commentResolver;
