
module.exports = function(config, cb){
var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Basic = require('hapi-auth-basic');
var routes = require('./routes.js')



var server = new Hapi.Server(config.DB.host, config.DB.port, {
 cors: {origin: ['http://'+config.GUI.host + ':' + config.GUI.port]}
});

server.pack.register({ plugin: require('mudskipper'), options:{ resources: routes.install(server)} }, function() {

server.start(cb);

});

}
if(!module.parent){
    module.exports({
        DB: {
            host: '127.0.0.1',
            port:'8085'
        },
        GUI: {
            host: '127.0.0.1',
            port:'3000'
        }}, function(){

        console.log('listening on :8085')
    })
}


