const resMessages = require('./res-messages');

const getStatus = function (err) {
  return err.statusCode || 500;
}

const getBody = function (err) {
  if (err.error && err.error.error && err.error.reason) {
    return {
      "error": err.error.error,
      "message": err.error.reason
    }
  } else {
    return resMessages.error.serverError;
  }
}

module.exports = {
  getBody,
  getStatus
}