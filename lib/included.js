
var Resource = require('./resource');
var utils = require('./utils');

module.exports = Included;

function Included() {
  this.list = [];
}

Included.prototype.add = function (resource) {
  if (Array.isArray(resource)) {
    resource.forEach(this.add, this);
  } else {
    if (!(resource instanceof Resource)) {
      throw new TypeError('resource object required');
    }

    this.list.push(resource);
  }
};

Included.prototype.toObject = function () {
  var list = this.list;
  if (list.length === 0) return;

  return list.map(function (resource) {
    return resource.toObject();
  });
}
