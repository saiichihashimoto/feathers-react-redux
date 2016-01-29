var _        = require('underscore');
var debug    = require('debug')('feathers-react-redux:serverRender');
var ReactDOM = require('react-dom/server');

module.exports = function serverRender(element, store, actions, done_server_actions) {
	done_server_actions = done_server_actions || [];

	var markup            = ReactDOM.renderToString(element);
	var remaining_actions = _.chain(store)
		.result('getState')
		.result('server_actions')
		.difference(done_server_actions)
		.value();

	if (_.isEmpty(remaining_actions)) {
		return Promise.resolve(markup);
	}

	return Promise.all(remaining_actions.map(function(action) {
		debug('execute server action ' + action.type, action.params);
		return store.dispatch(actions[action.type](actions.params));
	}))
	.then(function() {
		return serverRender(element, store, actions, _.union(done_server_actions, remaining_actions));
	});
};
