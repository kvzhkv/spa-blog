const express = require('express');
const router = express.Router();

const rp = require('request-promise');

const {
  authenticateAdmin,
  verifyPassword
} = require('../../helpers/auth');

const c = require('../../config/config');

const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');

router.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {
    rp.get({
      uri: c.couchdbUrl + c.blogDbName + '/admin',
      json: true,
      auth: {
        'user': c.dbUsername,
        'pass': c.dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      if (req.body.username === response.body.username && verifyPassword(req.body.password, response.body.password)) {
        req.session.userType = response.body.type;
        req.session.username = response.body.username;
        res.status(200).send(resMessages.success.loggedInAdmin);
      } else {
        res.status(401).send(resMessages.error.wrongAdminCredentials);
      }
    }).catch((error) => {
      // console.log(error);
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  } else {
    res.status(400).send(resMessages.error.badRequest);
  }
});

router.get('/session', authenticateAdmin, function (req, res) {
  res.status(200).send(resMessages.success.sessionActive);
});

router.delete('/logout', authenticateAdmin, function (req, res) {
  req.session.destroy(function () {
    res.clearCookie('auth');
    res.status(200).send(resMessages.success.loggedOut);
  });
});


module.exports = router;