var db = require('./lib/models.js')
module.exports = [{
    method: 'POST',
    path: '/httpExchange/{projectID}',
    handler: function(request, reply) {
      db.httpExchange.create({
        request: db.request.create(request.payload.request),
        response: db.response.create(request.payload.response),
        project: request.params.projectID,
        savedAt: (new Date).getTime(),
      }).save({
        bucket: request.params.projectID
      }, function() {
        reply().code(200);
      })
    },
  }, {
    method: 'GET',
    path: '/httpExchange/{projectID}/{exchangeID}',
    handler: function(request, reply) {
      db.httpExchange.get(request.params.exchangeID, {
        depth: 5,
        bucket: request.params.projectID
      }, function(err, httpExchange) {
        if (!err) {
          reply(httpExchange).code(200);
        }
      });
    },
  }, {
    method: 'GET',
    path: '/request/{projectID}/{requestID}',
    handler: function(request, reply) {
      db.request.get(request.params.requestID, {
        depth: 5,
        bucket: request.params.projectID
      }, function(err, httpRequest) {
        if (!err) {
          reply(httpRequest).code(200);
        }
      });
    },
  }, {
    method: 'GET',
    path: '/response/{projectID}/{responseID}',
    handler: function(request, reply) {
      db.response.get(request.params.responseID, {
        depth: 5,
        bucket: request.params.projectID
      }, function(err, httpResponse) {
        if (!err) {
          reply(httpResponse).code(200);
        }
      });
    },
  }, {
    method: 'GET',
    path: '/httpExchange/{projectID?}',
    handler: function(request, reply) {
      if (request.query.index && request.query.searchIndex) {
        db.httpExchange.getByIndex(request.query.index, request.query.searchIndex, (function() {
          if (request.params.projectID) {
            return {
              bucket: request.params.projectID,
              depth: 10
            }
          } else {
              return {
                depth: 10
            }
          }
        })(), function(err, results) {
          reply(results.reverse());
        })
      } else {
        db.httpExchange.allSortByIndex('savedAt', (function() {
          if (request.params.projectID) {
            return {
              bucket: request.params.projectID,
              depth: 10
            }
          } else {
              return {
                depth: 10
              }
          }
        })(), function(err, results) {
          reply(results.reverse());
        })
      }
    },
  }]