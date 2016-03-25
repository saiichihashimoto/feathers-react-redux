/* eslint-env browser */
var _            = require('underscore');
var createAction = require('redux-actions').createAction;
var errors       = require('feathers-errors');
var pluralize    = require('pluralize');

function errorTransform(err) {
	return ((err instanceof Error) || !errors[err.name]) ? err : new errors[err.name](err.message, err.data);
}

module.exports = {
	actionsForFeathersLogin: function(app) {
		var actions = {
			setLogin:  createAction('LOGIN'),
			setLogout: createAction('LOGOUT'),

			confirmLogin: function() {
				return function(dispatch) {
					if (app.get('token') || app.get('user')) {
						dispatch({ type: 'LOGIN' });
						return Promise.resolve(true);
					}
					return app.authenticate().then(
						_.compose(dispatch, actions.setLogin),
						_.chain(dispatch)
							.compose(actions.setLogout, errorTransform)
							.waitAndReject()
							.value()
					);
				};
			},
			logout: function() {
				return function(dispatch) {
					document.cookie = 'feathers-jwt=;'; // FIXME Why do I have to do this?
					var dispatchSetLogout = _.compose(dispatch, actions.setLogout);
					return app.logout().then(
						dispatchSetLogout,
						_.chain(dispatchSetLogout)
							.compose(errorTransform)
							.waitAndReject()
							.value()
					);
				};
			}
		};

		return actions;
	},
	actionsForFeathersService: function(app, resources, resource) {
		resource = resource || pluralize.singular(resources);
		var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
		var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

		var actions = {};

		actions['got' + Resource] = createAction('GOT_' + resource.toUpperCase());
		actions['got' + Resources] = createAction('GOT_' + resources.toUpperCase());
		actions['removed' + Resource] = createAction('REMOVED_' + resource.toUpperCase());

		actions['create' + Resource] = function(data, params) {
			return function(dispatch) {
				var dispatchGotResource = _.compose(dispatch, actions['got' + Resource]);
				return app.service(resources).create(_.result(data, 'toObject', data), params).then(
					dispatchGotResource,
					_.chain(dispatchGotResource)
						.compose(errorTransform)
						.waitAndReject()
						.value()
				);
			};
		};

		actions['get' + Resources] = function(params) {
			return function(dispatch) {
				var dispatchGotResources = _.compose(dispatch, actions['got' + Resources]);
				return app.service(resources).find(params).then(
					dispatchGotResources,
					_.chain(dispatchGotResources)
						.compose(errorTransform)
						.waitAndReject()
						.value()
				);
			};
		};

		actions['remove' + Resource] = function(id, params) {
			return function(dispatch) {
				var dispatchRemovedResource = _.compose(dispatch, actions['removed' + Resource]);
				return app.service(resources).remove(id, params).then(
					dispatchRemovedResource,
					_.chain(dispatchRemovedResource)
						.compose(errorTransform)
						.waitAndReject()
						.value()
				);
			};
		};

		actions['update' + Resource] = function(id, data, params) {
			return function(dispatch) {
				var dispatchGotResource = _.compose(dispatch, actions['got' + Resource]);
				return app.service(resources).update(id, _.result(data, 'toObject', data), params).then(
					dispatchGotResource,
					_.chain(dispatchGotResource)
						.compose(errorTransform)
						.waitAndReject()
						.value()
				);
			};
		};

		var counter       = 0;
		var stopListening = _.noop;
		actions['listenFor' + Resources] = function() {
			return function(dispatch) {
				if (counter === 0) {
					var gotResource     = _.compose(dispatch, actions['got' + Resource]);
					var removedResource = _.compose(dispatch, actions['removed' + Resource]);

					app.service(resources)
						.on('created', gotResource)
						.on('updated', gotResource)
						.on('patched', gotResource)
						.on('removed', removedResource);

					stopListening = _.once(function() {
						stopListening = _.noop;
						app.service(resources)
							.off('created', gotResource)
							.off('updated', gotResource)
							.off('patched', gotResource)
							.off('removed', removedResource);
					});
				}
				counter++;
				return _.once(function() {
					counter--;
					if (counter === 0) {
						stopListening();
					}
				});
			};
		};

		return actions;
	}
};
