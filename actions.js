var _            = require('underscore');
var createAction = require('redux-actions').createAction;
var pluralize    = require('pluralize');

module.exports = function(app, resource) {
	var actions = {};

	var RESOURCE  = resource.toUpperCase();
	var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
	var resources = pluralize(resource);
	var RESOURCES = resources.toUpperCase();
	var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

	var loadingResources = createAction('LOADING_' + RESOURCES);
	var loadedResources  = createAction('LOADED_' + RESOURCES);
	var createdResource  = createAction('CREATED_' + RESOURCE);
	var creatingResource = createAction('CREATING_' + RESOURCE);
	var updatedResource  = createAction('UPDATED_' + RESOURCE);
	var updatingResource = createAction('UPDATING_' + RESOURCE);
	var removedResource  = createAction('REMOVED_' + RESOURCE);
	var removingResource = createAction('REMOVING_' + RESOURCE);

	var resolveApp = _.once(function() {
		if (!_.isFunction(app)) {
			return;
		}
		app = app();
	});

	actions['load' + Resources] = function(params) {
		return function(dispatch) {
			resolveApp();
			dispatch(loadingResources());
			return app.service('/api/' + resources).find(params, function(err, objects) {
				dispatch(loadedResources(err ? new Error(err.message) : objects));
			});
		};
	};

	actions['created' + Resource] = createdResource;
	actions['create' + Resource] = function(data, params) {
		return function(dispatch) {
			resolveApp();
			dispatch(creatingResource());
			return app.service('/api/' + resources).create(data, params, function(err, object) {
				dispatch(createdResource(err ? new Error(err.message) : object));
			});
		};
	};

	actions['updated' + Resource] = updatedResource;
	actions['update' + Resource] = function(id, data, params) {
		return function(dispatch) {
			resolveApp();
			dispatch(updatingResource({ id: id }));
			return app.service('/api/' + resources).update(id, data, params, function(err, object) {
				dispatch(updatedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
			});
		};
	};

	actions['patched' + Resource] = updatedResource;
	actions['patch' + Resource] = function(id, data, params) {
		return function(dispatch) {
			resolveApp();
			dispatch(updatingResource({ id: id }));
			return app.service('/api/' + resources).patch(id, data, params, function(err, object) {
				dispatch(updatedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
			});
		};
	};

	actions['removed' + Resource] = removedResource;
	actions['remove' + Resource] = function(id, params) {
		return function(dispatch) {
			resolveApp();
			dispatch(removingResource({ id: id }));
			return app.service('/api/' + resources).remove(id, params, function(err, object) {
				dispatch(removedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
			});
		};
	};

	return actions;
};
