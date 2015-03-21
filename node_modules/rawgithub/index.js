'use strict';

var request = require('request');
var defaults = require('lodash.defaults');

module.exports = function(url, opts, cb){
  if (!url || typeof url === 'function'){
    return url(new Error('url must be defined'));
  }
  if (typeof opts === 'function'){
    cb = opts;
    opts = {};
  }

  opts = defaults(opts, {
    base: 'https://raw.githubusercontent.com',
    host: 'github.com'
  });

  var source = opts.base + url.replace('/blob', '').split(opts.host).pop();

  request(source, function(err, res, body){
    if (res.statusCode !== 200){
      return cb(new Error('File status code: ' + res.statusCode));
    }
    return cb(err, body);
  });
};
