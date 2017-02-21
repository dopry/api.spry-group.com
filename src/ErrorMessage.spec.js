/* eslint-env mocha */

const chai = require('chai');
const expect = chai.expect;

describe('ErrorMessage', () => {
	let ErrorMessage;
	let instance;

	it('can be required without throwing an exception', () => {
		expect(() => { ErrorMessage = require('./ErrorMessage.js'); }).to.not.throw();
	});

	it('is a function', () => {
		expect(ErrorMessage).to.be.a('function');
	});

	it('can be constructed', () => {
		expect(() => {
			instance = new ErrorMessage('message');
		}).to.not.throw();
		expect(instance.type).to.equal('error');
		expect(instance.payload).to.equal('message');
	});

	it('Will use the message of an Error as payload.', () => {
		let error = new Error('test');
		let message = new ErrorMessage(error);
		expect(message.payload).to.equal('test');
	});
});