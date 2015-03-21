MyPost_P = Backbone.Model.extend({
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
		}
});
 
MyPostsCollection_P = Backbone.Collection.extend({
	model: MyPost_P,
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

var MyPosts_P = new MyPostsCollection_P;
 
MyPostView_P = Backbone.View.extend({
	//... is a list tag.
	tagName:  "li",
	// Cache the template function for a single item.
	template: _.template($('#MyPost_P-template').html()),
	events: {
		"click .block"   	: "block",
		"click .del"   		: "del",
		"click .read"   	: "readPosts",
		"click .follow"   	: "follow"
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
		sendCmd("th","ban",{id:this.model.attributes._id});
		//this.model.destroy();
		return this;
	},
	del: function(){
		if(confirm("__("SureRemove")")){
			sendCmd("th","del",{id:this.model.attributes._id});
			this.model.destroy();
			$('#infoModal .txt').html("__("PostRemoved")");
			$('#infoModal').foundation('reveal', 'open');
			setTimeout(function(){$('#infoModal').foundation('reveal', 'close');},3000);
		};
		return this;
	}
});
 
MyPostsCollectionView_P = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	 
	// The MyPosts_P list view is attached to the table body
	el: $("#MyPost_P-list"),
	 
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new MyPostsCollection_P();
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
			var itemView = new MyPostView_P({
				model: item
			});
			// Render the MyPostsCollectionView_P, and append its element
			// to the table
			element.append(itemView.render().el);
		});
		return this;
	}
});


var MyPostsList_P = new MyPostsCollectionView_P({
	collection: MyPosts_P
});
// And render it
MyPostsList_P.render();