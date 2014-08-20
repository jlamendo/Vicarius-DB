var faye = require('faye');
var fayeServer = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
});

    var listeners = function(modelName) {
        var pushUpdate = function(method, model, url) {
            faye.getClient().publish(url, {
                method: method,
                body: model.toJSON()
            });
        }
        return {
            onSave: function(err, details, next) {
                pushUpdate('POST', details.model, '/' + modelName);
                next();
            },

            onDelete: function(model, next) {
                pushUpdate('DELETE', model, '/' + modelName);
                next();
        },
    }
}

module.exports =  function(server, db) {
        fayeServer.attach(server.listener);
        return db(listeners);
    }

