var Q = require('../');
var request = require('request');
var queue = new Q;
var list = [];
var test = require('tape');

test('terminate test', function (t) {
    t.plan(2);
    queue.series([
        function(lib) {
            console.log("getting xkcd");
            request('http://xkcd.com',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.done();
            });
        },
        function(lib,id) {
            console.log("getting nmpjs");
            request('http://npmjs.org',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                console.log("Terminating id:" + id);
                lib.terminate(id);
            });
        },
        function(lib) {
            console.log("getting perl");
            request('http://perl.org',function(err,response,body) {
                console.log(response.request.host);
                list.push(response.request.host);
                lib.done();
            });
        }
    ]);
    queue.pushAsync(function(lib) {
        console.log("pushing 1");
        list.push(1);
        lib.done();
    });
    queue.pushAsync(function(lib) {
        t.deepEqual(list,['xkcd.com','www.npmjs.org',1]);
        lib.done();
    }); 
    queue.series([
        function(lib) {
            console.log("PUSHING 2");
            list.push(2);
            lib.done();
        },
        function(lib,id) {
            console.log("testing deep equal 2");
            t.deepEqual(list,['xkcd.com','www.npmjs.org',1,2]);
            console.log("Terminating id:" + id);
            lib.terminate(id);
        },
        function(lib) {
            t.fail('YOU SHOULD NEVER SEE THIS MESSAGE');
        }
    ]);
});
