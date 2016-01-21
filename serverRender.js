var _        = require('underscore');
var async    = require('async');
var ReactDOM = require('react-dom/server');

module.exports = function(element, store, actions, callback) {
	var markup;
	var done_server_actions = [];

	async.until(
		function() {
			markup = ReactDOM.renderToString(element);
			return _.chain(store)
				.result('getState')
				.result('server_actions')
				.difference(done_server_actions)
				.isEmpty()
				.value();
		},
		function(callback) {
			var todo_actions = _.chain(store)
				.result('getState')
				.result('server_actions')
				.without(done_server_actions)
				.value();
			async.each(
				todo_actions,
				function(action, callback) {
					store.dispatch(actions[action.type](actions.params)).then(
						function() {
							callback();
						},
						callback
					);
				},
				function(err) {
					done_server_actions = _.union(done_server_actions, todo_actions);
					callback(err);
				}
			);
		},
		function(err) {
			callback(err, markup);
		}
	);
};
