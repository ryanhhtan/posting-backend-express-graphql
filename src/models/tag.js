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

TagSchema.index({name: 1, owner: 1}, {unique: true});

/*
// Populate owner when calling 'find'
TagSchema.post('find', async docs => {
  for (let doc of docs) {
    await doc.populate('owner').execPopulate();
  }
});

// Populate owner when calling 'findOne'
// NOTE: 'findeById' would trigger 'findOne'
TagSchema.post('findOne',
  async(doc) => await doc.populate('owner').execPopulate());

TagSchema.post('save', async(doc) => {
  await doc.populate('owner').execPopulate();
});

TagSchema.post('findOneAndUpdate', async(doc) => {
  await doc.populate('owner').execPopulate();
});
*/
const Tag = mongoose.model('Tag', TagSchema);
export default Tag;
