var dulcimer = require('dulcimer');
var binUtil = require('./binUtils.js')

dulcimer.connect({
    type: 'level',
    path: './dev.db',
    bucket: 'proxyHistory'
});

var schema = {
    user: new dulcimer.Model(
    {
        username    : {type: 'string'},
        password    : {type: 'string'}

    }, {
        name: 'user',
        bucket: 'users'
    }),
    httpExchange: new dulcimer.Model(
    {
        request      : {foreignCollection: 'request'},
        response     : {foreignCollection: 'response'},
        createdBy    : {type: 'string'},
        project      : {type: 'string', index: true},
        savedAt      : {type: 'string', index: true},
    }, {
        name: 'httpExchange'
    }),

    request: new dulcimer.Model(
    {
        host         : {type: 'string'},
        port         : {type: 'number'},
        protocol     : {type: 'string'},
        url          : {type: 'string'},
        path         : {type: 'string'},
        httpVersion  : {type: 'string'},
        method       : {type: 'string'},
        headers      : {type: 'object'},
        body         : {type: 'object'},

        raw          : {
            type: 'object',
            private: true,
        },
        rawText      : {
            type: 'string',
            derive: function () {
            return this.raw;
            },
        },
        inScope      : {type: 'boolean'},
        toolFlag     : {type: 'number'},
        messageType  : {type: 'string'},
    }, {
        name: 'request',
        savePrivate: true
    }),

    response: new dulcimer.Model(
    {
        statusCode   : {type: 'number'},
        raw          : {
            type: 'object',
            private: true,
        },
        rawText      : {
            type: 'string',
            derive: function () {
            return this.raw;
            },
        },
        body         : {type: 'object'},
        headers      : {type: 'object'},
        cookies      : {type: 'object'},
        mimeType     : {type: 'string'},
        host         : {type: 'string'},
        protocol     : {type: 'string'},
        port         : {type: 'number'},
        inScope      : {type: 'boolean'},
        toolFlag     : {type: 'number'},
        messageType  : {type: 'string'},
    }, {
        name: 'response',
        savePrivate: true
    })
}

module.exports = schema;
//module.exports.update = update;