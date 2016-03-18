/* eslint-env mocha */
var chai   = require('chai');
var expect = chai.expect;

describe('collectionReducer', function() {
	var collectionReducer;

	beforeEach(function() {
		collectionReducer = require('.');
	});

	it('should populate state on LOAD_<RESOURCES>', function() {
		var initialState = {
			data: {
				0: {
					data: {
						id:    0,
						value: 'zero'
					}
				}
			}
		};
		var state = collectionReducer('resource')(initialState, {
			type:    'LOAD_RESOURCES',
			payload: [
				{
					id:    1,
					value: 'one'
				},
				{
					id:    2,
					value: 'two'
				}
			]
		});

		expect(state).to.not.equal(initialState);
		expect(state)
			.to.have.property('data')
				.not.equal(initialState.data);
		expect(state)
			.to.have.property('data')
				.deep.equal({
					0: {
						data: {
							id:    0,
							value: 'zero'
						}
					},
					1: {
						data: {
							id:    1,
							value: 'one'
						}
					},
					2: {
						data: {
							id:    2,
							value: 'two'
						}
					}
				});
	});

	it('should overwrite a resource on LOAD_<RESOURCES>', function() {
		var initialState = {
			data: {
				0: {
					data: {
						id:    0,
						value: 'zero'
					}
				}
			}
		};
		var state = collectionReducer('resource')(initialState, {
			type:    'LOAD_RESOURCES',
			payload: [
				{
					id:    0,
					value: 'zero 2'
				}
			]
		});

		expect(state)
			.to.have.property('data')
				.deep.equal({
					0: {
						data: {
							id:    0,
							value: 'zero 2'
						}
					}
				});
	});
});
