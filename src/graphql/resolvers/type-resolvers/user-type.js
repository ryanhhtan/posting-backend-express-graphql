import Tag from '../../../models/tag';
import TagType from './tag-type';

const UserType = async(user) => !user ? null : ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  mytags: async() => {
    const tags = await Tag.find({owner: user._id});
    return tags.map(tag => TagType(tag));
  },
});

export default UserType;
