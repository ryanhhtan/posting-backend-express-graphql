import userAdapter from '../adapters/user-adapter';
import { issueToken } from '../../authentication/';

const UserResolver = {
  user: async({id}) => {
    try {
      return await userAdapter.get(id);
    } catch (e) {
      console.error(e);
      throw new Error('User not found');
    }
  },

  register: async({user}) => {
    // console.log(user);

    try {
      const newUser = await userAdapter.create(user);
      const token = issueToken({id: newUser._id});
      return {
        user: newUser,
        token,
      };
    } catch (e) {
      /* handle error */
      console.error(e);
      throw new Error('Email already taken');
    }
  },

  login: async({user}) => {
    try {
      const validUser = await userAdapter.login(user);
      const token = await issueToken({id: validUser._id});
      return {
        user: validUser,
        token,
      };
    } catch (e) {
      /* handle error */
      console.error(e);
      throw new Error('Invalid email or password');
    }

  },

  me: async(_, {userId}) => {
    try {
      return await userAdapter.get(userId);
    } catch (e) {
      /* handle error */
      console.error(e);
      throw new Error('Invalid email or password');
    }
  },
};

export default UserResolver;
