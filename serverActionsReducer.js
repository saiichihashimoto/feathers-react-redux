var _ = require('underscore');

module.exports = function(state, action) {
	switch (action.type) {
		case 'SERVER_ACTION':
			return _.chain(state)
				.union([action.payload])
				// TODO Unique based on something more granular
				.uniq(false, 'type')
				.value();
		default:
			return state || [];
	}
};
