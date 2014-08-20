
module.exports = function(config){
var hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Basic = require('hapi-auth-basic');

server = hapi.createServer(config.DB.host, config.DB.port, {
 cors: {origin: ['http://'+config.GUI.host + ':' + config.GUI.port]}
});
server.route(require('./routes.js'));
server.start();
}