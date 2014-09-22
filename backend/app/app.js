var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cors = require('cors');
var multer  = require('multer');

var conf = require('../config');
var middlewares = require('./middlewares');
var controllers = require('./controllers');


/********************************************/
/* The RESTFul API of Nasara's Candy Basket */
/********************************************/
var api = express();

// Additional Middleware
api.use(middlewares.securityHeaders);
api.use(cors(conf.corsOptions));
api.use(favicon(path.join(__dirname, '/public/icons/favicon.ico')));
api.use(logger('dev'));
api.use(bodyParser.json());
api.use(multer({ dest: path.join(__dirname,'/uploads/')}));
if (process.env.NODE_ENV === 'development') {
  api.use(errorHandler());
}

// Routes
api.get('/', controllers.getMeta);
api.post('/upload', controllers.uploadFile);
api.get('/basket/candies', controllers.getCandies);
api.get('/basket/candies/tags', controllers.getTags);
api.get('/basket/candies/tags-by-candies', controllers.getTagsByCandies);
api.post('/basket/candies', controllers.createCandy);
api.get('/basket/candies/:uuid', controllers.getCandy);
api.put('/basket/candies/:uuid', controllers.updateCandy);
api.delete('/basket/candies/:uuid', controllers.deleteCandy);
api.use(controllers.serve404);

// Server
http.createServer(api).listen(conf.port);
