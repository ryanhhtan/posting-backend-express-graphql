import BaseAdapter from './base-adapter';
import User from '../../models/User'
import md5 from 'js-md5';

class UserAdapter extends BaseAdapter {
  constructor() {
    super(User);
  }

  async create(user) {
    let newUser = new User({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      password: md5(user.password) 
    });

    return await newUser.save();
  }
}

const userAdapter = new UserAdapter();
export default userAdapter; 
