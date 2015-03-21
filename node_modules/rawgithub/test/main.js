'use strict';

var should = require('should');
var rawgithub = require('../');

require('mocha');
var url = 'https://github.com/stevelacy/gulp-open/blob/master/package.json';

describe('rawgithub', function() {
  it('should get raw file from github url', function(done) {
    rawgithub(url, function(err, data){
      should.not.exist(err);
      should.exist(data);
      data.should.be.type('string');
      done();
    });
  });

  it('should return an error if url is not present', function(done){
    rawgithub(function(err, data){
      should.exist(err);
      err.message.should.equal('url must be defined');
      done();
    });
  });
});
