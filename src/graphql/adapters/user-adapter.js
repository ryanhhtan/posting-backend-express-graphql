import BaseAdapter from './base-adapter';
import User from '../../models/user';
import md5 from 'js-md5';
import bcrypt from 'bcrypt';

class UserAdapter extends BaseAdapter {
  constructor() {
    super(User);
    this.create = this.create.bind(this);
  }

  async create(userInput) {
    // Get saltRounds value from enviroment variable
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    // console.log(saltRounds);

    // Destruct variables from input
    let { email, password, avatar, name } = userInput;

    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);

    // Generate a default avatar if not present
    if (!avatar)
      avatar = `https://www.gravatar.com/avatar/${md5(email)}?d=mm`;

    let newUser = new User({
      name,
      email,
      avatar,
      password: hash,
    });

    return await newUser.save();
  }

  async login(loginInput) {
    // Destruct variables from input
    const { email, password } = loginInput;
    // console.log(email);
    const potentialUser =
      await User.findOne({email}).select('email password name avatar');

    // console.log(potentialUser);
    if (await bcrypt.compare(password, potentialUser.password)) {
      return potentialUser;
    }
    return null;
  }
}

const userAdapter = new UserAdapter();
export default userAdapter;
