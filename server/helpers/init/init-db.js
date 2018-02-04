const rp = require('request-promise');

const viewsObj = require('./views');

const couchdbUrl = process.env.COUCH_DB_URL;
const blogDbName = process.env.BLOG_DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbAdminUsername = process.env.DB_ADMIN_USERNAME;
const dbAdminPassword = process.env.DB_ADMIN_PASSWORD;

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

const createDb = function () {
  // Creating database
  rp.put({
    uri: couchdbUrl + blogDbName,
    json: true,
    auth: {
      'user': dbAdminUsername,
      'pass': dbAdminPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    console.log('Database is created');
    return rp.put({
      uri: couchdbUrl + blogDbName + '/_security',
      json: true,
      auth: {
        'user': dbAdminUsername,
        'pass': dbAdminPassword
      },
      body: {
        admins: {
          names: [
            dbUsername
          ],
          roles: []
        },
        members: {
          names: [
            dbUsername
          ],
          roles: []
        }
      },
      resolveWithFullResponse: true
    });
  }).then((response) => {
    console.log('Permissions for database are set');
    let docs = views;
    return rp.post({
      uri: couchdbUrl + blogDbName + '/_bulk_docs',
      json: true,
      auth: {
        'user': dbAdminUsername,
        'pass': dbAdminPassword
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
      console.log(`Database "${blogDbName}" exists.`);
    } else {
      console.log('An error occured: ', error);
    }
  });

  // Creating database user
  rp.head({
    uri: couchdbUrl + '_users/org.couchdb.user:' + dbUsername,
    json: true,
    auth: {
      'user': dbAdminUsername,
      'pass': dbAdminPassword
    },
    resolveWithFullResponse: true
  }).then((response) => {
    console.log(`User "${dbUsername}" exists.`);
  }).catch((error) => {
    if (error.statusCode === 404) {
      rp.put({
        uri: couchdbUrl + '_users/org.couchdb.user:' + dbUsername,
        json: true,
        auth: {
          'user': dbAdminUsername,
          'pass': dbAdminPassword
        },
        body: {
          name: dbUsername,
          password: dbPassword,
          roles: [],
          type: 'user'
        },
        resolveWithFullResponse: true
      }).then((response) => {
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
