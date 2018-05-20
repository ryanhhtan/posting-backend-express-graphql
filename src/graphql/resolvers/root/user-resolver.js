import md5 from 'js-md5';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import { issueToken } from '../../../authentication/';
import User from '../../../models/user';
import errors from '../../../errors/errors';
import UserType from '../type-resolvers/user-type';

const UserResolvers = {
  register: async(args, context) => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    let {email, password, name } = args.user;
    // console.log(password);
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const avatar = `https://www.gravatar.com/avatar/${md5(email)}?d=mm`;
      const newUser = new User({
        email,
        name,
        password: hash,
        avatar,
      });

      const user = await newUser.save();
      const token = issueToken({id: user._id});
      return {user, token};
    } catch (e) {
      /* handle error */
      console.error(e);
      throw new Error(errors.authentication[e.code]);
    }
  },

  login: async({user}, context) => {
    const { email, password } = user;
    const attempt = await User.findOne({email})
      .select('name email password avatar');
    if (await bcrypt.compare(password, attempt.password)) {
      const token = issueToken({id: attempt.id});
      return {user: attempt, token};
    }
    throw new Error('Invalid email or password');
  },

  me: async(args, {userId}) => UserType(await User.findById(userId)),

  user: async({id}) => UserType(await User.findById(id)),

  users: async({first}) => {
    const users = await User.find().limit(first);
    return users.map(user => UserType(user));
  },
};

export default UserResolvers;
