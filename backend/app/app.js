var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var conf = require('../config');
var security = require('./middleware/security');
var controllerApi = require('./controllers/api');


/********************************************/
/* The RESTFul API of Nasara's Candy Basket */
/********************************************/
var api = express();

// Additional Middleware
api.use(security.headers);
api.use(favicon(path.join(__dirname, '/public/icons/favicon.ico')));
api.use(logger('dev'));
api.use(bodyParser.json());
if (process.env.NODE_ENV === 'development') {
  api.use(errorHandler());
}

// Routes
api.get('/', controllerApi.getMeta);
api.post('/basket/candies', controllerApi.createCandy);
api.get('/basket/candies/:uuid', controllerApi.getCandy);
api.put('/basket/candies/:uuid', controllerApi.updateCandy);
api.delete('/basket/candies/:uuid', controllerApi.deleteCandy);
api.get('/basket/candies', controllerApi.getCandies);
api.get('/basket/candies/tags', controllerApi.getTags);
api.get('/basket/candies/tags-by-candies', controllerApi.getTagsByCandies);
api.use(controllerApi.serve404);

// Server
http.createServer(api).listen(conf.port);
