
var Meta = require('./meta');
var utils = require('./utils');
var url = require('url');

module.exports = Links;

function Links(base) {
  this.base = base || '/';
  this.list = [];
}

Links.prototype.add = function (rel, href, meta) {
  this.list.push({
    rel: rel,
    href: href,
    meta: meta
  });
};

Links.prototype.toObject = function () {
  if (!this.list.length) return;
  var base = this.base;

  return this.list.reduce(function (acc, link) {
    var href = url.resolve(base, link.href);

    if (link.meta) {
      acc[link.rel] = {
        href: href,
        meta: new Meta(link.meta).toObject()
      };
    } else {
      acc[link.rel] = href;
    }

    return acc;
  }, {});
}
