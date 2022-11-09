const CommentService = require('../../models/services/commentService');
const ResponseService = require('../../models/services/responseService');

exports.postComment = async (req, res, next) => {
  // const checkBought = await OrderService.isBoughtProduct(
  //   req.user._id,
  //   req.params.productId
  // );
  // if (!checkBought) {
  //   return res
  //     .status(402)
  //     .send({ error: 'Customer have not bought this product yet' });
  // }

  const commentsPerPage = 10;
  const comment = {
    product: req.params.productId,
    user: req.user._id,
    body: req.body.comment,
  };
  CommentService.addComment(comment)
    .then(async c => {
      const comments = await CommentService.getProductComments(
        req.params.productId
      );
      const count = await CommentService.countComments(req.params.productId);
      const responses = await ResponseService.getResponses(comments);
      res.status(201).send({
        comments,
        commentsLastPage: Math.ceil(count / commentsPerPage),
        responses,
      });
    })
    .catch(e => {
      res.status(400).send(e);
    });
};

//input req.params.productId, req.page
//output comments, lastpage
exports.getComments = async (req, res, next) => {
  const commentsPerPage = 10;
  const comments = await CommentService.getProductComments(
    req.params.productId,
    req.query.page
  );
  const count = await CommentService.countComments(req.params.productId);
  const commentsLastPage = Math.ceil(count / commentsPerPage);
  const responses = await ResponseService.getResponses(comments);
  res.status(200).send({ comments, commentsLastPage, responses });
};
