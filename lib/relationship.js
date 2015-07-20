
var Links = require('./links');
var Meta = require('./meta');
var Resource = require('./resource');
var utils = require('./utils');

module.exports = Relationship;

function Relationship(base) {
  this.base = base;

  this._links = new Links(base);
  this._meta = new Meta();
}

Relationship.prototype.data = function (type, id) {
  this._data = new Resource(this.base, type, id);
  return this;
};

Relationship.prototype.link = function (rel, href, meta) {
  this._links.add(rel, href, meta);
  return this;
};

Relationship.prototype.meta = function (data) {
  this._meta.set(data);
  return this;
};

Relationship.prototype.toObject = function () {
  return utils.filter({
    links: this._links.toObject(),
    data: this._data && this._data.toObject(),
    meta: this._meta.toObject()
  });
};
