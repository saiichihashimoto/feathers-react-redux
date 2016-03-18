/* eslint-env mocha */
var chai   = require('chai');
var expect = chai.expect;

describe('collectionReducer', function() {
	var collectionReducer;

	beforeEach(function() {
		collectionReducer = require('.');
	});

	describe('on LOADED_<RESOURCES>', function() {
		it('should populate state', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCES',
				payload: [
					{
						__v: 0,
						id:  1
					}
				]
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({
				0: {
					__v: 0,
					id:  0
				},
				1: {
					__v: 0,
					id:  1
				}
			});
		});

		it('should replace resources that are older', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCES',
				payload: [
					{
						__v: 1,
						id:  0
					}
				]
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({
				0: {
					__v: 1,
					id:  0
				}
			});
		});

		it('should replace resources that are the same age', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCES',
				payload: [
					{
						__v: 0,
						id:  0
					}
				]
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({
				0: {
					__v: 0,
					id:  0
				}
			});
		});

		it('should not replace resources that are newer', function() {
			var initialState = {
				0: {
					__v: 1,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCES',
				payload: [
					{
						__v: 0,
						id:  0
					}
				]
			});

			expect(state).to.deep.equal({
				0: {
					__v: 1,
					id:  0
				}
			});
		});
	});

	describe('on LOADED_<RESOURCE>', function() {
		it('should populate state', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCE',
				payload: {
					__v: 0,
					id:  1
				}
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({
				0: {
					__v: 0,
					id:  0
				},
				1: {
					__v: 0,
					id:  1
				}
			});
		});

		it('should replace a resource that is older', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCE',
				payload: {
					__v: 1,
					id:  0
				}
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({
				0: {
					__v: 1,
					id:  0
				}
			});
		});

		it('should replace a resource that is the same age', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCE',
				payload: {
					__v: 0,
					id:  0
				}
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({
				0: {
					__v: 0,
					id:  0
				}
			});
		});

		it('should not replace a resource that is newer', function() {
			var initialState = {
				0: {
					__v: 1,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'LOADED_RESOURCE',
				payload: {
					__v: 0,
					id:  0
				}
			});

			expect(state).to.deep.equal({
				0: {
					__v: 1,
					id:  0
				}
			});
		});
	});

	describe('on REMOVED_<RESOURCE>', function() {
		it('should remove a resource that is older', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'REMOVED_RESOURCE',
				payload: {
					__v: 1,
					id:  0
				}
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({ });
		});

		it('should remove a resource that is the same age', function() {
			var initialState = {
				0: {
					__v: 0,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'REMOVED_RESOURCE',
				payload: {
					__v: 0,
					id:  0
				}
			});

			expect(state).to.not.equal(initialState);
			expect(state).to.deep.equal({ });
		});

		it('should not remove a resource that is newer', function() {
			var initialState = {
				0: {
					__v: 1,
					id:  0
				}
			};
			var state = collectionReducer('resource')(initialState, {
				type:    'REMOVED_RESOURCE',
				payload: {
					__v: 0,
					id:  0
				}
			});

			expect(state).to.deep.equal({
				0: {
					__v: 1,
					id:  0
				}
			});
		});
	});
});
