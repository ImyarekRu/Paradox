ChatMsg_P = Backbone.Model.extend({
	// Default attributes for the ChatPeer_P item.
		defaults: function() {
			return {
				nick: "",
				txt: "",
				ts: Date.now()
			};
		}
});
// ChatPeersCollection_P collection
ChatMsgsCollection_P = Backbone.Collection.extend({
	model: ChatMsg_P,
	comparator: function(a, b) {
        if ( a.get("ts") > b.get("ts") ) return 1;
        if ( a.get("ts") < b.get("ts") ) return -1;
        if ( a.get("ts") === b.get("ts") ) return 0;
    },

    initialize: function() {
        this.on('change', function() { this.sort() }, this);
    }
	
});
var ChatMsgs_P=new ChatMsgsCollection_P;
 
ChatMsgView_P = Backbone.View.extend({
	tagName:  "div",
	template: _.template($('#ChatMsg_P-template').html()),
	events: {
		"click .block"   	: "block",
		"click .del"   		: "del",
		"click .read"   	: "readPosts",
		"click .follow"   	: "follow"
	},
	 
	initialize: function(options) {
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});
 
ChatMsgsCollectionView_P = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	 
	// The ChatMsgs_P list view is attached to the table body
	el: $(".ChatMsgs_P-list"),
	 
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new ChatMsgsCollection_P();
        this.collection.on('all', function() { this.render() }, this);
		///////////////////////////////////////////////
		this.collection = options.collection;
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// Bind collection changes to re-rendering
		this.collection.bind('reset', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	 
	render: function() {
		var element = jQuery(this.el);
		// Clear potential old entries first
		element.empty();
		// Go through the collection items
		this.collection.forEach(function(item) {
			// Instantiate a ChatMsgsCollectionItem view for each
			var itemView = new ChatMsgView_P({
				model: item
			});
			// Render the ChatMsgsCollectionView_P, and append its element
			// to the table
			element.append(itemView.render().el);
		});
		var h=0;
		$.each($("#ChatMsgs_P-list  div"),function(i,v){h+=$(v).height()});
		$("#ChatMsgs_P-list").scrollTop(h);
		return this;
	}
});


var ChatMsgsList_P;// = new ChatMsgsCollectionView_P({
//	collection: ChatMsgs_P
//});
// And render it
//ChatMsgsList_P.render();







 // Our base model is "ChatPeer_P"
ChatPeer_P = Backbone.Model.extend({
	// Default attributes for the ChatPeer_P item.
		defaults: function() {
			return {
				nick: "",
				msgs: new ChatMsgsCollection_P,//ChatMsgs_P,
				lastts: Date.now(),
				newmsgcnt: 0,
				banned: 0,
				ifollow: 0,
				followme: 0,
				state:0,
				active:0,
				title:""
				
			};
		}
});
 
// ChatPeersCollection_P collection
ChatPeersCollection_P = Backbone.Collection.extend({
	model: ChatPeer_P,
	comparator: function(a, b) {
        if ( a.get("lastts") < b.get("lastts") ) return 1;
        if ( a.get("lastts") > b.get("lastts") ) return -1;
        if ( a.get("lastts") === b.get("lastts") ) return 0;
    },

    initialize: function() {
        this.on('change', function() { this.sort() }, this);
    },
	add: function (item) {
		if (!( this.findWhere({ destination: item.destination }) )) {
		  Backbone.Collection.prototype.add.call(this, item);
		};
	  }
});

var ChatPeers_P = new ChatPeersCollection_P;

// Views are responsible for rendering stuff on the screen (well,
// into the DOM).
//
// Typically views are instantiated for a model or a collection,
// and they watch for change events in those in order to automatically
// update the data shown on the screen.

 
ChatPeerView_P = Backbone.View.extend({
	//... is a list tag.
	tagName:  "li",
	// Cache the template function for a single item.
	template: _.template($('#ChatPeer_P-template').html()),
	events: {
			"click .topdivchatpeer_P" : "select",
			"click .close"   		: "closechat",
			"click .read"   		: "readPosts",
			"click .block"   		: "block",
			"click .unblock"   		: "unblock",
			"click .follow"   		: "follow",
			"click .unfollow"   	: "unfollow"
	},
	/*		
	initialize: function(options) {
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// If the model changes we need to re-render
		this.model.bind('change', this.render);
	},*/
	initialize: function(options) {
        this.model.on('change:nick', this.renderNick, this);
        this.model.on('change:active', this.renderActive, this);
        this.model.on('change:desc', this.renderDesc, this);
        this.model.on('change:state', this.renderState, this);
        this.model.on('change:banned', this.renderBanned, this);
        this.model.on('change:ifollow', this.renderIfollow, this);
        this.model.on('change:followme', this.renderFollowme, this);
        this.model.on('change:newmsgcnt', this.renderNewmsgcnt, this);
    },
	renderNick: function() {console.log("renderNick");
        $(".nick_P", this.$el).html(_.escape(this.model.get("nick")));
		return this;
    },
	renderDesc: function() {console.log("renderDesc");
        $("a:first", this.$el).attr("title",_.escape(this.model.get("desc")));
		return this;
    },
	renderBanned: function() {console.log("renderBanned");
        var i=parseInt(this.model.get("ifollow"));
		var me=parseInt(this.model.get("followme"));
		var b=parseInt(this.model.get("banned"));
		var c="i"+i+" "+"me"+me+" "+"b"+b+"  secondary button split";
       // $("a:first", this.$el).attr("class",c);
		$("li > a.b0, li > a.b1", this.$el).css("display","none");
		$("li > a.b"+b, this.$el).css("display","block");
		return this;
    },
	renderIfollow: function() {console.log("renderIfollow");
        var i=parseInt(this.model.get("ifollow"));
		var me=parseInt(this.model.get("followme"));
		var b=parseInt(this.model.get("banned"));
		var c="i"+i+" "+"me"+me+" "+"b"+b+"  secondary button split";
        //$("a:first", this.$el).attr("class",c);
		$("li > a.f0, li > a.f1", this.$el).css("display","none");
		$("li a.f"+i, this.$el).css("display","block");
		return this;
    },
	renderFollowme: function() {console.log("renderFollowme");
		var i=parseInt(this.model.get("ifollow"));
		var me=parseInt(this.model.get("followme"));
		var b=parseInt(this.model.get("b"));
		var c="i"+i+" "+"me"+me+" "+"b"+b+"  secondary button split";
        //$("a:first", this.$el).attr("class",c);
		$("li a.c", this.$el).css("display",(me==1)?"block":"none");
		return this;
    },
	
    renderState: function() {
		console.log("renderState");
        $("a > div", this.$el).attr("class","state"+this.model.get("state"));
		switch(this.model.get("state"))
		{
			case "0":this.model.set("title","__("Isoff")");break;
			case "1":this.model.set("title","__("Connecting")");break;
			case "2":this.model.set("title","__("Connected")");break;
		}
		$("a > div", this.$el).attr("title",this.model.get("title"));
		return this;
    },
	renderNewmsgcnt: function() {
		console.log("renderNewmsgcnt");
		$(".newmsgcnt", this.$el).html("New messages: "+this.model.get("newmsgcnt"));
		if (this.model.get("newmsgcnt")>0 && this.model.get("active")==0){
			$(".newmsgcnt", this.$el).css("display","block");
		}
		else if (this.model.get("newmsgcnt")==0){
			$(".newmsgcnt", this.$el).css("display","none");
		};
		return this;
    },
	renderActive: function() {
		console.log("renderActive");
		$(".topdivchatpeer_P", this.$el).removeClass("secondary");
		$(".topdivchatpeer_P", this.$el).removeClass("success");
		$(".topdivchatpeer_P", this.$el).addClass(((this.model.get("active")==1)?("success"):("secondary")));
		return this;
    },
	
    render: function() {
        this
            .renderNick()
            .renderDest()
            .renderState()
            .renderDesc()
            .renderBanned()
            .renderIfollow()
            .renderFollowme()
			.renderActive()
			.renderNewmsgcnt();
    },
	
	
	newitemrender: function() {
		console.log("new item rendering");
		switch(this.model.attributes.state)
		{
			case 0:this.model.attributes.title="__("Isoff")";break;
			case 1:this.model.attributes.title="__("Connecting")";break;
			case 2:this.model.attributes.title="__("Connected")";break;
		}
		this.$el.html(this.template(this.model.toJSON()));
		$("a > div", this.$el).attr("class","state"+this.model.get("state"));
		switch(this.model.get("state"))
		{
			case "0":this.model.set("title","__("Isoff")");break;
			case "1":this.model.set("title","__("Connecting")");break;
			case "2":this.model.set("title","__("Connected")");break;
		}
		$("a > div", this.$el).attr("title",this.model.get("title"));
		$(".newmsgcnt", this.$el).html("__("NewMsgsCnt"): "+this.model.get("newmsgcnt"));
		if (this.model.get("newmsgcnt")>0 && this.model.get("active")==0){
			$(".newmsgcnt", this.$el).css("display","block");
		}
		else if (this.model.get("newmsgcnt")==0){
			$(".newmsgcnt", this.$el).css("display","none");
		};
		return this;
	},
	
	readPosts: function(){
		//this.model.attributes.state=1;
		renderPeersLists_P();
		sendCmd("th","readlast",{destination:this.model.attributes.destination});
		return this;
	},
	block: function(){
		//console.log(this.model);
		sendCmd("th","ban",{id:this.model.attributes._id});
		return this;
	},
	unblock: function(){
		//console.log(this.model);
		sendCmd("th","unban",{id:this.model.attributes._id});
		return this;
	},
	unfollow: function(){
		sendCmd("th","unfollow",{id:this.model.attributes._id, destination:this.model.attributes.destination});
		return this;
	},
	follow: function(){
		sendCmd("th","follow",{id:this.model.attributes._id, destination:this.model.attributes.destination});
		return this;
	},
	select: function(){
		$(".topdivchatpeer_P").removeClass("success");
		$(".topdivchatpeer_P",this.$el).toggleClass("success");
		if(typeof(this.model.collection)!="undefined"){
			for(var i in this.model.collection.models)
			{
				this.model.collection.models[i].set("active",0);
			}
		
			this.model.set("active",1);
			this.model.set("newmsgcnt",0);
		};
		$(".curChatNick_P").html(this.model.attributes.nick);
		$("#chatmsginput_P").css("display","block");
		$("#pickFileB_P").css("display","inline-block");
		//ChatPeersList_P.render();
		ChatMsgsList_P = new ChatMsgsCollectionView_P({	collection: this.model.attributes.msgs });
		ChatMsgsList_P.render();
		return this;
	},
	closechat: function(){
		$(".topdivchatpeer_P").removeClass("success");
		for(var i in this.model.collection.models)
		{
			this.model.collection.models[i].set("active",0);
		}
		$(".curChatNick_P").html("");
		$("#chatmsginput_P,#pickFileB_P").css("display","none");
		this.model.attributes.nick="";
		this.model.attributes.msgs.reset();
		$(this.$el).remove();
		ChatPeers_P.remove(this.model/*,{silent:true}*/);
		$(".chatscnt_P").html(ChatPeers_P.models.length);
		ChatPeersList_P.render();
		//ChatMsgsList_P = new ChatMsgsCollectionView_P({	collection: this.model.attributes.msgs });
		//ChatMsgsList_P.render();
		return this;
	}
	
});
 
ChatPeersCollectionView_P = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	 
	// The ChatPeers_P list view is attached to the table body
	el: $("#ChatPeers_P-list"),
	 
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new ChatPeersCollection_P();
        this.collection.on('all', function() { this.render() }, this);
		///////////////////////////////////////////////
		this.collection = options.collection;
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// Bind collection changes to re-rendering
		this.collection.bind('reset', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	 
	render: function(item) {
		var element = jQuery(this.el);
		//this.el2=jQuery("#IFollow-list");
		// Clear potential old entries first
		element.empty();
		// Go through the collection items
		this.collection.forEach(function(item) {
			var itemView = new ChatPeerView_P({
					model: item
				});
				// Render the KnownsCollectionView_P, and append its element
				// to the table
				element.append(itemView.newitemrender().el);
		});
		/*this.collection.forEach(function(item) {
			console.log("this.collection.forEach(function(item) {");
			if(element.children().length>0){
				element.children().each(function(i) {
					console.log(element.children());
					if(element.children()[i].children() && element.children()[i].children()[0].attr("data-destination")!=item.attributes.destination)
					{
						console.log(item);
					};
				});
				
			}
			else
			{
				// Instantiate a KnownsCollectionItem view for each
				//console.log("known");
				//console.log(item);
				var itemView = new KnownView_P({
					model: item
				});
				// Render the KnownsCollectionView_P, and append its element
				// to the table
				element.append(itemView.newitemrender().el);
			};	
		});
		*/
		/*var itemView = new KnownView_P({
					model: item
				});
				// Render the KnownsCollectionView_P, and append its element
				// to the table
		if(typeof(itemView.newitemrender())!="undefined")element.append(itemView.newitemrender().el);*/
		
		return this;
	}
});


var ChatPeersList_P = new ChatPeersCollectionView_P({
	collection: ChatPeers_P
});
// And render it
ChatPeersList_P.render();