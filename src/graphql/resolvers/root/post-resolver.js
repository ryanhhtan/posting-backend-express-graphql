import Post from '../../../models/post';
import PostType from '../type-resolvers/post-type';
import {
  parseConnectionArgs,
  makeDataConnection,
} from '../type-resolvers/connection-type';

const postResolver = {
  post: async(args, context) => {
    return PostType(await Post.findById(args.id));
  },

  posts: async(args, context) => {
    const { condition, order, cursorField } = parseConnectionArgs(args);
    // console.log(condition);
    // console.log(order);
    // console.log(cursorField);
    const total = await Post.find(condition).count();
    const posts = await Post.find(condition).sort(order).limit(args.first);

    return makeDataConnection(PostType, posts, cursorField, total);
  },

  createPost: async({post}, {userId }) => {
    if (!userId)
      throw new Error('Login before posting.');

    const newPost = new Post({
      ...post,
      author: userId,
    });

    return PostType(await newPost.save());

  },

  updatePost: async({id, post}, {userId}) => {
    const updatedPost = await Post.findOneAndUpdate(
      {_id: id, author: userId},
      post,
      {new: true}
    );
    if (!updatedPost)
      throw new Error('Only the author can modify the post.');
    return PostType(updatedPost);
  },

  deletePost: async({id}, {userId}) => {
    if (!userId)
      throw new Error('Login before deleting the post.');

    try {
      const deletedPost = await Post
        .findOneAndRemove({_id: id, author: userId});

      if (!deletedPost)
        throw new Error('Only the author can delete the post.');

      return PostType(deletedPost);
    } catch (e) {
      /* handle error */
      console.error(e);
    }
  },
};

export default postResolver;
