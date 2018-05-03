import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true,
    select: false
  },
  avatar: String
});

const User = mongoose.model('User', UserSchema);

export default User;
