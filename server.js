require('http').setMaxHeaderLength(0);
var hapi = require('hapi');
var db = require('./lib/models.js')
var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Basic = require('hapi-auth-basic');

server = hapi.createServer('127.0.0.1', 8085);

var users = {
  example: {
    username: 'example',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // 'secret'
  }
};

var validate = function(username, password, callback) {
  var user = users[username];
  if (!user) {
    return callback(null, false);
  }

  Bcrypt.compare(password, user.password, function(err, isValid) {
    callback(err, isValid, {
      id: user.id,
      name: user.name
    });
  });
};

server.pack.register(Basic, function(err) {
  server.auth.strategy('simple', 'basic', {
    validateFunc: validate
  });

  server.route([{
    method: 'POST',
    path: '/httpExchange/{projectID}',
    config: {
      auth: 'simple'
    },
    handler: function(request, reply) {
      db.httpExchange.create({
        request: db.request.create(request.payload.request),
        response: db.response.create(request.payload.response),
        createdBy: request.auth.credentials.username,
        project: request.params.projectID,
        savedAt: (new Date).getTime(),
      }).save(function() {
        reply().code(200);
      })
    },
  }, {
    method: 'GET',
    path: '/httpExchange/{projectID?}',
    config: {
      auth: 'simple'
    },
    handler: function(request, reply) {
      if (request.query.index && request.query.searchIndex) {
        db.httpExchange.getByIndex(request.query.index, request.query.searchIndex, (function() {
          if (request.params.projectID) {
            return {
              bucket: request.params.projectID,
              depth: 10
            }
          } else {
            {
              return {
                depth: 10
              }
            }
          }
        })(), function(err, results) {
          reply(results);
        })
      } else {
        db.httpExchange.allSortByIndex('savedAt', (function() {
          if (request.params.projectID) {
            return {
              bucket: request.params.projectID,
              depth: 10
            }
          } else {
            {
              return {
                depth: 10
              }
            }
          }
        })(), function(err, results) {
          reply(results);
        })
      }
    },
  }]);
});
server.start();
console.log('DB Server running on port ' + 8085)