var _               = require('underscore');
var combineReducers = require('redux').combineReducers;
var pluralize       = require('pluralize');

var resourceReducer = function(resource) {
	var RESOURCE = resource.toUpperCase();

	return combineReducers({
		updating: function(state, action) {
			switch (action.type) {
				case 'UPDATING_' + RESOURCE:
					return true;
				case 'UPDATED_' + RESOURCE:
					return false;
				default:
					return state || false;
			}
		},
		removing: function(state, action) {
			switch (action.type) {
				case 'REMOVING_' + RESOURCE:
					return true;
				case 'REMOVED_' + RESOURCE:
					return false;
				default:
					return state || false;
			}
		},
		error: function(state, action) {
			switch (action.type) {
				case 'UPDATING_' + RESOURCE:
				case 'REMOVING_' + RESOURCE:
					return null;
				case 'UPDATED_' + RESOURCE:
				case 'REMOVED_' + RESOURCE:
					return action.error ? action.payload : null;
				default:
					return state || null;
			}
		},
		data: function(state, action) {
			switch (action.type) {
				case 'CREATED_' + RESOURCE:
				case 'UPDATED_' + RESOURCE:
					return action.error ? state : action.payload;
				case 'REMOVED_' + RESOURCE:
					return action.error ? state : null;
				default:
					return state || {};
			}
		}
	});
};

var resourcesReducer = function(resource) {
	var RESOURCE  = resource.toUpperCase();
	var RESOURCES = pluralize(resource).toUpperCase();

	var singleItemReducer = resourceReducer(resource, {});

	return function(state, action) {
		switch (action.type) {
			case 'LOADED_' + RESOURCES:
				return action.error ? state : _.chain(action.payload)
					.indexBy('id')
					.mapObject(function(object) {
						return { data: object };
					})
					.defaults(state)
					.value();
			case 'REMOVED_' + RESOURCE:
				state = _.clone(state);
				if (action.error) {
					state[action.payload.id] = singleItemReducer(state[action.payload.id], action);
				} else {
					delete state[action.payload.id];
				}
				return state || {};
			default:
				if (_.chain(action.payload).result('id').isUndefined().value()) {
					return state || {};
				}
				state = _.clone(state);
				state[action.payload.id] = singleItemReducer(state[action.payload.id], action);
				return state || {};
		}
	};
};

module.exports = resourcesReducer;
