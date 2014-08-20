var logger = require('bucker').createLogger();
module.exports = {
  install: function(server){
  var db;
  var socketWrapper = require('./socketWrapper.js');
  var models = require('./models.js');
  var db = socketWrapper(server, models);

  return {
  httpExchange: {
    index: {
      handler: function(request, reply) {
        if (request.query.index && request.query.searchIndex) {
          db.httpExchange.getByIndex(request.query.index, request.query.searchIndex, {
            bucket: request.query.project,
            depth: 0
          }, function(err, results) {
            if (err) {
              logger.error('\n\n', err);
              logger.error('\n\n', request.url, request.headers);
              return reply().code(500);
            }
            reply(results).code(200);
          })
        } else {
          db.httpExchange.allSortByIndex('savedAt', {
            bucket: request.query.project,
            depth: 0
          }, function(err, results) {
            if (err) {
              logger.error('\n\n', err)
              logger.error('\n\n', request.url, request.headers)
              return reply().code(500);
            }
            reply(results).code(200);
          })
        }
      }
    },
    show: function(request, reply) {
      db.httpExchange.get(request.params.httpExchange_id, {
        bucket: request.query.project,
        depth: 10
      }, function(err, result) {
        if (err) {
          logger.error('\n\n', err)
          logger.error('\n\n', request.url, request.headers)
          return reply().code(500);
        }
        reply(result).code(200);
      })
    },
    create: function(request, reply) {
      db.httpExchange.create({
        request: db.request.create(request.payload.request),
        response: db.response.create(request.payload.response),
        project: request.query.project,
        savedAt: (new Date).getTime(),
      }).save({
        bucket: request.query.project,
      }, function(err, result) {
        if (err) {
          logger.error('\n\n', err)
          logger.error('\n\n', request.url, request.headers)
          return reply().code(500);
        }
        reply(result).code(200);
      })
    },
    update: function(request, reply) {
      db.httpExchange.update(request.params.httpExchange_id, {
        bucket: request.query.project,
      }, function(err, result) {
        if (err) {
          logger.error('\n\n', err)
          logger.error('\n\n', request.url, request.headers)
          return reply().code(500);
        }
        reply(result).code(200);
      })
    },
    patch: function(request, reply) {
      db.httpExchange.update(request.params.httpExchange_id, {
        bucket: request.query.project,
      }, function(err, result) {
        if (err) {
          logger.error('\n\n', err)
          logger.error('\n\n', request.url, request.headers)
          return reply().code(500);
        }
        reply(result).code(200);
      })
    },
    destroy: function(request, reply) {
      db.httpExchange.get(request.params.httpExchange_id, {
        bucket: request.query.project,
        depth: 10
      }, function(err, result) {
          if (err) {
            logger.error('\n\n', err)
            logger.error('\n\n', request.url, request.headers)
            return reply().code(500);
          }
        db.httpExchange.delete(request.params.httpExchange_id, {
          bucket: request.query.project,
          ctx: result
        }, function(err, result) {
          if (err) {
            logger.error('\n\n', err)
            logger.error('\n\n', request.url, request.headers)
            return reply().code(500);
          }
          reply(result).code(200);
        })
      })
    }
  }
}
}
}
