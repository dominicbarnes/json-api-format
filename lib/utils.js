
var extend = exports.extend = require('extend');

exports.clone = function (object, deep) {
  if (deep) {
    return extend(true, {}, object);
  } else {
    return extend({}, object);
  }
};

exports.filter = function (object) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      if (typeof object[key] === 'undefined') {
        delete object[key];
      }
    }
  }

  return object;
};
