const resMessages = require('./res-messages');

const authenticateAdmin = function (req, res, next) {
  if (req.session.username === 'admin') {
    next();
  } else {
    res.status(401).send(resMessages.error.unauthorizedAdmin);
  }
}

module.exports = {
  authenticateAdmin
}