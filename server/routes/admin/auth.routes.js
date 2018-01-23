const express = require('express');
const router = express.Router();

const rp = require('request-promise');

const {
  authenticateAdmin
} = require('../../helpers/auth');

const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');


// FIXME: сделать нормальный логин для админа
router.post('/login', function (req, res, next) {
  if (req.body.username === 'admin' && req.body.password === '123456') {
    req.session.username = 'admin';
    res.status(200).send(resMessages.success.loggedInAdmin);
  } else {
    res.status(401).send(resMessages.error.wrongAdminCredentials);
  }
});

router.get('/session', authenticateAdmin, function (req, res, next) {
  res.status(200).send(resMessages.success.sessionActive);
});

router.delete('/logout', authenticateAdmin, function (req, res, next) {
  req.session.destroy(function () {
    res.clearCookie('auth');
    res.status(200).send(resMessages.success.loggedOut);
  });
});


module.exports = router;