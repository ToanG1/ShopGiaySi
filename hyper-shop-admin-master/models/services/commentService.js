//từ nay mọi thao tác đến db mình sẽ làm trong folder Service, code cũ sẽ refactor sau
const Comment = require('../comment');
const User = require('../user');

exports.getProductComments = (productId, page = 1) => {
  const commentsPerPage = 10;
  return Comment.find({ product: productId })
    .sort('-postedDate')
    .skip((page - 1) * commentsPerPage)
    .limit(commentsPerPage)
    .populate({
      path: 'user',
      model: User,
    });
};

exports.countComments = productId => {
  return Comment.countDocuments({ product: productId });
};


