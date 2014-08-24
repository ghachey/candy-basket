'use strict';

/**
 * NOTE - I've opted not to used an extra level of abstraction for the
 * Candy model. The impedance mismatch between the RESTful API of CouchDB
 * and our JSON Candies in Javascript seems, well, small to
 * non-existant. I may realise some benefits in writing a slim abstraction layer here
 * using a Candy Javascript object with convenient CRUD methods on a CouchDB store
 * but, meh...
 */
