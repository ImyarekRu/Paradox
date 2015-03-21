var Main;
var locale="ru";
if(locale=='ru')
{
	Main = Backbone.Model.extend({
		defaults: function() {
			return {
				nick: "empty ...",
				desc: "empty ...",
				i2pmail: "empty ..."
			};
		}
	});
	console.log("ru");
}
else
{
	Main = Backbone.Model.extend({
		defaults: function() {
			return {
				nick: "empty ...",
				desc: "empty ...",
				i2pmail: "empty ..."
			};
		}
	});
	console.log("en");
};
var mainpage=new Main();
var MainView = Backbone.View.extend({
	model:mainpage,
	el:$('#container'),
	// Cache the template function for a single item.
	template: _.template($('#Main-template').html()),
	initialize: function() {
		//this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});
var MainV=new MainView;
MainV.render();