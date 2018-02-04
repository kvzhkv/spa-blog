const express = require('express');
const router = express.Router();
const rp = require('request-promise');

// const QuillDeltaToHtml = require('quill-delta-to-html');
// const Delta = require('quill-delta');

const couchdbUrl = process.env.COUCH_DB_URL;
const blogDbName = process.env.BLOG_DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const blogAuthor = process.env.BLOG_AUTHOR;
const instagramLink = process.env.INSTAGRAM_LINK;
const facebookLink = process.env.FACEBOOK_LINK;
const vkLink = process.env.VK_LINK;
const youtubeLink = process.env.YOUTUBE_LINK;

const errorHandler = require('../helpers/error-handler');
const resMessages = require('../helpers/res-messages');

router.get('/info', function (req, res, next) {
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
      menuItems: response.body.menuItems,
      info: {
        blogAuthor,
        instagramLink,
        facebookLink,
        vkLink,
        youtubeLink
      }
    });
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

router.get('/posts', function (req, res, next) {
  // TODO: validation

  rp.get({
    uri: couchdbUrl + blogDbName + `/_design/blog/_view/posts?descending=true&limit=${req.query.limit}&skip=${req.query.skip}`,
    json: true,
    auth: {
      'user': dbUsername,
      'pass': dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    // response.body.rows.map((post) => {
    //   let cuttedPost = new Delta(post.value.text.ops).slice(0, 250);
    //   // console.log(cuttedPost)
    //   let converter = new QuillDeltaToHtml(cuttedPost.ops, {});
    //   post.value.text = converter.convert();
    //   return post;
    // });
    res.status(200).send(response.body);
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  });
});

// FIXME: validation
router.get('/postsbytag/:tag', function (req, res, next) {
  let totalRows = null;
  let tag = decodeURIComponent(req.params.tag);
  // console.log(tag);
  let encodedTag = encodeURIComponent(tag);
  rp.get({
    uri: couchdbUrl + blogDbName + `/_design/blog/_view/tags?key="${encodedTag}"`,
    json: true,
    auth: {
      'user': dbUsername,
      'pass': dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    console.log(response.body);
    totalRows = response.body.rows[0] ? response.body.rows[0].value : 0;
    // console.log(totalRows)
    return rp.get({
      uri: couchdbUrl + blogDbName + `/_design/blog/_view/postsbytags?startkey=["${encodedTag}","3"]&endkey=["${encodedTag}"]&descending=true&limit=${req.query.limit}&skip=${req.query.skip}`,
      json: true,
      auth: {
        'user': dbUsername,
        'pass': dbPassword
      },
      resolveWithFullResponse: true
    });
  }).then((response) => {
    // console.log(response.body) 
    // response.body.rows.map((post) => {
    //   let cuttedPost = new Delta(post.value.text.ops).slice(0, 250);
    //   // console.log(cuttedPost)
    //   let converter = new QuillDeltaToHtml(cuttedPost.ops, {});
    //   post.value.text = converter.convert();
    //   return post;
    // });

    response.body.total_rows = totalRows;

    res.status(200).send(response.body);
  }).catch((error) => {
    // res.send(error);
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  })
});

router.get('/posts/:id', function (req, res, next) {
  rp.get({
    uri: couchdbUrl + blogDbName + '/' + req.params.id,
    json: true,
    auth: {
      'user': dbUsername,
      'pass': dbPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    let post = response.body.post
    // let converter = new QuillDeltaToHtml(response.body.post.text.ops, {});
    // post.text = converter.convert();
    res.send({
      id: response.body._id,
      post: post
    })
  }).catch((error) => {
    res.status(errorHandler.getStatus(error)).send(errorHandler.getBody(error));
  })
});

// router.get('/tags', function (req, res, next) {
//   rp.get({
//     uri: couchdbUrl + blogDbName + '/_design/blog/_view/tags?group=true',
//     json: true,
//     auth: {
//       'user': dbUsername,
//       'pass': dbPassword
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
//     uri: couchdbUrl + blogDbName + '/_design/blog/_view/favorites?descending=true&limit=4',
//     json: true,
//     auth: {
//       'user': dbUsername,
//       'pass': dbPassword
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
