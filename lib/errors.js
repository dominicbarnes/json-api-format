
var utils = require('./utils');

module.exports = Errors;

function Errors() {
  this.list = [];
}

Errors.prototype.add = function (err) {
  this.list.push(err);
};

Errors.prototype.toObject = function () {
  var list = this.list;
  if (list.length === 0) return;

  return list.map(function (err) {
    if (err instanceof Error) {
      return {
        title: err.name,
        detail: err.message
      };
    } else {
      return utils.clone(err, true);
    }
  });
}
