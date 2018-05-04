import userAdapter from '../adapters/user-adapter';
import { issueToken } from '../../authentication/';

const UserResolver = {
  user: async({id}) => {
    return await userAdapter.get(id);
  },

  register: async({user}) => {
    // console.log(user);
    const newUser = await userAdapter.create(user);
    const token = issueToken({id: newUser._id});
    return {
      user: newUser,
      token,
    };
  },

  login: async({user}) => {
    const validUser = await userAdapter.login(user);
    if (!validUser)
      return {
        user: null,
        token: null,
      };

    const token = await issueToken({id: validUser._id});
    return {
      user: validUser,
      token,
    };

  },

  me: async(_, {userId}) => {
    return await userAdapter.get(userId);
  },
};

export default UserResolver;
