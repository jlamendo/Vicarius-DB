var faye = require('faye');
var bayeux = new faye.NodeAdapter({
    mount: '/faye',
    timeout: 45
});

    var listeners = function(modelName) {
        var pushUpdate = function(method, model, url) {
            bayeux.getClient().publish(url, {
                method: method,
                body: model.toJSON()
            });
        }
        return {
            onSave: function(err, details, next) {
                pushUpdate('POST', details.model, '/' + modelName + '/' + details.model.project);
                next();
            },

            onDelete: function(model, next) {
                pushUpdate('DELETE', model, '/' + modelName + '/' + details.model.project);
                next();
        },
    }
}

module.exports =  function(server, db) {
        bayeux.attach(server.listener);
        return db(listeners);
    }

