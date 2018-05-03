import userAdapter from '../adapters/user-adapter' 

const UserResolver = {
  user: async ({id}) => {
    return await userAdapter.get(id);
  }
};

export default UserResolver;
