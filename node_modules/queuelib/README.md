[![Build Status](https://travis-ci.org/rook2pawn/node-queuelib.svg?branch=master)](https://travis-ci.org/rook2pawn/node-queuelib)

New!
====
Key value store across series! Just call .done(hash) to store the keys/values of the hash

    queue.series([
        function(lib) {
            lib.done({one:1})
        },
        function(lib) {
            lib.done({two:2})
        },
        function(lib) {
            var x = lib.get('one') + lib.get('two'); // x = 3
            lib.done();
        }
    ]);


You can also use .set(hash)

    queue.series([
        function(lib) {
            lib.set({one:1});
            lib.done()
        },
        function(lib) {
            lib.set({life:42})
            lib.done()
        },
        function(lib) {
            t.equal(43,lib.get('one') + lib.get('life'));
            lib.done();
        }
    ]);


New!
====
Early termination flow control in .series! 
        
    queue.series([
    function(lib,id) {
        // stuff
        lib.terminate(id);
    },
    function(lib) {
        // will be removed
    }
    ]);

.series will generate unique UUID's and enable removal on .terminate(id).



QueueLib
========

Asynchronous queue processor

    - lightweight, simple
    - flow control in series


Methods
=======

.pushAsync(fn)
--------------

    var Q = require('queuelib');
    var queue = new Q;
    
    queue.pushAsync(function(lib) {
        // do something asynchronously
        lib.done();
    });
    
    queue.pushAsync(function(lib) {
        // do something else asynchronously
        lib.done();
    });

.series ([fn1,fn2,..])
----------------------

queue.series([
    function(lib) {
        // do something asynchronously
        lib.done();
    },
    function(lib) {
        // do something else asynchronously
        lib.done();
    }
]);


Example 1
---------


    var Q = require('queuelib');
    var request = require('request');
    var queue = new Q;
    
    queue.pushAsync(function(lib) {
        // do something asynchronously
        request('http://google.com',function(err,response,body) {
            console.log(body);
            lib.done();
        });
    });
    
    queue.pushAsync(function(lib) {
        // do something else asynchronously
        request('http://reddit.com',function(err,response,body) {
            console.log(body);
            lib.done();
        });
        lib.done();
    });

Example 2
---------

    queue.series([
        function(lib) {
            console.log("getting xkcd");
            request('http://xkcd.com',function(err,response,body) {
                console.log(response.headers);
                lib.done();
            });
        },
        function(lib) {
            console.log("getting nmpjs");
            request('http://npmjs.org',function(err,response,body) {
                console.log(response.headers);
                lib.done();
            });
        }
    ]);

Terminating a series early
==========================


.terminate(id)
------------

On any series function, an id will be passed as a second parameter with which you can call .terminate(id)

    queue.series([
        function(lib) {
            console.log("getting xkcd");
            request('http://xkcd.com',function(err,response,body) {
                console.log(response.request.host);
                lib.done();
            });
        },
        function(lib,id) {
            console.log("getting nmpjs");
            request('http://npmjs.org',function(err,response,body) {
                console.log(response.request.host);
                lib.terminate(id);
            });
        },
        function(lib) {
            console.log("getting perl");
            request('http://perl.org',function(err,response,body) {
                console.log(response.request.host);
                lib.done();
            });
        }
    ]);

    queue.pushAsync(function(lib) {
        console.log(list);
        // ['xkcd.com','www.nmpjs.org']
        lib.done();
    });
