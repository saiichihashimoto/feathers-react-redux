var _         = require('underscore');
var pluralize = require('pluralize');

module.exports = function(resource) {
	var RESOURCE  = resource.toUpperCase();
	var RESOURCES = pluralize(resource).toUpperCase();

	return function(state, action) {
		switch (action.type) {
			case 'LOADED_' + RESOURCES:
				return _.chain(action.payload)
					.indexBy('id')
					.mapObject(function(obj) {
						return { data: obj };
					})
					.defaults(state)
					.value();
			case 'REMOVED_' + RESOURCE:
				return _.omit(state, action.payload.id);
			default:
				return state || {};
		}
	};
};
