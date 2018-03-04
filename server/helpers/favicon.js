const fresh = require('fresh');
const parseUrl = require('parseurl');

const rp = require('request-promise');

const c = require('../config');

const EXP_TIME = 60 * 60 * 24 * 30 * 1000; // 30 days

function favicon () {

  let icon; // favicon cache

  return function favicon (req, res, next) {
    if (parseUrl(req).pathname !== '/favicon.ico') {
      next();
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = req.method === 'OPTIONS' ? 200 : 405;
      res.setHeader('Allow', 'GET, HEAD, OPTIONS');
      res.setHeader('Content-Length', '0');
      res.send();
      return;
    }

    if (icon) {
      send(req, res, icon);
      return;
    }

    rp.get({
      uri: `http${c.minioSecure ? 's' : ''}://${c.minioEndPoint}:${c.minioPort}/media/favicon.ico`,
      encoding: null,
      resolveWithFullResponse: true
    }).then((response) => {
      icon = createIcon(response.body, response.headers, EXP_TIME);
      send(req, res, icon);
    }).catch((error) => {
      res.statusCode = error.statusCode;
      res.send(error.error);
    });
  };
}

function createIcon (buf, headers, maxAge) {
  return {
    body: buf,
    headers: {
      'Cache-Control': 'public, max-age=' + Math.floor(maxAge / 1000),
      'ETag': headers['etag'],
      'Last-Modified': headers['last-modified']
    }
  };
}

function isFresh (req, res) {
  return fresh(req.headers, {
    'etag': res.getHeader('ETag'),
    'last-modified': res.getHeader('Last-Modified')
  });
}

function send (req, res, icon) {
  // Set headers
  var headers = icon.headers;
  var keys = Object.keys(headers);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    res.setHeader(key, headers[key]);
  }
  // Validate freshness
  if (isFresh(req, res)) {
    res.statusCode = 304;
    res.send();
    return;
  }
  // Send icon
  res.statusCode = 200;
  res.setHeader('Content-Length', icon.body.length);
  res.setHeader('Content-Type', 'image/x-icon');
  res.send(icon.body);
}

module.exports = favicon;