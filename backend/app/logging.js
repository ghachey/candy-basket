'use strict';

var conf = require('../config');
var winston = require('winston');

// Application logging, default transports to console for development.
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: conf.app.debugLevel, 
      colorize: true, 
      timestamp: true
    })
  ]
});

// Transport to be added when starting in production

// Before going to production, get syslog working with errors (and debug on demand)
//require('winston-syslog').Syslog; // exposes `winston.transports.Syslog`
//winston.add(winston.transports.Syslog, options);

// Before going to production, get mail transport for errors
//require('winston-mail').Mail; // exposes `winston.transports.Mail`
//winston.add(winston.transports.Mail, options);

// Seperate exception logger for unhandled exception.
// When in production the exception handler should send email and log a
// critical error to syslog, probably useless to configure this for
// develop as the error will be thrown load and clear in front of my eyes

module.exports = logger;
