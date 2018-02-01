const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  secure: false,
  accessKey: 'PLFBKNHPS0J8LM4HT3LK',
  secretKey: '/MOXFOw5/QLN+8fKrD9CssZKZiuetgH0GRtejsMS'
});

minioClient.makeBucket('media', '', function(err) {
  if (err) return console.log('Error creating bucket.', err)
  console.log('Bucket created successfully');
  minioClient.setBucketPolicy('media', '', Minio.Policy.READONLY, function(err) {
    if (err) return console.log('Error setting policy', err)
    console.log('Bucket policy is set');
    minioClient.listBuckets(function(err, buckets) {
      if (err) return console.log(err)
      console.log('buckets :', buckets)
    })
  })
})