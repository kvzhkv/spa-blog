var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var proxy = require('http-proxy-middleware');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var appRoutes = require('./routes/app.routes');
var blogRoutes = require('./routes/blog.routes');
// var adminRoutes = require('./routes/admin.routes');
const adminAuthRoutes = require('./routes/admin/auth.routes');
const adminPostsRoutes = require('./routes/admin/posts-manager.routes');
const adminMenuRoutes = require('./routes/admin/menu-manager.routes');
const adminMediaRoutes = require('./routes/admin/media-manager.routes');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
if (process.env.NODE_ENV === 'production') {
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
}

app.use(logger('dev')); // TODO: как это работает и зачем?

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "OPTIONS, HEAD, GET, POST, PUT, DELETE");
    next();
  });
}

app.use(session({
  secret: '123456',
  cookie: {
    maxAge: 3600000
  },
  name: 'auth',
  saveUninitialized: false,
  resave: true,
  rolling: true,
  store: new RedisStore({
    host: '127.0.0.1',
    port: 6379,
    prefix: 'zhu-session-'
  })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/media', proxy({
  target: process.env.MINIO_URL
}));

// app.use('/media', express.static(path.join(__dirname, 'storage', 'media')));

if (process.env.NODE_ENV === 'development') {
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
app.use(function (req, res, next) {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

module.exports = app;
