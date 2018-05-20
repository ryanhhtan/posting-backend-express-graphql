import User from '../../../models/user';
import UserType from './user-type';

const TagType = async(tag) => !tag ? null : await ({
  id: tag._id,
  name: tag.name,
  owner: async() => {
    const owner = await User.findById(tag.owner);
    return UserType(owner);
  },
});

export default TagType;
