var path = require('path');

var rootPath = path.normalize(__dirname + '/.');
var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
    url: 'http://localhost',
    port: 3003,
    reloadPort: 35733,
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket_development'    
  },

  test: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
    url: 'http://localhost',
    port: 3003,
    reloadPort: 35733,
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket_test'
      },

  production: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
    url: 'http://localhost',
    port: 3003,
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket'
  }
};

// Exports the config for the currently running environment. It defaults to 'development'
// if NODE_ENV is not set in shell. To run grunt test you could export NODE_ENV=test
// In production make sure NODE_ENV is set to production 
module.exports = config[env]; 
