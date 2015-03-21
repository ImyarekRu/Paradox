var rtc = require("webrtc-peer");

exports.install = function(self)
{
  if(!rtc.hasWebRTC) return false;
  self.pathSet({type:"webrtc"});

  var conns = {};
  var peers = {};

  function init(initiate,chan,to)
  {
    chan.wrap("TS"); // takes over channel callbacks, creates chan.socket
    peers[to] = chan;

    var pch;
    chan.socket.onopen = function()
    {
      pch = new rtc.peer({initiate:initiate, _self:"self", _peer:to});
      pch.DEBUG = true;
      pch.onsignal = function(signal) {
        console.log("RTC OUT", signal);
        chan.socket.send(JSON.stringify(signal));
      }
      pch.onconnection = function() {
        console.log("RTC CONNECTED");
        conns[to] = pch;
        if(chan.cached) pch.send(chan.cached);
      }
      pch.onmessage = function(safe) {
        self.receive(new Buffer(safe, "base64"),{type:"webrtc"});
      }
    }
    chan.socket.onmessage = function(data) {
      console.log("RTC IN", data);
      try {
        data = JSON.parse(data.data)
      } catch (E) {
        return console.log("rtc parse error", E, data.data)
      }
      pch.signal(data);
    }
  }
  
  self.deliver("webrtc", function(path, msg, to) {
    var safe = msg.toString("base64");
    // have a conn already
    if(conns[to.hashname]) return conns[to.hashname].send(safe);
    // if signalling, just cache the most recent
    if(peers[to.hashname]) return peers[to.hashname].cached = safe;
    // start a new signal path
    var chan = to.start("webrtc", {bare:true});
    // it may be possible for chan send to immediately recurse back here before peers[to] is set, hack around it
    setTimeout(function(){ chan.send({type:"webrtc",js:{open:true}}); },10);
    // initialize signalling
    init(true,chan,to.hashname);
  });

  self.rels["webrtc"] = function(err, packet, chan, cb) {
    cb();
    if(err) return;
    var from = packet.from.hashname;
    // detect simultaneous and prefer the highest
    if(peers[from] && chan.id < peers[from].id) return chan.fail("duplicate");
    chan.send({js:{open:true}});
    init(false,chan,from);
  }
}

