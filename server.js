require('http').setMaxHeaderLength(0);
var hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Basic = require('hapi-auth-basic');

server = hapi.createServer('127.0.0.1', 8085, { cors: {origin: ['*']} });
server.route(require('./routes.js'));
server.start();
console.log('DB Server running on port ' + 8085)