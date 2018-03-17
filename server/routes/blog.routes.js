const express = require('express');
const router = express.Router();
const rp = require('request-promise');

const c = require('../config');

const errorHandler = require('../helpers/error-handler');

router.get('/menu', function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + '/menu',
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    res.status(200).send({
      menuItems: response.body.menuItems
    });
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

router.get('/posts', function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + `/_design/blog/_view/posts?descending=true&limit=${req.query.limit}&skip=${req.query.skip}`,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    res.status(200).send(response.body);
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

router.get('/postsbytag/:tag', function (req, res) {
  let totalRows = null;
  let tag = decodeURIComponent(req.params.tag);
  let encodedTag = encodeURIComponent(tag);
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + `/_design/blog/_view/tags?key="${encodedTag}"`,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    totalRows = response.body.rows[0] ? response.body.rows[0].value : 0;
    return rp.get({
      uri: c.couchdbUrl + c.blogDbName + `/_design/blog/_view/postsbytags?startkey=["${encodedTag}","3"]&endkey=["${encodedTag}"]&descending=true&limit=${req.query.limit}&skip=${req.query.skip}`,
      json: true,
      auth: {
        'user': c.dbUsername,
        'pass': c.dbPassword
      },
      resolveWithFullResponse: true
    });
  }).then((response) => {
    response.body.total_rows = totalRows;
    res.status(200).send(response.body);
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

router.get('/posts/:id', function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    let post = response.body.post;
    res.send({
      id: response.body._id,
      post: post
    });
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

// router.get('/tags', function (req, res, next) {
//   rp.get({
//     uri: c.couchdbUrl + c.blogDbName + '/_design/blog/_view/tags?group=true',
//     json: true,
//     auth: {
//       'user': c.dbUsername,
//       'pass': c.dbPassword
//     },
//     resolveWithFullResponse: true
//   }).then((response) => {
//     let tags = response.body.rows;
//     tags = tags.map(function (item) {
//       return item.key;
//     });
//     res.send({
//       tags
//     });
//   }).catch((error) => {
//     res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
//   });
// });

// router.get('/favorites', function (req, res, next) {
//   rp.get({
//     uri: c.couchdbUrl + c.blogDbName + '/_design/blog/_view/favorites?descending=true&limit=4',
//     json: true,
//     auth: {
//       'user': c.dbUsername,
//       'pass': c.dbPassword
//     },
//     resolveWithFullResponse: true
//   }).then((response) => {
//     // let tags = response.body.rows;
//     res.send(response.body.rows);
//   }).catch((error) => {
//     res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
//   });
// })

module.exports = router;
