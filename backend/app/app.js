'use strict';

var express = require('express');
var https = require('https');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cors = require('cors');
var multer  = require('multer');
var passport = require('passport');

var conf = require('../config');
var middlewares = require('./middlewares');
var controllers = require('./controllers');
var logger = require('./logging');
var auth = require('./auth');

/********************************************/
/* The RESTFul API of Nasara's Candy Basket */
/********************************************/
var api = express();

// Additional Middleware
api.use(middlewares.securityHeaders);
api.use(cors(conf.corsOptions));
api.use(favicon(path.join(__dirname, '/public/icons/favicon.ico')));
api.use(morganLogger('dev'));
api.use(bodyParser.json());
api.use(multer({ 
  dest: path.join(__dirname,'/files/') 
}));
api.use(passport.initialize());
if (process.env.NODE_ENV === 'development') {
  api.use(errorHandler());
}

// Routes
api.get('/', auth.isAuthenticated, controllers.getMeta);
api.get('/basket/candies', auth.isAuthenticated, controllers.getCandies);
api.get('/basket/candies/tags', auth.isAuthenticated, controllers.getTags);
api.get('/basket/candies/tags-by-candies', auth.isAuthenticated, controllers.getTagsByCandies);
api.post('/basket/candies', auth.isAuthenticated, controllers.createCandy);
api.get('/basket/candies/:uuid', auth.isAuthenticated, controllers.getCandy);
api.put('/basket/candies/:uuid', auth.isAuthenticated, controllers.updateCandy);
api.delete('/basket/candies/:uuid', auth.isAuthenticated, controllers.deleteCandy);
api.post('/files', auth.isAuthenticated, controllers.uploadFile);
api.get('/files/:id', auth.isAuthenticated, controllers.downloadFile);
api.use(auth.isAuthenticated, controllers.serve404); // Auth?

// Server
var options = {
  key: conf.key,
  cert: conf.cert
};

https.createServer(options, api).listen(conf.app.port, function(){
  logger.info('Listening on protocol "https", address "0.0.0.0" and port ' + 
              conf.app.port);
});
