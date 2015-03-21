
var test = require('tape');

test('testSet',function(t) {
    t.plan(1);
    var Q = require('../');
    var queue = new Q;
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
});
