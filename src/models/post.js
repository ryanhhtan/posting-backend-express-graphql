import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  feature_image_url: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
  },
});

const Post = mongoose.model('Post', PostSchema);
export default Post;

