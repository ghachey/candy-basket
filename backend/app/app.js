var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var conf = require('./config');
var security = require('./middleware/security');
var controllerAPI = require('./controllers/api');


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
app.use(controllerWebsite.serveRobots);
api.get('/', controllerAPI.getDocument);
api.post('/basket/candies', controllerAPI.createCandy);
api.get('/basket/candies/:uuid', controllerAPI.getCandy);
api.put('/basket/candies/:uuid', controllerAPI.updateCandy);
api.del('/basket/candies/:uuid', controllerAPI.deleteCandy);
api.get('/basket/candies', controllerAPI.getCandies);
api.get('/basket/candies/tags', controllerAPI.getTags);
api.get('/basket/candies/tags-by-candies', controllerAPI.getTagsByCandies);
app.use(controllerWebsite.serve404);

// Server
http.createServer(api).listen(conf.port);
