var _             = require('underscore');
var handleActions = require('redux-actions').handleActions;
var pluralize     = require('pluralize');
var Immutable     = require('immutable');

module.exports = {
	reducerForFeathersLogin: function() {
		return handleActions({
			LOGIN:  _.constant(true),
			LOGOUT: _.constant(false)
		}, null);
	},
	reducerForFeathersService: function(resources, resource) {
		resource = resource || pluralize.singular(resources);
		var RESOURCE  = resource.toUpperCase();
		var RESOURCES = resources.toUpperCase();

		var reducers = {
			LOGOUT: _.constant(Immutable.List())
		};

		reducers['GOT_' + RESOURCES] = function(state, action) {
			return action.error ? state : Immutable.fromJS(action.payload);
		};

		reducers['GOT_' + RESOURCE] = function(state, action) {
			if (action.error) {
				return state;
			}
			var index = _.findIndex(state.toArray(), function(obj) {
				return obj.get('_id') === action.payload._id;
			});
			if (index === -1) {
				return state.push(Immutable.Map(action.payload));
			}
			return state.set(index, Immutable.Map(action.payload));
		};

		reducers['REMOVED_' + RESOURCE] = function(state, action) {
			if (action.error) {
				return state;
			}
			return state.filter(function(obj) {
				return obj.get('_id') !== action.payload._id;
			});
		};

		return handleActions(reducers, Immutable.List());
	}
};
