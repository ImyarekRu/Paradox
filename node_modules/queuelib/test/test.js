var Q = require('../');
var request = require('request');
var queue = new Q;
var test = require('tape');
var list = [];

test('testPushAsyncAndSeries',function(t) {
    t.plan(1);
    queue.pushAsync(function(lib) {
        // do something asynchronously
        console.log("getting google");
        request('http://google.com',function(err,response,body) {
            console.log(response.request.host);
            list.push(response.request.host);
            lib.done();
        });
    });

    queue.pushAsync(function(lib) {
        // do something else asynchronously
        console.log("getting reddit");
        request('http://reddit.com',function(err,response,body) {
            console.log(response.request.host);
            list.push(response.request.host);
            lib.done();
        });
    });


    queue.series([
        function(lib) {
            console.log("getting xkcd");
            request('http://xkcd.com',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.done();
            });
        },
        function(lib) {
            console.log("getting nmpjs");
            request('http://npmjs.org',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.done();
            });
        }
    ]);
    queue.pushAsync(function(lib) {
        console.log("Testing if list matches content and order:");
        console.log(['www.google.com','www.reddit.com','xkcd.com','www.npmjs.org']);
        t.deepEqual(list,['www.google.com','www.reddit.com','xkcd.com','www.npmjs.org'])
        lib.done();
    });
});
