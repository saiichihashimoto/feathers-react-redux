var _         = require('underscore');
var pluralize = require('pluralize');

module.exports = function(resource) {
	var RESOURCE  = resource.toUpperCase();
	var RESOURCES = pluralize(resource).toUpperCase();

	return function(state, action) {
		switch (action.type) {
			case 'LOADED_' + RESOURCES:
				return _.chain(action.payload)
					.filter(function(obj) {
						if (!_.result(state, obj.id)) {
							return true;
						}
						return state[obj.id].__v <= obj.__v;
					})
					.indexBy('id')
					.defaults(state)
					.value();
			case 'LOADED_' + RESOURCE:
			case 'CREATED_' + RESOURCE:
			case 'UPDATED_' + RESOURCE:
				if (_.result(state, action.payload.id) && state[action.payload.id].__v > action.payload.__v) {
					return state || {};
				}
				state = _.clone(state);
				state[action.payload.id] = action.payload;
				return state;
			case 'REMOVED_' + RESOURCE:
				if (!_.result(state, action.payload.id) || state[action.payload.id].__v > action.payload.__v) {
					return state || {};
				}
				return _.omit(state, action.payload.id);
			default:
				return state || {};
		}
	};
};
