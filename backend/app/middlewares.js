'use strict';

/**
 * Any custom middleware defined for this application can be included here.
 * @see http://expressjs.com/4x/api.html#middleware for information on ExpressJS
 * middleware and how they work.
 */

/**
 * @description 
 *
 * This is a custom middleware to tighthen security of this web
 * application.  It currently sets headers as recommended by the OWASP
 * ZAP security integration penetration tool.
 */
var securityHeaders = function(req, res, next) {
  // Enable browser protection for XSS
  res.header('X-XSS-Protection', '1; mode=block');
  // Disable content-type sniffing for older browsers
  res.header('X-Content-Type-Options', 'nosniff');
  // Protect against protect against UI redressing style attacks
  res.header('X-Frame-Options', 'DENY');
  next();
};

exports.securityHeaders = securityHeaders;
