import { postAdapter } from '../adapters';

const postResolver = {
  post: async({id}) => {
    return await postAdapter.get(id);
  },

  posts: async(params) => postAdapter.getDataConnection(params),

  createPost: async({post}, {userId}) => {
    if (!userId)
      throw new Error('Login before creating post');

    const newPost = {
      ...post,
      author: userId,
      created_at: Date.now(),
    };
    return await postAdapter.create(newPost);
  },

  updatePost: async({id, post}, {userId}) => {
    try {
      const updatedPost =
        await postAdapter.update({_id: id, author: userId}, post);

      if (!updatedPost)
        throw new Error('Post does not exist or your are not the author');

      return updatedPost;

    } catch (e) {
      /* handle error */
      console.log(e);
    }
  },

  deletePost: async({id}, {userId}) => {
    try {
      const deletedPost = await postAdapter.delete({_id: id, author: userId});

      if (!deletedPost)
        throw new Error('Post does not exist or your are not the author');

      return deletedPost;
    } catch (e) {
      /* handle error */
      console.log(e);
    }
  },
};

export default postResolver;
