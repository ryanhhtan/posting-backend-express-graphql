import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

});

const Tag = mongoose.model('Tag', TagSchema);
export default Tag;
