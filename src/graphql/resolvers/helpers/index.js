import Comment from '../../../models/comment';

export const findCommentsOn = async(onId) => {
  let queue = [];
  let target = [];
  queue.push(onId);
  while (queue.length > 0) {
    const id = queue.shift();
    const comments = await Comment.find({comment_on: id}).select('_id');
    comments.forEach(c => {
      queue.push(c._id);
      target.push(c._id);
    });
  }

  // console.log(target);
  return target;
};

export const deleletCommentsOn = async(onId) => {
  const comments = await findCommentsOn(onId);
  const result = await Comment.deleteMany({_id: {$in: comments }});
  return result.ok === 1;
};
