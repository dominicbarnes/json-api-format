
var Resource = require('./resource');
var utils = require('./utils');

module.exports = Data;

function Data() {
  this._data = null;
}

Data.prototype.set = function (resource) {
  if (Array.isArray(resource)) {
    resource.forEach(validate);
  } else {
    validate(resource);
  }

  this._data = resource;
};

Data.prototype.toObject = function () {
  var data = this._data;
  if (!data) return;

  if (Array.isArray(data)) {
    return data.map(function (resource) {
      return resource.toObject();
    });
  } else {
    return data.toObject();
  }
};


function validate(object) {
  if (!(object instanceof Resource)) {
    throw new TypeError('resource object required');
  }
}
