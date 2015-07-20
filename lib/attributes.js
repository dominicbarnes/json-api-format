
var utils = require('./utils');

module.exports = Attributes;

function Attributes(data) {
  this.data = data || null;
}

Attributes.prototype.set = function (data) {
  if (!this.data) this.data = {};

  if (!data) {
    this.data = null;
  } else {
    utils.extend(this.data, data);
  }
};

Attributes.prototype.toObject = function () {
  if (!this.data) return;
  return utils.clone(this.data);
};
