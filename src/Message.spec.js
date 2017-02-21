/* eslint-env mocha */

const chai = require('chai');
const expect = chai.expect;

describe('Message', () => {
	let Class;
	let instance;

	it('can be required without throwing an exception', () => {
		expect(() => { Class = require('./Message.js'); }).to.not.throw();
	});

	it('is a function', () => {
		expect(Class).to.be.a('function');
	});

	it('can be constructed', () => {
		expect(() => {
			instance = new Class('type', { prop: 'prop' });
		}).to.not.throw();
		expect(instance.type).to.equal('type');
		expect(instance.payload.prop).to.equal('prop');
	});
});