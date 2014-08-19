'use strict';

/**
 * This is a custom middleware to tighthen security of this web application.
 * It currently sets headers as recommended by the OWASP ZAP security integration
 * penetration tool.
 */

var headers = function(req, res, next) {
  // Enable browser protection for XSS
  res.header('X-XSS-Protection', '1; mode=block');
  // Disable content-type sniffing for older browsers
  res.header('X-Content-Type-Options', 'nosniff');
  // Protect against protect against UI redressing style attacks
  res.header('X-Frame-Options', 'DENY');
  next();
};

exports.headers = headers;
