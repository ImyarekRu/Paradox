MyPost = Backbone.Model.extend({
	defaults: function() {
			return {
				nick: "empty line...",
				txt: "empty line...",
				src: "empty line...",
				ts: null,
				lts: null,
				destination: "empty line...",
				cmnts:[]
			};
	}/*,
	initialize: function() {
    _.each(this.attributes, function (val, key) {
		  if(key!="ts" && key!="lts")this.set(key, this.sanitize(val));
		}, this);
	},
	sanitize: function (txt) { 
					var bold=/\[b\].*\[b\]/gmi;
					var match=bold.exec(txt);
					if(match){
						for(var i in match){
							txt=txt.replace(match[i].toString(),"<b>"+match[i].toString().substr(3,match[i].toString().length-6)+"</b>");
						};
					};
					
					var myr=/\[.*\]/gmi;
					var match=myr.exec(txt);
					if(match){
						for(var i in match){
							txt=txt.replace(match[i].toString(),"<a href='#' onclick='DownloadFromPeer(\""+match[i].toString().substr(1,match[i].toString().length-2)+"\");'> ссылка </a>");
						};
					};
					//print(txt);					
				
		return _.escape(txt);
	} */
});
 
MyPostsCollection = Backbone.Collection.extend({
	model: MyPost,
	comparator: function(a, b) {
        if ( a.get("lts") < b.get("lts") ) return 1;
        if ( a.get("lts") > b.get("lts") ) return -1;
        if ( a.get("lts") === b.get("lts") ) return 0;
    },

    initialize: function() {
        this.on('change', function() { 
			this.sort();
		}, this);
    }
});

var MyPosts = new MyPostsCollection;
 
MyPostView = Backbone.View.extend({
	//... is a list tag.
	tagName:  "li",
	// Cache the template function for a single item.
	template: _.template($('#MyPost-template').html()),
	events: {
		"click .block"   : "block",
		"click .del"   : "del",
		"click .read"   : "readPosts",
		"click .follow"   : "follow"
	},
	 
	initialize: function(options) {
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// If the model changes we need to re-render
		this.model.bind('change', this.render);
	},
	 
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	block: function(){
		sendCmd("i2p","ban",{id:this.model.attributes._id});
		//this.model.destinationroy();
		return this;
	},
	del: function(){
		if(confirm("__("SureRemove")")){
			sendCmd("i2p","del",{id:this.model.attributes._id});
			this.model.destinationroy();
			$('#infoModal .txt').html("__("PostRemoved")");
			$('#infoModal').foundation('reveal', 'open');
			setTimeout(function(){$('#infoModal').foundation('reveal', 'close');},3000);
		};
		return this;
	}
});
 
MyPostsCollectionView = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	 
	// The MyPosts list view is attached to the table body
	el: $("#MyPost-list"),
	 
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new MyPostsCollection();
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
			// Instantiate a MyPostsCollectionItem view for each
			var itemView = new MyPostView({
				model: item
			});
			// Render the MyPostsCollectionView, and append its element
			// to the table
			element.append(itemView.render().el);
		});
		return this;
	}
});


var MyPostsList = new MyPostsCollectionView({
	collection: MyPosts
});
// And render it
MyPostsList.render();