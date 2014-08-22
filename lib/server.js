
module.exports = function(config, cb){
var Hapi = require('hapi');
var Bcrypt = require('bcrypt');
var Joi = require('joi');
var installAuth = require('vicarius-auth');
var routes = require('./routes.js')


var server = new Hapi.Server(config.DB.host, config.DB.port, {
 cors: {origin: ['http://'+config.GUI.host + ':' + config.GUI.port]}
});
var resources = routes.install(server)
var auth = installAuth(server);

server.pack.register({ plugin: require('mudskipper'), options:{ resources: resources} }, function() {

server.start(cb);

});

}
if(!module.parent){
    process.env['VICARIUS_DIR']=process.cwd()+'/../vicarius';
    console.log(process.env['VICARIUS_DIR']);
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


