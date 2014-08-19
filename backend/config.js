var path = require('path');

var rootPath = path.normalize(__dirname + '/.');
var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'nasaraCandyBasketApi'
    },
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
    port: 3003,
    dbUrl: 'http://localhost:5984/',
    dbName: 'candy_basket'
  }
};

module.exports = config[env];
