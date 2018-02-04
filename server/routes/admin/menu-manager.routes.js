const express = require('express');
const router = express.Router();

const rp = require('request-promise');

const {
  authenticateAdmin
} = require('../../helpers/auth');

const couchdbUrl = process.env.COUCH_DB_URL;
const blogDbName = process.env.BLOG_DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');

router.get('/menu', authenticateAdmin, function (req, res, next) {
  rp.get({
    uri: couchdbUrl + blogDbName + '/menu',
    json: true,
    auth: {
      'user': dbUsername,
      'pass': dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    res.status(200).send({
      "menuItems": response.body.menuItems
    });
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

// FIXME: add validation menu
router.put('/menu', authenticateAdmin, function (req, res, next) {
  if (req.body.menuItems) {
    rp.get({
      uri: couchdbUrl + blogDbName + '/menu',
      json: true,
      auth: {
        'user': dbUsername,
        'pass': dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      let menuDoc = response.body;
      menuDoc.menuItems = req.body.menuItems;
      return rp.put({
        uri: couchdbUrl + blogDbName + '/menu',
        json: true,
        auth: {
          'user': dbUsername,
          'pass': dbPassword
        },
        body: menuDoc,
        resolveWithFullResponse: true
      })
    }).then((response) => {
      res.status(200).send({
        "ok": true,
        "message": "menu updated"
      });
    }).catch((error) => {
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  } else {
    res.status(400).send(resMessages.error.badRequest);
  }
});

module.exports = router;