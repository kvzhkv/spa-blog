const express = require('express');
const router = express.Router();
const multer = require('multer');
const Minio = require('minio');

const c = require('../../config');

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

// const config = require('../config/config.json');

const errorHandler = require('../../helpers/error-handler');
const resMessages = require('../../helpers/res-messages');

// const mediaDir = 'server/storage/media';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(mediaDir, req.query.path))
//   },
//   filename: function (req, file, cb) {
//     console.log(JSON.stringify(file));
//     cb(null, file.originalname)
//   }
// });

// const upload = multer({
//   storage: storage
// }).single('image');



router.get('/list', authenticateAdmin, function (req, res, next) {
  let list = [];
  const stream = minioClient.listObjects('media', '', true);

  stream.on('data', function (obj) {
    list.push(obj);
    // if (obj.name === '5.jpg') {
    //   throw 'error';
    // }
  });
  stream.on('error', function (err) {
    // console.log('ERR', err);
    res.status(404).send(err);// TODO: statusCode ???
  });
  stream.on('end', function (err) {
    res.send(list);
  });
})

router.put('/file', authenticateAdmin, multer({storage: multer.memoryStorage()}).single('file'), function (req, res, next) {
  // if (req.query.path) {

  //   let link = '';
  //   // console.log(req);
  //   upload(req, res, function (err) {
  //     if (err) {
  //       // An error occurred when uploading
  //       console.log(err);
  //       return res.status(422).send(err);
  //     }
  //     // No error occured.
  //     link = req.file.path;
  //     return res.send({
  //       "ok": true,
  //       "message": "file uploaded",
  //       "path": link
  //     });
  //   })
  // } else {

  // }
  // TODO: проверка на то существоет ли файл
  minioClient.putObject('media', req.file.originalname, req.file.buffer, function(err, etag) {
    if (err) {
      return res.send(err) // TODO: statusCode ???
    }
    res.send({
      "ok": true,
      "message": "file uploaded",
      "name": req.file.originalname
    })
  });
});

router.delete('/file/:filename', authenticateAdmin, function (req, res, next) {
  minioClient.removeObject('media', req.params.filename, function (err) {
    if (err) {
      return res.send(err);// TODO: statusCode ???
    }
    res.send({
      "ok": true,
      "message": "file removed",
      "name": req.params.filename
    })
  })
});

// router.post('/directory', authenticateAdmin, function (req, res, next) {
//   if (req.body.path && req.body.directoryName) {
//     fs.mkdir(path.join(mediaDir, req.body.path, req.body.directoryName), (err) => {
//       if (err) {
//         return res.status(422).send(err);
//       }

//       return res.send({
//         "ok": true,
//         "message": "directory created"
//       })
//     })
//   } else {

//   }
// });

// router.delete('/directory', authenticateAdmin, function (req, res, next) {
//   if (req.query.path) {
//     fs.rmdir(path.join(mediaDir, req.query.path), (err) => {
//       if (err) {
//         return res.status(422).send(err);
//       }

//       return res.send({
//         "ok": true,
//         "message": "directory deleted"
//       })
//     })
//   } else {

//   }
// });

module.exports = router;
