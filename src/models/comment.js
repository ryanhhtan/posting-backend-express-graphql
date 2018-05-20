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

/*

// Populate owner when calling 'find'
CommentSchema.post('find', async docs => {
  for (let doc of docs) {
    await doc.populate('author tags comments').execPopulate();
  }
});


// Populate owner when calling 'findOne'
// NOTE: 'findeById' would trigger 'findOne'
CommentSchema.post('findOne',
  async(doc) => await doc.populate('author tags comments').execPopulate());

CommentSchema.post('save', async(doc) => {
  await doc.populate('author tags comments').execPopulate();
});

// TODO: population on 'update' not implemented yet.

*/
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;

