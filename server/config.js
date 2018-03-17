module.exports = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  // CouchDB
  couchdbUrl: process.env.COUCH_DB_URL,
  blogDbName: process.env.BLOG_DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  // Minio server
  minioEndPoint: process.env.MINIO_END_POINT,
  minioSecure: process.env.MINIO_SECURE === 'true',
  minioPort: parseInt(process.env.MINIO_PORT, 10),
  minioAccessKey: process.env.MINIO_ACCESS_KEY,
  minioSecretKey: process.env.MINIO_SECRET_KEY,
  // Redis
  redisEndPoint: process.env.REDIS_END_POINT,
  redisPort: parseInt(process.env.REDIS_PORT, 10),
  redisPrefix: process.env.REDIS_PREFIX,
  // Cookies
  cookieName: process.env.COOKIE_NAME,
  cookieSecret: process.env.COOKIE_SECRET,
  cookieMaxAge: parseInt(process.env.COOKIE_MAX_AGE, 10),
  // Personal info
  // blogTitle: process.env.BLOG_TITLE,
  // instagramLink: process.env.INSTAGRAM_LINK,
  // facebookLink: process.env.FACEBOOK_LINK,
  // vkLink: process.env.VK_LINK,
  // youtubeLink: process.env.YOUTUBE_LINK,
  // init section
  enableInitScripts: process.env.ENABLE_INIT_SCRIPTS === 'true',
  blogAdminUsername: process.env.BLOG_ADMIN_USERNAME,
  blogAdminPassword: process.env.BLOG_ADMIN_PASSWORD,
  dbAdminPassword: process.env.DB_ADMIN_PASSWORD,
  dbAdminUsername: process.env.DB_ADMIN_USERNAME,
};
