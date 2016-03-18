var _         = require('underscore');
var pluralize = require('pluralize');

module.exports = function(resource) {
	var RESOURCES = pluralize(resource).toUpperCase();

	return function(state, action) {
		switch (action.type) {
			case 'LOAD_' + RESOURCES:
				return _.chain(action.payload)
					.indexBy('id')
					.mapObject(function(obj) {
						return { data: obj };
					})
					.defaults(state)
					.value();
			default:
				return state || {};
		}
	};
};