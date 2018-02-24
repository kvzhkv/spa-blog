const Minio = require('minio');

const c = require('../../config');

const minioClient = new Minio.Client({
  endPoint: c.minioEndPoint,
  port: c.minioPort,
  secure: c.minioSecure,
  accessKey: c.minioAccessKey,
  secretKey: c.minioSecretKey
});

const createMinioBucket = function () {
  minioClient.makeBucket('media', '', function(err) {
    if (err && err.code === 'BucketAlreadyOwnedByYou') {
      return console.log('Bucket "media" exists.');
    } else if (err) {
      return console.log('Error creating bucket', err);
    }
    console.log('Bucket created successfully');
    minioClient.setBucketPolicy('media', '', Minio.Policy.READONLY, function(err) {
      if (err) return console.log('Error setting policy', err);
      console.log('Bucket policy is set');
      minioClient.listBuckets(function(err, buckets) {
        if (err) return console.log(err);
        console.log('buckets :', buckets);
      });
    });
  });
};

module.exports = {
  createMinioBucket
};