const ResponseService = require('../../models/services/responseService');

exports.postResponse = async (req, res, next) => {
  const response = {
    comment: req.params.commentId,
    body: req.body.response,
  };

  const newResponse = await ResponseService.addResponse(response);
  res.status(201).send(newResponse);
};
