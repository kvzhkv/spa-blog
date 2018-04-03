const express = require('express');
const router = express.Router();
const multer = require('multer');
const Minio = require('minio');

const c = require('../../config/config');

const minioClient = new Minio.Client({
  endPoint: c.minioEndPoint,
  port: c.minioPort,
  secure: c.minioSecure,
  accessKey: c.minioAccessKey,
  secretKey: c.minioSecretKey
});

const {
  authenticateAdmin
} = require('../../helpers/auth');

router.get('/list', authenticateAdmin, function (req, res) {
  let list = [];
  const stream = minioClient.listObjects('media', '', true);

  stream.on('data', function (obj) {
    list.push(obj);
  });
  stream.on('error', function (err) {
    res.status(404).send(err);
  });
  stream.on('end', function () {
    res.send(list);
  });
});

router.put('/file', authenticateAdmin, multer({
  storage: multer.memoryStorage()
}).single('file'), function (req, res) {
  minioClient.putObject('media', req.file.originalname, req.file.buffer, function (err) {
    if (err) {
      return res.send(err);
    }
    res.send({
      'ok': true,
      'message': 'file uploaded',
      'name': req.file.originalname
    });
  });
});

router.delete('/file/:filename', authenticateAdmin, function (req, res) {
  minioClient.removeObject('media', req.params.filename, function (err) {
    if (err) {
      return res.send(err);
    }
    res.send({
      'ok': true,
      'message': 'file removed',
      'name': req.params.filename
    });
  });
});

module.exports = router;
