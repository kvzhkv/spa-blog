var express = require('express');
var path = require('path');
// var sfavicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var proxy = require('http-proxy-middleware');
var helmet = require('helmet');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

const favicon = require('./helpers/favicon');

const appRoutes = require('./routes/app.routes');
const blogRoutes = require('./routes/blog.routes');
const adminAuthRoutes = require('./routes/admin/auth.routes');
const adminPostsRoutes = require('./routes/admin/posts-manager.routes');
const adminMenuRoutes = require('./routes/admin/menu-manager.routes');
const adminMediaRoutes = require('./routes/admin/media-manager.routes');

const initMinio = require('./helpers/init/init-minio');
const initDb = require('./helpers/init/init-db');
const c = require('./config');

var app = express();

if (c.enableInitScripts) {
  // enable init-db init-minio
  initMinio.createMinioBucket();
  initDb.createDb();
}


if (c.nodeEnv === 'production') {
  app.use(helmet());
}

app.use(logger('dev')); // TODO: как это работает и зачем?
app.use(favicon());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(cookieParser());

if (c.nodeEnv === 'development') {
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, HEAD, GET, POST, PUT, DELETE');
    next();
  });
}

app.use(session({
  secret: c.cookieSecret,
  cookie: {
    maxAge: c.cookieMaxAge
  },
  name: c.cookieName,
  saveUninitialized: false,
  resave: true,
  rolling: true,
  store: new RedisStore({
    host: c.redisEndPoint,
    port: c.redisPort,
    prefix: c.redisPrefix
  })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/media', proxy({
  target: `http${c.minioSecure ? 's' : ''}://${c.minioEndPoint}:${c.minioPort}`
}));

if (c.nodeEnv === 'development') {
  app.use(function (req, res, next) {
    setTimeout(() => {
      next();
    }, 1000);
  });
}

app.use('/', appRoutes);
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin', adminPostsRoutes);
app.use('/api/admin', adminMenuRoutes);
app.use('/api/admin', adminMediaRoutes);
app.use('/api/blog', blogRoutes);

// catch unknown route and render app
app.use(function (req, res) {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

module.exports = app;
