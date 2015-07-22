
var Data = require('./data');
var Links = require('./links');
var Meta = require('./meta');
var Resource = require('./resource');
var utils = require('./utils');

module.exports = Relationship;

function Relationship(base, resource) {
  this.base = base;

  this._data = new Data();
  this._links = new Links(base);
  this._meta = new Meta();

  if (resource) this.data(resource);
}

Relationship.prototype.data = function (resource) {
  var compress = normalize(this.base);

  if (Array.isArray(resource)) {
    this._data.set(resource.map(compress));
  } else {
    this._data.set(compress(resource));
  }

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
    data: this._data.toObject(),
    meta: this._meta.toObject()
  });
};

// private helpers

function normalize(base) {
  return function (resource) {
    return new Resource(base, resource.type, resource.id);
  };
}
