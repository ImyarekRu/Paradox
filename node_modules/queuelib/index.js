var EventEmitter = require('events').EventEmitter;
var Hash = require('hashish');
exports = module.exports = qlib;

function qlib(myWorkFunction) {
	this.emitter = new EventEmitter;
	this.queue = [];
    var nextfn = function() { 
        if (this.queue.length > 0) {
            var item = this.queue[0];
            if (item.type == 'sync') {
                this.workSync();
            } else if (item.type == 'async') {
                if (item.series) 
                    this.workAsync_series();
                else 
                    this.workAsync();
            }
        }
	};
	this.emitter.on('next',nextfn.bind(this));
	if (this.emitter.listeners('done').length == 0) {
		this.emitter.on('done',function() { 
            console.log("Queue currently empty. All done.");
        });
	} 
	this.working = false;
    this.workAsync = function() {
        var item = this.queue.shift();
        if (item !== undefined) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            if (item.el === undefined)
			    fn.apply(fn,[this]);
            else 
    			fn.apply(fn,[item.el,this]);
		} 
	};
	this.pushAsync = function(el,fn) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    this.queue.push({fn:el,type:'async'});
        } else 
            this.queue.push({el:el,fn:fn,type:'async'});
		if ((this.queue.length > 0) && (this.working == false)) {
			this.workAsync();
		}
		return this;
	};
    this.workAsync_series = function() {
        var item = this.queue.shift();
        if ((item !== undefined) && (item.series)) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            var id = item.id;
            if (item.el === undefined) {
			    fn.apply(fn,[this,id]);
            } else {
                this.terminate = this.terminate.bind(s);
    			fn.apply(fn,[item.el,this,id]);
            }
		} 
	};
	this.pushAsync_series = function(fn,id) {
        this.queue.push({fn:fn,type:'async',id:id,series:true});
		if ((this.queue.length > 0) && (this.working == false)) {
			this.workAsync_series();
		}
		return this;
	};
    this.workSync = function() {
        var item = this.queue.shift();
        if (item !== undefined) {
            this.working = true;
			var fn = item.fn || myWorkFunction;
            if (item.el === undefined)
			    fn.apply(fn,[this]);
            else 
    			fn.apply(fn,[item.el,this]);
        } 
    };
    this.pushSync = function(el,fn) {
        if ((arguments.length == 1) && (typeof el == 'function')) {
		    this.queue.push({fn:el,type:'sync'});
        } else 
            this.queue.push({el:el,fn:fn,type:'sync'});
        if ((this.queue.length > 0) && (this.working == false)) {
            this.workSync();
        }
    }
    this.hash = {};
    this.get = function(key) {
        return this.hash[key];
    }
    this.set = function(obj) {
        if ((obj) && (typeof obj == 'object')) {
            Hash(this.hash).update(obj);
        }
        return true;
    }
	this.done = function(obj) {
        if ((obj) && (typeof obj == 'object')) {
            Hash(this.hash).update(obj);
        }
        this.working = false;
		this.emitter.emit('next');
	};
    this.terminate = function(id) {
        var tmp = [];
        for (var i = 0; i < this.queue.length; i++) {
            var item = this.queue[i];
            if ((item.id !== undefined) && (item.id == id)) {
                // unsaved
            } else {
                tmp.push(item);
            }
        }
        this.queue = tmp;
        this.done();
/*
        if (this.queue.length > 0) {
            this.done();
        }
*/
    };
    this.series = function(list) {
        var id = String.fromCharCode(~~(Math.random() * 26) + 97).concat((Math.random()+1).toString(36).substr(2,5))
        list.forEach(function(item) {
            this.pushAsync_series(item,id);
        },this);
    }
};
