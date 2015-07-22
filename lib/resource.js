
var Attributes = require('./attributes');
var Links = require('./links');
var Meta = require('./meta');
var Relationships = require('./relationships');
var utils = require('./utils');

module.exports = Resource;

function Resource(base, type, id) {
  if (!type) throw new RangeError('a resource must have a valid type');
  if (!id) throw new RangeError('a resource must have a valid id');

  this.type = type;
  this.id = id;
  this.base = base;

  this._attributes = new Attributes();
  this._links = new Links(base);
  this._meta = new Meta();
  this._relationships = new Relationships();
}

Resource.prototype.attributes = function (data) {
  this._attributes.set(data);
  return this;
};

Resource.prototype.link = function (rel, href, meta) {
  this._links.add(rel, href, meta);
  return this;
};

Resource.prototype.meta = function (data) {
  this._meta.set(data);
  return this;
};

Resource.prototype.relationship = function (type, rel) {
  this._relationships.set(type, rel);
  return this;
};

Resource.prototype.toObject = function () {
  return utils.filter({
    type: this.type.toString(),
    id: this.id.toString(),
    attributes: this._attributes.toObject(),
    links: this._links.toObject(),
    meta: this._meta.toObject(),
    relationships: this._relationships.toObject()
  });
};
