var _ = require('underscore');
var fs = require('fs');

if(!fs.existsSync + process.env['VICARIUS_DIR'] + '/config/custom.json'){
        fs.writeFileSync(process.env['VICARIUS_DIR'] + '/config/custom.json', fs.readFileSync(process.env['VICARIUS_DIR'] + '/config/default.json').toString());
}
var fileName = process.env['VICARIUS_DIR'] + '/config/custom.json'



module.exports = function(dataDir) {
    var _this = this;
    this.data = require(fileName);
    this.save = function(newConf) {
        if (!_this.data) _this.data = require(fileName) || {};
        _this.data = _.extend(_this.data, newConf);
        fs.writeFileSync(fileName, _this.data)
        return _this.data;
    }
}