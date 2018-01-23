const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const rp = require('request-promise');
const dirTree = require('../../helpers/directory-tree');

const {
  authenticateAdmin
} = require('../../helpers/auth');

// const config = require('../config/config.json');

const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');

const mediaDir = 'server/storage/media';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(mediaDir, req.query.path))
  },
  filename: function (req, file, cb) {
    console.log(JSON.stringify(file));
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage
}).single('image');



router.get('/tree', authenticateAdmin, function (req, res, next) {
  const dir = dirTree(mediaDir);
  res.send(dir);
})

router.post('/file', authenticateAdmin, function (req, res, next) {
  console.log();
  if (req.query.path) { //TODO: add validation clear '../'

    let link = '';
    // console.log(req);
    upload(req, res, function (err) {
      if (err) {
        // An error occurred when uploading
        console.log(err);
        return res.status(422).send(err);
      }
      // No error occured.
      link = req.file.path;
      return res.send({
        "ok": true,
        "message": "file uploaded",
        "path": link
      });
    })
  } else {

  }
});

router.delete('/file', authenticateAdmin, function (req, res, next) {
  if (req.query.path) { // TODO: validation clear '../'
    fs.unlink(req.query.path, (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.send({
        "ok": true,
        "message": "file deleted"
      });
    })
  }
});

router.post('/directory', authenticateAdmin, function (req, res, next) {
  if (req.body.path && req.body.directoryName) {
    fs.mkdir(path.join(mediaDir, req.body.path, req.body.directoryName), (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.send({
        "ok": true,
        "message": "directory created"
      })
    })
  } else {

  }
});

router.delete('/directory', authenticateAdmin, function (req, res, next) {
  if (req.query.path) {
    fs.rmdir(path.join(mediaDir, req.query.path), (err) => {
      if (err) {
        return res.status(422).send(err);
      }

      return res.send({
        "ok": true,
        "message": "directory deleted"
      })
    })
  } else {

  }
});

module.exports = router;
