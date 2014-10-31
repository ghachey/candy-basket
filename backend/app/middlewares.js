'use strict';

/**
 * Any custom middleware defined for this application can be included here.
 * @see http://expressjs.com/4x/api.html#middleware for information on
 * ExpressJS middleware and how they work. In Express additional
 * functionalities is often added through middleware, small re-usable
 * pieces of software are inserted inside a request/response
 * cycle. Functionalities such as CORS support, error handling,
 * logging, headers modification, data validation and just about
 * everything else that enriches a web application can be done using
 * middleware. The rule here is the same, when it is possible to find
 * acceptable solutions from the community this is the preferred
 * approach, otherwise we need to develop our own. Community
 * contributed middleware is typically installed through npm and
 * configured following their own respective documentation. Our own
 * custom middleware should be right here.
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
