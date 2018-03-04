const rp = require('request-promise');

const c = require('../../config');
const viewsObj = require('./views');

const {
  hashPassword
} = require('../auth');

const views = viewsObj.map((doc) => {
  for (let key in doc.views) {
    if (typeof doc.views[key].map === 'function') {
      doc.views[key].map = doc.views[key].map.toString();
    }
    if (typeof doc.views[key].reduce === 'function') {
      doc.views[key].reduce = doc.views[key].reduce.toString();
    }
  }
  return doc;
});

const createDb = function () {
  // Creating database
  rp.put({
    uri: c.couchdbUrl + c.blogDbName,
    json: true,
    auth: {
      'user': c.dbAdminUsername,
      'pass': c.dbAdminPassword
    },
    resolveWithFullResponse: true
  }).then(() => {
    console.log('Database is created');
    return rp.put({
      uri: c.couchdbUrl + c.blogDbName + '/_security',
      json: true,
      auth: {
        'user': c.dbAdminUsername,
        'pass': c.dbAdminPassword
      },
      body: {
        admins: {
          names: [],
          roles: []
        },
        members: {
          names: [
            c.dbUsername
          ],
          roles: []
        }
      },
      resolveWithFullResponse: true
    });
  }).then(() => {
    console.log('Permissions for database are set');
    let docs = views;
    let adminDoc = {
      _id: 'admin',
      type: 'admin',
      username: c.blogAdminUsername,
      password: hashPassword(c.blogAdminPassword)
    };
    docs.push(adminDoc);
    return rp.post({
      uri: c.couchdbUrl + c.blogDbName + '/_bulk_docs',
      json: true,
      auth: {
        'user': c.dbAdminUsername,
        'pass': c.dbAdminPassword
      },
      body: {
        docs
      },
      resolveWithFullResponse: true
    });
  }).then((response) => {
    console.log('Database is filled with views');
    console.log('Done!')
  }).catch((error) => {
    if (error.error.reason === 'The database could not be created, the file already exists.') {
      console.log(`Database "${c.blogDbName}" exists.`);
    } else {
      console.log('An error occured: ', error);
    }
  });

  // Creating database user
  rp.head({
    uri: c.couchdbUrl + '_users/org.couchdb.user:' + c.dbUsername,
    json: true,
    auth: {
      'user': c.dbAdminUsername,
      'pass': c.dbAdminPassword
    },
    resolveWithFullResponse: true
  }).then(() => {
    console.log(`User "${c.dbUsername}" exists.`);
  }).catch((error) => {
    if (error.statusCode === 404) {
      rp.put({
        uri: c.couchdbUrl + '_users/org.couchdb.user:' + c.dbUsername,
        json: true,
        auth: {
          'user': c.dbAdminUsername,
          'pass': c.dbAdminPassword
        },
        body: {
          name: c.dbUsername,
          password: c.dbPassword,
          roles: [],
          type: 'user'
        },
        resolveWithFullResponse: true
      }).then(() => {
        console.log('User is created');
      }).catch((error) => {
        console.log('An error occured: ', error.message);
      });
    } else {
      console.log('An error occured: ', error.message)
    }
  });

}

module.exports = {
  createDb
}
