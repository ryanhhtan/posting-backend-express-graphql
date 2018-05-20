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
    autopopulate: true,
  }],

  updated_at: {
    type: Date,
    default: Date.now,
  },

  created_at: {
    type: Date,
  },

});

/*
// Populate owner when calling 'find'
PostSchema.post('find', async docs => {
  for (let doc of docs) {
    await doc.populate('author tags').execPopulate();
  }
});

// Populate owner when calling 'findOne'
// NOTE: 'findeById' would trigger 'findOne'
PostSchema.post('findOne',
  async(doc) => await doc.populate('author tags').execPopulate());

PostSchema.post('save', async(doc) => {
  await doc.populate('author tags').execPopulate();
});

// TODO: population on 'update' not implemented yet.

*/
const Post = mongoose.model('Post', PostSchema);
export default Post;

