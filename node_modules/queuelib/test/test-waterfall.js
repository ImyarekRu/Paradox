var test = require('tape');

test('testWaterfall',function(t) {
    t.plan(1);
    var Q = require('../');
    var queue = new Q;
    queue.series([
        function(lib) {
            lib.done({one:1})
        },
        function(lib) {
            lib.done({life:42})
        },
        function(lib) {
            t.equal(43,lib.get('one') + lib.get('life'));
            lib.done();
        }
    ]);
});
