
var utils = require('./utils');

module.exports = JsonApi;

function JsonApi() {
  this.data = null;
}

JsonApi.prototype.set = function (data) {
  if (!this.data) this.data = {};

  if (!data) {
    this.data = null;
  } else {
    utils.extend(this.data, data);
  }
};

JsonApi.prototype.toObject = function () {
  if (!this.data) return;
  return utils.clone(this.data);
};
