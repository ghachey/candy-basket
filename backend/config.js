var path = require('path');
var fs = require('fs');

var rootPath = path.normalize(__dirname + '/.');
var env = process.env.NODE_ENV || 'development';

if (env === 'test' || env === 'development') {
  var devKey = fs.readFileSync('certificates/nasara-backend-development.key');
  var devCert = fs.readFileSync('certificates/nasara-backend-development.crt');
  var devDAVCert = fs.readFileSync('certificates/arc.ghachey.info.pem');
} else if (env === 'production') {
  var prodKey = fs.readFileSync('../../certificates/candy-basket-backend-key.pem');
  var prodCert = fs.readFileSync('../../certificates/candy-basket-backend-cert.pem');
  var prodDAVCert = fs.readFileSync('../../certificates/arc.ghachey.info.pem');
} else {
  throw Error('Environment unknown');
}

var config = {
  development: {
    root: rootPath,
    app: {
      debugLeve: 'debug',
      name: 'nasaraCandyBasketApi',
      protocol: 'https',
      address: 'localhost',
      port: 4441,
      reloadPort: 35733
    },
    key: devKey,
    cert: devCert,
    backendUser: 'candy',
    backendPassword: 'P@55word',
    couchdb: {
      url: 'http://localhost:5984/',
      name: 'candy_basket_development'
    },
    // Configure which host is allowed cross origin access to the backend
    // Can take exact strings and regexes
    // DO NOT INCLUDE TRAILING SLASH
    corsOptions: {
      origin: function(origin, callback){
        var whiteListed = ['http://localhost:9000',
                           'https://localhost:9000'].indexOf(origin) !== -1;
        callback(null, whiteListed);
      }
    },
    webdavServer : { // ownCloud test instance
        'host' : 'arc.ghachey.info',
        'username' : 'candy',
        'password' : 'P@55word',
        'protocol' : 'https',
        'port' : 443,
        'ca' : devDAVCert
    },
    'webdavFileLocation' : '/owncloud/remote.php/webdav/documents/development/'
  },

  test: {
    root: rootPath,
    app: {
      debugLevel: 'debug',
      name: 'nasaraCandyBasketApi',
      protocol: 'https',
      address: 'localhost',
      port: 4442,
      reloadPort: 35734  
    },
    key: devKey,
    cert: devCert,
    backendUser: 'candy',
    backendPassword: 'P@55word',
    couchdb: {
      url: 'http://localhost:5984/',
      name: 'candy_basket_test'
    },
    // Configure which host is allowed cross origin access to the backend
    // Can take exact strings and regexes
    // DO NOT INCLUDE TRAILING SLASH
    corsOptions: {
      origin: function(origin, callback){
        var whiteListed = ['http://localhost:9000',
                           'https://localhost:9000'].indexOf(origin) !== -1;
        callback(null, whiteListed);
      }
    },
    webdavServer : { // ownCloud test instance
        'host' : 'arc.ghachey.info',
        'username' : 'candy',
        'password' : 'P@55word',
        'protocol' : 'https',
        'port' : 443,
        'ca' : devDAVCert
    },
    'webdavFileLocation' : '/owncloud/remote.php/webdav/documents/test/'
  },

  production: {
    root: rootPath,
    app: {
      debugLevel: 'warn',
      name: 'nasaraCandyBasketApi',
      protocol: 'https',
      address: 'localhost', // not used; listening on 0.0.0.0
      port: 4443,
      reloadPort: 35735
    },
    key: prodKey,
    cert: prodCert,
    backendUser: 'candy',
    backendPassword: 'P@55word',
    couchdb: {
      url: 'http://localhost:5984/',
      name: 'candy_basket'
    },
    // Configure which host is allowed cross origin access to the backend
    // Can take exact strings and regexes
    // DO NOT INCLUDE TRAILING SLASH
    corsOptions: {
      origin: function(origin, callback){
        var whiteListed = ['https://localhost',
                           'https://candy.pacificpolicy.org.ph',
                           'https://candy.pacificpolicy.org',
                           'https://cb.pacificpolicy.org.vu'].indexOf(origin) !== -1;
        callback(null, whiteListed);
      }
    },
    webdavServer : { // ownCloud test instance
        'host' : 'arc.ghachey.info',
        'username' : 'candy',
        'password' : 'P@55word',
        'protocol' : 'https',
        'port' : 443,
        'ca' : prodDAVCert
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
