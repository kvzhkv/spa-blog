const rp = require('request-promise');

const config = require('../config/config.json');

const mockData = require('./mock-data.json');
const viewsObj = require('./views');
const settings = require('./settings.json');

// const views = JSON.stringify(viewsObj, function(key, val) {
//   if (typeof val === 'function') {
//     return val.toString();
//   }
//   return val;
// });

// console.log(viewsObj);

const views = viewsObj.map((doc) => {
  for (key in doc.views) {
    if (typeof doc.views[key].map === 'function') {
      doc.views[key].map = doc.views[key].map.toString();
    }
    if (typeof doc.views[key].reduce === 'function') {
      doc.views[key].reduce = doc.views[key].reduce.toString();
    }
  }
  return doc;
});

// console.log(JSON.stringify(views1, undefined, 2));

// viewsObj[0].views.posts.map = viewsObj[0].views.posts.map.toString();
// viewsObj[1].views.posts.map = viewsObj[1].views.posts.map.toString();
// viewsObj[1].views.postsbytags.map = viewsObj[1].views.postsbytags.map.toString();
// viewsObj[1].views.tags.map = viewsObj[1].views.tags.map.toString();
// viewsObj[1].views.tags.reduce = viewsObj[1].views.tags.reduce.toString();
// viewsObj[1].views.favorites.map = viewsObj[1].views.favorites.map.toString();



// const views = viewsObj;

// console.log(JSON.stringify(views, undefined, 2));

rp.put({
  uri: config.couchdbUri + config.blogDbName,
  json: true,
  auth: {
    'user': config.dbAdminUsername,
    'pass': config.dbAdminPassword
  },
  resolveWithFullResponse: true
}).then((response) => {
  console.log('Status code: ', response.statusCode);
  console.log('Database is created');
  return rp.put({
    uri: config.couchdbUri + '_users/org.couchdb.user:' + config.dbUsername,
    json: true,
    auth: {
      'user': config.dbAdminUsername,
      'pass': config.dbAdminPassword
    },
    body: {
      name: config.dbUsername,
      password: config.dbPassword,
      roles: [],
      type: 'user'
    },
    resolveWithFullResponse: true
  });
}).then((response) => {
  console.log('User is created');
  return rp.put({
    uri: config.couchdbUri + config.blogDbName + '/_security',
    json: true,
    auth: {
      'user': config.dbAdminUsername,
      'pass': config.dbAdminPassword
    },
    body: {
      admins: {
        names: [
          config.dbUsername
        ],
        roles: []
      },
      members: {
        names: [
          config.dbUsername
        ],
        roles: []
      }
    },
    resolveWithFullResponse: true
  });
}).then((response) => {
  console.log('Permissions for database are set');
  let docs = views;
  if (settings.useMockData) {
    docs = docs.concat(mockData);
  }
  // console.log(JSON.stringify(docs, undefined, 2));
  return rp.post({
    uri: config.couchdbUri + config.blogDbName + '/_bulk_docs',
    json: true,
    auth: {
      'user': config.dbAdminUsername,
      'pass': config.dbAdminPassword
    },
    body: {
      docs
    },
    resolveWithFullResponse: true
  });
}).then((response) => {
  console.log('Database is filled with docs');
  console.log('Done!')
}).catch((error) => {
  console.log('An error occured: ', error.message);
});