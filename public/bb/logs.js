//////////////////////////////////////////////////////
 	var LogLine = Backbone.Model.extend({
		
		// Default attributes for the logline item.
		defaults: function() {
			return {
				title: "empty line...",
				ts:this.getTime()
			};
		},
		getTime:function(){
			var now=new Date();
			return now.toLocaleTimeString();//dateFormat(now, "HH:MM:ss");
		}
	});
	var LogLineList = Backbone.Collection.extend({
		model: LogLine
	});

	// Create our global collection of **loglines**.
	LogLines = new LogLineList;
	//LogLines.url= '/some/other/url';

	var LogLineView = Backbone.View.extend({
		//... is a list tag.
		tagName:  "li",
		// Cache the template function for a single item.
		template: _.template($('#LogLine-template').html()),
		events: {
			"click"   : "trash"
		},
		// The loglineView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a **logline** and a **loglineView** in this
		// app, we set a direct reference on the model for convenience.
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		// Re-render the titles of the logline item.
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		trash: function(){
			//console.log(this.model);
			this.model.destroy();
			return this;
		}
		
	});
	
	// The Application
	// ---------------
	// Our overall **AppView** is the top-level piece of UI.
	var LogLineAppView = Backbone.View.extend({
		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: $("#loglineapp"),
		// At initialization we bind to the relevant events on the `loglines`
		// collection, when items are added or changed. Kick LogLines off by
		// loading any preexisting loglines that might be saved in *localStorage*.
		initialize: function() {
			this.listenTo(LogLines, 'add', this.addOne);
			this.main = $('#loglinemain');
			//LogLines.fetch();
		},
		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function() {
			this.main.show();
		},
		// Add a single logline item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function(LogLine) {
			var view = new LogLineView({model: LogLine});
			this.$("#logline-list").append(view.render().el);
		},
		// Add all items in the **loglines** collection at once.
		addAll: function() {
			LogLines.each(this.addOne, this);
		}
	});
	
	var LogLineApp = new LogLineAppView;