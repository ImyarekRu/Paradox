var Q = require('../');
var request = require('request');
var queue = new Q;

queue.pushAsync(function(lib) {
    // do something asynchronously
    console.log("getting google");
    request('http://google.com',function(err,response,body) {
        console.log(response.request.host);
        lib.done();
    });
});

queue.pushAsync(function(lib) {
    // do something else asynchronously
    console.log("getting reddit");
    request('http://reddit.com',function(err,response,body) {
        console.log(response.request.host);
        lib.done();
    });
});


queue.series([
    function(lib) {
        console.log("getting xkcd");
        request('http://xkcd.com',function(err,response,body) {
            console.log(response.request.host);
            lib.done();
        });
    },
    function(lib) {
        console.log("getting nmpjs");
        request('http://npmjs.org',function(err,response,body) {
            console.log(response.request.host);
            lib.done();
        });
    }
]);
