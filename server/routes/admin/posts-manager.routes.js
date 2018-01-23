const express = require('express');
const router = express.Router();

const rp = require('request-promise');

// const QuillDeltaToHtml = require('quill-delta-to-html');
const Delta = require('quill-delta');

const {
  authenticateAdmin
} = require('../../helpers/auth');

const config = require('../../config/config.json');

const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');

router.get('/posts', authenticateAdmin, function (req, res, next) {
  // TODO: validation

  rp.get({
      uri: config.couchdbUri + config.blogDbName + `/_design/admin/_view/posts?descending=true&limit=${req.query.limit}&skip=${req.query.skip}`,
      json: true,
      auth: {
        'user': config.dbUsername,
        'pass': config.dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      // response.body.rows.map((post) => {
      //   let cuttedPost = new Delta(post.value.post.text.ops).slice(0, 250);
      //   // console.log(cuttedPost)
      //   let converter = new QuillDeltaToHtml(cuttedPost.ops, {});
      //   post.value.post.text = converter.convert();
      //   return post;
      // });
  
      res.status(200).send(response.body);
    }).catch((error) => {
      // console.log(error);
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  });
  
  //TODO: do i need validation here?
  router.get('/posts/:id', authenticateAdmin, function (req, res, next) {
    rp.get({
      uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
      json: true,
      auth: {
        'user': config.dbUsername,
        'pass': config.dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      res.status(200).send(response.body.post);
    }).catch((error) => {
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  });
  
  // Saving post
  // TODO: add body JSON validation and add technical info
  router.post('/posts', authenticateAdmin, function (req, res, next) {
    if (req.body) {
      let newPost = {
        type: 'post',
        post: req.body,
        published: false
      }
  
      rp.post({
        uri: config.couchdbUri + config.blogDbName,
        json: true,
        auth: {
          'user': config.dbUsername,
          'pass': config.dbPassword
        },
        body: newPost,
        resolveWithFullResponse: true
      }).then((response) => {
        res.status(200).send({
          "ok": true,
          "message": "new post added"
        });
      }).catch((error) => {
        res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
      });
    } else {
      res.status(400).send(resMessages.error.badRequest);
    }
  });
  
  router.put('/posts/:id', authenticateAdmin, function (req, res, next) {
    if (req.body) {
      let updatedPost = req.body;
      rp.get({
        uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
        json: true,
        auth: {
          'user': config.dbUsername,
          'pass': config.dbPassword
        },
        resolveWithFullResponse: true
      }).then((response) => {
        let post = response.body;
        // post.published = false;
        post.post = updatedPost;
  
        return rp.put({
          uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
          json: true,
          auth: {
            'user': config.dbUsername,
            'pass': config.dbPassword
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
  
  router.delete('/posts/:id', authenticateAdmin, function (req, res, next) {
    rp.get({
      uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
      json: true,
      auth: {
        'user': config.dbUsername,
        'pass': config.dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      return rp.delete({
        uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
        json: true,
        headers: {
          'If-Match': response.body._rev
        },
        auth: {
          'user': config.dbUsername,
          'pass': config.dbPassword
        },
        resolveWithFullResponse: true
      })
    }).then((response) => {
      res.status(200).send(response.body);
    }).catch((error) => {
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  });
  
  router.put('/posts/publicate/:id', authenticateAdmin, function (req, res, next) {
    rp.get({
      uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
      json: true,
      auth: {
        'user': config.dbUsername,
        'pass': config.dbPassword
      },
      resolveWithFullResponse: true
    }).then((response) => {
      let postDoc = response.body;
      postDoc.published = !postDoc.published;
      return rp.put({
        uri: config.couchdbUri + config.blogDbName + '/' + req.params.id,
        json: true,
        body: postDoc,
        auth: {
          'user': config.dbUsername,
          'pass': config.dbPassword
        },
        resolveWithFullResponse: true
      })
    }).then((response) => {
      res.status(200).send(response.body);
    }).catch((error) => {
      res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
    });
  });
  

module.exports = router;