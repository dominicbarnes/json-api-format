
var Data = require('./data');
var Errors = require('./errors');
var JsonApi = require('./json-api');
var Links = require('./links');
var Meta = require('./meta');
var Relationship = require('./relationship');
var Resource = require('./resource');
var utils = require('./utils');

// single export
module.exports = Response;

function Response(base) {
  this.base = base;
  this._data = new Data();
  this._errors = new Errors();
  this._meta = new Meta();
  this._jsonapi = new JsonApi();
  this._links = new Links(base);
}

Response.prototype.resource = function (type, id) {
  return new Resource(this.base, type, id);
};

Response.prototype.relationship = function () {
  return new Relationship(this.base);
};

Response.prototype.data = function (resource) {
  this._data.set(resource);
  return this;
};

Response.prototype.error = function (err) {
  this._errors.add(err);
  return this;
};

Response.prototype.meta = function (data) {
  this._meta.set(data);
  return this;
};

Response.prototype.jsonapi = function (data) {
  this._jsonapi.set(data);
  return this;
};

Response.prototype.link = function (rel, href, meta) {
  this._links.add(rel, href, meta);
  return this;
};

Response.prototype.toObject = function () {
  return utils.filter({
    data: this._data.toObject(),
    errors: this._errors.toObject(),
    meta: this._meta.toObject(),
    jsonapi: this._jsonapi.toObject(),
    links: this._links.toObject()
  });
};
