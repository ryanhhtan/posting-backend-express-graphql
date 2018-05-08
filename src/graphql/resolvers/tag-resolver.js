import tagAdapter from '../adapters/tag-adapter';

const tagResolver = {
  tag: async({id}) => await tagAdapter.get(id),

  tags: async(_, { userId }) => await tagAdapter.getAll({owner: userId}),

  createTag: async({tag}, {userId}) => {
    // console.log(tag);
    return tagAdapter.create({
      owner: userId,
      ...tag,
    });
  },

  updateTag: async({id, tag}, {userId}) => {
    try {
      return tagAdapter.update({_id: id, owner: userId}, tag);
    } catch (e) {
      /* handle error */
      console.log(e);
      throw new Error('tag does not exist or unauthorized to update.');
    }
  },

  deleteTag: async({id}, {userId}) => {
    try {
      return await tagAdapter.delete({_id: id, owner: userId});
    } catch (e) {
      /* handle error */
      console.log(e);
      throw new Error('tag does not exist or unauthorized to delete.');

    }
  },
};

export default tagResolver;
