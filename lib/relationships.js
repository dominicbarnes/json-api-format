
module.exports = Relationships;

function Relationships() {
  this.list = null;
}

Relationships.prototype.set = function (type, rel) {
  if (!this.data) this.data = {};
  this.data[type] = rel;
};

Relationships.prototype.toObject = function () {
  if (!this.data) return;

  var data = this.data;
  return Object.keys(data).reduce(function (acc, rel) {
    acc[rel] = data[rel].toObject();
    return acc;
  }, {});
}
