var test = require('tape');

var foo = function(cb) {
    setTimeout(function() {
        console.log("beep");
        cb();
    },1000);
}
test('testWaterfallAsync',function(t) {
    t.plan(1);
    var Q = require('../');
    var queue = new Q;
    queue.series([
        function(lib) {
            console.log("before 1");
            foo(function() { 
                lib.done({one:1})
            })
            console.log("after 1");
        },
        function(lib) {
            console.log("before 42");
            foo(function() {
                lib.done({life:42})
            });
            console.log("after 42");
        },
        function(lib) {
            var x = lib.get('one') + lib.get('life');
            console.log(x);
            t.equal(43,x);
            lib.done();
        }
    ]);
});
