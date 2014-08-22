var hat = require('hat');

var Secure = function() {
  var _this = this;
  this.setChallengedValue = function(challengedValue) {
    _this.challengedValue = new Buffer(_this.challengedValue).toString('hex');
    _this.challengedValue = parseInt(_this.challengedValue, 16);
  }
  this.compare = function(compareValue) {
    compareValue = new Buffer(compareValue).toString('hex');
    compareValue = parseInt(compareValue, 16);
    return ((_this.challengedValue ^ compareValue) == true)
  }
}

module.exports = function(confDB) {
  var _this = this;
  if (!confDB) {
    ConfDB = require('./confDB');
    _this.confDB = new ConfDB();
  }
  // Retrieve hex representation of authtoken from config
  _this.secure = new Secure();
  _this.secure.setChallengedValue(_this.confDB.data.user.authToken);
  this.validate = function(request, reply, cb) {
    if (_this.secure.Compare(request.params.authToken)) {
      return cb(request, reply);
    } else reply().code(401)
  }
  this.cycleToken = function() {
    var newConf = _this.confDB.data;
    newConf.data.user.authToken = hat(48);
    _this.secure.setChallengedValue(newConf.data.user.authToken);
    confDB.save(newConf);
    return newConf.data.user.authToken;
  }
}