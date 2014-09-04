
  var mmm = require('mmmagic');
  var Magic = mmm.Magic;
  var magic = new Magic(mmm.MAGIC_MIME_ENCODING);
  module.exports= {
    enc: function(unencoded) {
  return new Buffer(unencoded).toString('base64');
    },
    dec: function(encoded) {
  return new Buffer(encoded, 'base64').toString('utf8');
    },
    ifNotBin: function(data, successCB) {
        magic.detect(new Buffer(data), function(err, result) {
          if (result.indexOf('charset=binary') !== -1) {
            return false;
          } else {
            successCB(data);
          }
        }.bind(this))
    },
  }