var MyProfile = Backbone.Model.extend({
	defaults: function() {
		return {
			nick: "empty ...",
			desc: "empty ...",
			mail: "empty ...",
			destination: "empty..."
		};
	}
});
var my_profile=new MyProfile();
var MyProfileView = Backbone.View.extend({
	model:my_profile,
	el:$('#MyProfile'),
	// Cache the template function for a single item.
	template: _.template($('#MyProfile-template').html()),
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});
var MyProfileV=new MyProfileView;
	