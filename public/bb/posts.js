// Models are where actual data is kept. They can also be used
// for communicating between the server and the client through
// methods like save() and fetch().
//
// Models are the abstract data and do not know how they are
// supposed to be visualized. But they can perform validations
// to ensure the data is correct.

 
// Our base model is "post"
Post = Backbone.Model.extend({
	defaults: function() {
			return {
				nick: "empty line...",
				text: "empty line...",
				ts: null,
				lts: null,
				destination: "empty line...",
				cmnts:[]
			};
		}
});
 






















// PostsCollection collection
PostsCollection = Backbone.Collection.extend({
	model: Post,
	comparator: function(a, b) {
        if ( a.get("lts") < b.get("lts") ) return 1;
        if ( a.get("lts") > b.get("lts") ) return -1;
        if ( a.get("lts") === b.get("lts") ) return 0;
    },

    initialize: function() {
        this.on('change', function() { this.sort() }, this);
    },
	add: function (item) {
		if (!( this.findWhere({ txt: item.txt }) && this.findWhere({ nick: item.nick}) )) {
		  Backbone.Collection.prototype.add.call(this, item);
		};
	  }
});

var Posts = new PostsCollection;






























// Views are responsible for rendering stuff on the screen (well,
// into the DOM).
//
// Typically views are instantiated for a model or a collection,
// and they watch for change events in those in order to automatically
// update the data shown on the screen.

 
PostView = Backbone.View.extend({
	//... is a list tag.
	tagName:  "li",
	// Cache the template function for a single item.
	template: _.template($('#Post-template').html()),
	initialize: function(options) {
		// Ensure our methods keep the `this` reference to the view itself
		_.bindAll(this, 'render');
		// If the model changes we need to re-render
		this.model.bind('change', this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});
 
PostsCollectionView = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	//collection2: null,
	// The Posts list view is attached to the table body
	el: $("#AllPost-list"),
	 
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new PostsCollection;
        this.collection.on('all', function() { this.render() }, this);
		//this.collection2 = new PostsCollection();
        //this.collection2.on('all', function() { this.render() }, this);
		///////////////////////////////////////////////
		this.collection = options.collection;
		//this.collection2 = MyPosts;
		//this.collection.add(MyPosts.toJSON(), {silent : true});
		//this.collection.add(this.collection2.toJSON(), {silent : true});
		//this.collection2 = options.collection2;
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
		//this.collection.models.concat(this.collection2.models);
		//this.collection.models=_.uniq(this.collection.models);
		//
		
		this.collection.forEach(function(item) {
			// Instantiate a PostsCollectionItem view for each
			var itemView = new PostView({
				model: item
			});
			// Render the PostsCollectionView, and append its element
			// to the table
			element.append(itemView.render().el);
		});
		return this;
	}
});


var PostsList = new PostsCollectionView({
	collection: Posts
});
// And render it
PostsList.render();