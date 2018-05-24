import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },

  body: String,

  comment_on: {
    type: Schema.Types.ObjectId,
  },

  created_at: {
    type: Date,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;

