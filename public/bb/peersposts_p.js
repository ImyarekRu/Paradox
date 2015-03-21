// Models are where actual data is kept. They can also be used
// for communicating between the server and the client through
// methods like save() and fetch().
//
// Models are the abstract data and do not know how they are
// supposed to be visualized. But they can perform validations
// to ensure the data is correct.

 
// Our base model is "post"
PeersPost_P = Backbone.Model.extend({
	defaults: function() {
			return {
				nick: "empty line...",
				text: "empty line...",
				src: "empty line...",
				ts: null,
				lts: null,
				destination: "empty line...",
				cmnts:[]
			};
		}
});
 
// PeersPostsCollection_P collection
PeersPostsCollection_P = Backbone.Collection.extend({
	model: PeersPost_P,
	comparator: function(a, b) {
        if ( a.get("lts") < b.get("lts") ) return 1;
        if ( a.get("lts") > b.get("lts") ) return -1;
        if ( a.get("lts") === b.get("lts") ) return 0;
    },

    initialize: function() {
		this.on('change', function() { this.sort() }, this);
    }
});

var PeersPosts_P = new PeersPostsCollection_P;

// Views are responsible for rendering stuff on the screen (well,
// into the DOM).
//
// Typically views are instantiated for a model or a collection,
// and they watch for change events in those in order to automatically
// update the data shown on the screen.

 
PeersPostView_P = Backbone.View.extend({
	//... is a list tag.
	tagName:  "li",
	// Cache the template function for a single item.
	template: _.template($('#Post_P-template').html()),
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
 
PeersPostsCollectionView_P = Backbone.View.extend({
	// The collection will be kept here
	collection: null,
	// The PeersPosts_P list view is attached to the table body
	el: $("#PeersPosts_P-list"),
	 
	initialize: function(options) {
		///////////////////////////////////////////////
		this.collection = new PeersPostsCollection_P;
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
			// Instantiate a PeersPostsCollectionItem view for each
			var itemView = new PeersPostView_P({
				model: item
			});
			// Render the PeersPostsCollectionView_P, and append its element
			// to the table
			element.append(itemView.render().el);
		});
		return this;
	}
});


var PeersPostsList_P = new PeersPostsCollectionView_P({
	collection: PeersPosts_P
});
// And render it
PeersPostsList_P.render();