const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_END_POINT,
  port: parseInt(process.env.MINIO_PORT, 10),
  secure: process.env.MINIO_SECURE === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

const createMinioBucket = function () {
  minioClient.makeBucket('media', '', function(err) {
    if (err && err.code === 'BucketAlreadyOwnedByYou') {
      return console.log('Bucket "media" exists.')
    } else if (err) {
      return console.log('Error creating bucket', err)
    }
    console.log('Bucket created successfully');
    minioClient.setBucketPolicy('media', '', Minio.Policy.READONLY, function(err) {
      if (err) return console.log('Error setting policy', err)
      console.log('Bucket policy is set');
      minioClient.listBuckets(function(err, buckets) {
        if (err) return console.log(err)
        console.log('buckets :', buckets)
      })
    })
  });
}

module.exports = {
  createMinioBucket
}