var MyProfile_P = Backbone.Model.extend({
	defaults: function() {
		return {
			nick: "empty ...",
			desc: "empty ...",
			mail: "empty ...",
			destination: "empty..."
		};
	}
});
var my_profile_P=new MyProfile_P();
var MyProfileView_P = Backbone.View.extend({
	model:my_profile_P,
	el:$('#MyProfile_P'),
	// Cache the template function for a single item.
	template: _.template($('#MyProfile_P-template').html()),
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});
var MyProfileV_P=new MyProfileView_P;
	