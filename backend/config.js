var path = require('path');
var fs = require('fs');

var rootPath = path.normalize(__dirname + '/.');
var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
    url: 'https://localhost',
    port: 3003,
    key: fs.readFileSync('certificates/nasara-backend-development.key'),
    cert: fs.readFileSync('certificates/nasara-backend-development.crt'),
    backendUser: 'candy',
    backendPassword: 'P@55word',
    reloadPort: 35733,
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket_development',
    // Configure which host is allowed cross origin access to the backend
    // Can take exact strings and regexes
    // DO NOT INCLUDE TRAILING SLASH
    corsOptions: {
      origin: 'http://localhost:9003' //'http://localhost:9003' // frontend
    },
    webdavServer : { // ownCloud test instance
        'host' : 'arc.ghachey.info',
        'username' : 'candy',
        'password' : 'P@55word',
        'protocol' : 'https',
        'port' : 443,
        'ca' : fs.readFileSync('certificates/arc.ghachey.info.pem')
    },
    'webdavFileLocation' : '/owncloud/remote.php/webdav/documents/development/'
  },

  test: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
    url: 'https://localhost',
    port: 3003,
    key: fs.readFileSync('certificates/nasara-backend-development.key'),
    cert: fs.readFileSync('certificates/nasara-backend-development.crt'),
    backendUser: 'candy',
    backendPassword: 'P@55word',
    reloadPort: 35733,
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket_test',
    webdavServer : { // ownCloud test instance
        'host' : 'arc.ghachey.info',
        'username' : 'candy',
        'password' : 'P@55word',
        'protocol' : 'https',
        'port' : 443,
        'ca' : fs.readFileSync('certificates/arc.ghachey.info.pem')
    },
    'webdavFileLocation' : '/owncloud/remote.php/webdav/documents/test/'
  },

  production: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
    url: 'https://localhost',
    port: 4443,
    key: fs.readFileSync('certificates/nasara-backend-development.key'), // change
    cert: fs.readFileSync('certificates/nasara-backend-development.crt'), // change
    backendUser: 'candy',
    backendPassword: 'P@55word',
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket',
    // Configure which host is allowed cross origin access to the backend
    // Can take exact strings and regexes
    // DO NOT INCLUDE TRAILING SLASH
    corsOptions: {
      'origin': 'https://candy.pacificpolicy.org.ph' // production frontend
    },
    webdavServer : { // ownCloud test instance
        'host' : 'arc.ghachey.info',
        'username' : 'candy',
        'password' : 'P@55word',
        'protocol' : 'https',
        'port' : 443,
        'ca' : fs.readFileSync('certificates/arc.ghachey.info.pem')
    },
    'webdavFileLocation' : '/owncloud/remote.php/webdav/documents/'
  }
};

// Note on ownCloud
// Files all go in a single location specified here
// This folder does not even have to be shared at the moment as the backend connect
// to the ownCloud using the user who owns the directory and the files.
// However, only authenticated users from frontend will be able to access the 
// attachment.

// Exports the config for the currently running environment. It defaults to 'development'
// if NODE_ENV is not set in shell. To run grunt test you could export NODE_ENV=test
// In production make sure NODE_ENV is set to production 
module.exports = config[env]; 
