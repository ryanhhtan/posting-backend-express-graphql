import errors from '../../../errors/errors';
import TagType from '../type-resolvers/tag-type';
import Tag from '../../../models/tag';

const tagResolver = {
  tag: async({id}) => TagType(await Tag.findById(id)),

  tags: async() => {
    const tags = await Tag.find();
    return tags.map(tag => TagType(tag));
  },

  mytags: async(_, {userId}) => {
    if (!userId)
      throw new Error('Log in berfore checking your tags.');
    const tags = await Tag.find({ owner: userId });
    return tags.map(tag => TagType(tag));
  },

  createTag: async({tag}, {userId}) => {
    if (!userId)
      throw new Error('Log in before creating tags.');

    try {
      const newTag = new Tag({
        ...tag,
        owner: userId,
      });
      return TagType(await newTag.save());
    } catch (e) {
      /* handle error */
      console.error(e);
      throw new Error(errors.tags[e.code]);
    }
  },

  updateTag: async({id, tag}, {userId}) => {
    if (!userId)
      throw new Error('Log in before updateing tag');

    try {
      const updatedTag = await Tag.findOneAndUpdate(
        { _id: id, owner: userId },
        tag,
        {new: true}
      );

      if (!updatedTag)
        throw new Error('Only owner can modify the tag');

      return TagType(updatedTag);
    } catch (e) {
      /* handle error */
      console.error(e);
      throw new Error(errors.tags[e.code]);
    }
  },

  deleteTag: async({id}, {userId}) => {
    if (!userId)
      throw new Error('Login before deleting tags.');

    try {
      const deletedTag = await Tag.findOneAndRemove({ _id: id, owner: userId });
      if (!deletedTag)
        throw new Error('Only the owner can delete the tag.');
      return TagType(deletedTag);
    } catch (e) {
      /* handle error */
      console.error(e);
    }


  },
};

export default tagResolver;
