var _         = require('underscore');
var debug     = require('debug')('feathers-react-redux:FeathersMixin');
var pluralize = require('pluralize');

var DEFAULT_OPTIONS = { server_load: true, client_load: false, realtime: false };

var actions;
var app;

module.exports = {
	setFeathersApp: function(new_app) {
		app = new_app;
	},
	setFeathersActions: function(new_actions) {
		actions = new_actions;
	},
	feathers: function(resource, options) {
		options = _.chain(options || {})
			.defaults(DEFAULT_OPTIONS)
			.each(function(value, name) {
				if (!value) {
					return;
				}
				this[name] = _.union(this[name], [resource]);
			}.bind(this))
			.value();

		if (!process.browser && options.server_load) {
			var resources = pluralize(resource);
			var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

			debug('server load for ' + resources);
			this.props.dispatch({
				type:    'SERVER_ACTION',
				payload: {
					type: 'load' + Resources
				}
			});
		}
	},
	// There's pretty much no reason for anything to be in componentWillMount, since feathers() can only be called AFTER it. Anything that would be there should be in feathers().
	componentDidMount: function() {
		_.each(this.client_load, function(resource) {
			var resources = pluralize(resource);
			var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

			debug('client load for ' + resources);
			this.props.dispatch(actions['load' + Resources]());
		}.bind(this));

		_.each(this.realtime, function(resource) {
			var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
			var resources = pluralize(resource);

			this.cleanups = _.chain(['created', 'updated', 'patched', 'removed'])
				.map(function(action) {
					debug('listening for ' + action + ' events for ' + resources);
					var dispatchAction = function(object) {
						debug(action + ' ' + resource, object);
						this.props.dispatch(actions[action + Resource](object));
					}.bind(this);
					app.service('/api/' + resources).on(action, dispatchAction);
					return function() {
						debug('stop listening for ' + action + ' events for ' + resources);
						app.service('/api/' + resources).off(action, dispatchAction);
					};
				}.bind(this))
				.union(this.cleanups)
				.value();
		}.bind(this));
	},
	componentWillUnmount: function() {
		_.each(this.cleanups, _.partial);
	}
};
