
var utils = require('./utils');

module.exports = Meta;

function Meta(data) {
  this.data = data || null;
}

Meta.prototype.set = function (data) {
  if (!this.data) this.data = {};

  if (!data) {
    this.data = null;
  } else {
    utils.extend(this.data, data);
  }
};

Meta.prototype.toObject = function () {
  if (!this.data) return;
  return utils.clone(this.data);
};
