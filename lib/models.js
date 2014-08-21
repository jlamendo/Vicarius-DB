module.exports = function(listeners) {
var dulcimer = require('dulcimer');
var binUtil = require('./binUtils.js')
var _ = require('underscore');
var getBytesWithUnit = function(bytes) {
    sep = '';
    if (isNaN(bytes)) {
        return;
    }
    var units = [' B', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'];
    var amountOf2s = Math.floor(Math.log(+bytes) / Math.log(2));
    if (amountOf2s < 1) {
        amountOf2s = 0;
    }
    var i = Math.floor(amountOf2s / 10);
    if (i === 0) {
        i = 1
    };
    bytes = +bytes / Math.pow(2, 10 * i);

    // Rounds to 3 decimals places.
    bytes = bytes.toPrecision(3);
    decLength = bytes.toString().split('.')[1];
    decLength = (decLength) ? decLength.length : 0;
    wholeLength = bytes.toString().split('.')[0].length;
    if (decLength + wholeLength !== 4 && (decLength + wholeLength <= 5)) {
        padding = new Array(5 - (decLength + wholeLength)).join('0');
        if (decLength > 0) {
            bytes = bytes + padding;
        } else {
            bytes = bytes + '.' + padding;
        }
    }

    return bytes + units[i];
};
var hashCode = function(input) {
    var hash = 0,
        i, chr, len;
    if (input.length == 0) return hash;
    for (i = 0, len = input.length; i < len; i++) {
        chr = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};



dulcimer.connect({
    type: 'level',
    path: './dev.db',
});

var schemaSeed = {
    request: {
        model: {
            host: {
                type: 'string'
            },
            port: {
                type: 'number'
            },
            protocol: {
                type: 'string'
            },
            url: {
                type: 'string'
            },
            path: {
                type: 'string'
            },
            httpVersion: {
                type: 'string'
            },
            method: {
                type: 'string'
            },
            headers: {
                type: 'object'
            },
            body: {
                type: 'object'
            },
            referenceId: {
                type: 'string'
            },
            vTime: {
                type: 'number',
                //         private      : true,
            },
            raw: {
                type: 'object',
                private: true,
            },
            rawText: {
                type: 'string',
                derive: function() {
                    return this.raw;
                },
            },
            inScope: {
                type: 'boolean'
            },
            toolFlag: {
                type: 'number'
            },
            messageType: {
                type: 'string'
            },
        },
        opts: {
            name: 'request',
            savePrivate: true,
            saveKey: true
        }
    },
    response: {
        model: {
            statusCode: {
                type: 'number'
            },
            raw: {
                type: 'object',
                private: true,
            },
            rawText: {
                type: 'string',
                derive: function() {
                    return this.raw;
                },
            },
            body: {
                type: 'object'
            },
            headers: {
                type: 'object'
            },
            cookies: {
                type: 'object'
            },
            mimeType: {
                type: 'string'
            },
            host: {
                type: 'string'
            },
            protocol: {
                type: 'string'
            },
            port: {
                type: 'number'
            },
            inScope: {
                type: 'boolean'
            },
            toolFlag: {
                type: 'number'
            },
            messageType: {
                type: 'string'
            },
            vTime: {
                type: 'number',
                //          private      : true,
            },
        },
        opts: {
            name: 'response',
            savePrivate: true,
            saveKey: true,
        }
    },
    httpExchange: {
        children: [
        {
            keyName: 'request',
            modelType: 'foreignCollection',
            modelName: 'request',
        },{
            keyName: 'response',
            modelType: 'foreignCollection',
            modelName: 'response',
        },
        ],
        model: {
            request: {
                foreignCollection: 'request'
            },
            response: {
                foreignCollection: 'response'
            },
            responseRawText: {
                type: 'string'
            },
            requestRawText: {
                type: 'string'
            },
            project: {
                type: 'string'
            },
            id: {
                type: 'string'
            },
            savedAt: {
                type: 'string',
                index: true
            },
            responseTime: {
                type: 'number',
                derive: function() {
                    return parseInt(this.response.vTime) - parseInt(this.request.vTime);
                }
            },
            responseLength: {
                type: 'number',
                derive: function() {
                    return Buffer.byteLength(this.response.rawText, 'utf8');
                }
            },
            host: {
                type: 'string',
                derive: function() {
                    return this.request.host;
                }
            },
            responseLengthText: {
                type: 'string',
                derive: function() {
                    return getBytesWithUnit(this.responseLength)
                }
            },
            responseTimeText: {
                type: 'string',
                derive: function() {
                    return String((parseInt(this.responseTime) * 1.0e-6).toFixed(4)).substring(0, 6) + ' ms';
                }
            },
            requestMethod: {
                type: 'string',
                derive: function() {
                    return this.request.method;
                }
            },
            requestPath: {
                type: 'string',
                derive: function() {
                    if (this.request.path) {
                        return this.request.path.replace(/(=|\?).*/, '');
                    } else {
                        return '/'
                    }
                }
            },
            responseCode: {
                type: 'string',
                derive: function() {
                    return this.response.statusCode;
                }
            },
        },
        opts: {
            name: 'httpExchange',
            saveKey: true
        }
    }
}


    var schema = {};
    var deferred = [];
    var models = Object.keys(schemaSeed);
    Object.keys(schemaSeed).forEach(function(model){
        schemaSeed[model].opts = _.extend(schemaSeed[model].opts, listeners(model));
        if(schemaSeed[model].children){
            deferred.push(model)
        } else {
            schema[model] = new dulcimer.Model(schemaSeed[model].model, schemaSeed[model].opts);
        }
    })
    if(deferred.length>0){
        deferred.forEach(function(parentModel){
            var children;
            schemaSeed[parentModel].children.forEach(function(child){
                schemaSeed[parentModel].model[child.keyName][child.modelType] = schema[child.modelName];
            });
            schema[parentModel] = new dulcimer.Model(schemaSeed[parentModel].model, schemaSeed[parentModel].opts);
        });
    }
    return schema;
}
