var dulcimer = require('dulcimer');
var binUtil = require('./binUtils.js')

dulcimer.connect({
    type     : 'level',
    path     : './dev.db',
});


    var request = new dulcimer.Model(
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
        vTime        : {
            type         : 'number',
   //         private      : true,
        },
        raw          : {
            type         : 'object',
            private      : true,
        },
        rawText      : {
            type         : 'string',
            derive       : function () {
            return this.raw;
            },
        },
        inScope      : {type: 'boolean'},
        toolFlag     : {type: 'number'},
        messageType  : {type: 'string'},
    }, {
        name         : 'request',
        savePrivate  : true,
        saveKey      : true
    });

    var response = new dulcimer.Model(
    {
        statusCode   : {type: 'number'},
        raw          : {
            type         : 'object',
            private      : true,
        },
        rawText      : {
            type         : 'string',
            derive       : function () {
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
        vTime        : {
            type         : 'number',
  //          private      : true,
        },
    }, {
        name         : 'response',
        savePrivate  : true,
        saveKey      : true,
    });


        var httpExchange = new dulcimer.Model({
        request      : {foreignCollection: request},
        response     : {foreignCollection: response},
        project      : {
            type: 'string'
        },
        id           : {
            type: 'string'
        },
        savedAt      : {
            type: 'string',
            index: true
        },
        responseTime : {
            type: 'number',
            derive: function(){
                return parseInt(this.response.vTime) - parseInt(this.request.vTime);
                }
            },
        responseLength : {
            type: 'number',
            derive: function(){
                return Buffer.byteLength(this.response.rawText, 'utf8');
                }
        },

    }, {
        name        : 'httpExchange',
        saveKey     : true
    });


    var schema = {
        request: request,
        response: response,
        httpExchange: httpExchange
}

module.exports = schema;
//module.exports.update = update;