const express = require('express');
const router = express.Router();

const rp = require('request-promise');

const {
  authenticateAdmin
} = require('../../helpers/auth');
const c = require('../../config');
const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');

router.get('/posts', authenticateAdmin, function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + 
      `/_design/admin/_view/posts?descending=true&limit=${req.query.limit}&skip=${req.query.skip}`,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    res.status(200).send(response.body);
  }).catch((error) => {
    // console.log(error);
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

router.get('/posts/:id', authenticateAdmin, function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    res.status(200).send(response.body.post);
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

// Saving post
router.post('/posts', authenticateAdmin, function (req, res) {
  if (req.body) {
    let newPost = {
      type: 'post',
      post: req.body,
      published: false
    };

    newPost.post.tags = newPost.post.tags.map((item) => {
      return item.toLowerCase();
    });

    rp.post({
      uri: c.couchdbUrl + c.blogDbName,
      json: true,
      auth: {
        'user': c.dbUsername,
        'pass': c.dbPassword
      },
      body: newPost,
      resolveWithFullResponse: true
    }).then(() => {
      res.status(200).send({
        'ok': true,
        'message': 'new post added'
      });
    }).catch((error) => {
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  } else {
    res.status(400).send(resMessages.error.badRequest);
  }
});

router.put('/posts/:id', authenticateAdmin, function (req, res) {
  if (req.body) {
    let updatedPost = req.body;

    updatedPost.tags = updatedPost.tags.map((item) => {
      return item.toLowerCase();
    });

    rp.get({
      uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
      json: true,
      auth: {
        'user': c.dbUsername,
        'pass': c.dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      let post = response.body;
      // post.published = false;
      post.post = updatedPost;

      return rp.put({
        uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
        json: true,
        auth: {
          'user': c.dbUsername,
          'pass': c.dbPassword
        },
        body: post,
        resolveWithFullResponse: true
      });
    }).then((response) => {
      res.status(200).send(response.body);
    }).catch((error) => {
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  } else {
    res.status(400).send(resMessages.error.badRequest);
  }
});

router.delete('/posts/:id', authenticateAdmin, function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    return rp.delete({
      uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
      json: true,
      headers: {
        'If-Match': response.body._rev
      },
      auth: {
        'user': c.dbUsername,
        'pass': c.dbPassword
      },
      resolveWithFullResponse: true
    });
  }).then((response) => {
    res.status(200).send(response.body);
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

router.put('/posts/publicate/:id', authenticateAdmin, function (req, res) {
  rp.get({
    uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
    json: true,
    auth: {
      'user': c.dbUsername,
      'pass': c.dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    let postDoc = response.body;
    postDoc.published = !postDoc.published;
    return rp.put({
      uri: c.couchdbUrl + c.blogDbName + '/' + req.params.id,
      json: true,
      body: postDoc,
      auth: {
        'user': c.dbUsername,
        'pass': c.dbPassword
      },
      resolveWithFullResponse: true
    });
  }).then((response) => {
    res.status(200).send(response.body);
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});


module.exports = router;
