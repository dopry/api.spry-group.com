/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 6] */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const Logger = require('./Logger');
const SparkPost = require('sparkpost');
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();

// configure dependencies
let logger = new Logger();
logger.quiet = true;

let SPARKPOST_KEY = process.env.SPARKPOST_KEY || 'ac91d28db7819d0668dcd965073e4f25f9a024fb';
let sparkpost = new SparkPost(SPARKPOST_KEY);

describe('Controller', () => {
	let Class;
	let instance;

	it('can be required without throwing an exception', () => {
		expect(() => { Class = require('./Controller.js'); }).to.not.throw();
	});

	it('is a function', () => {
		expect(Class).to.be.a('function');
	});

	it('can be constructed', () => {
		expect(() => {
			logger.quiet = true;
			instance = new Class(logger, sparkpost, 'sales@spry-group.com.sink.sparkpostmail.com', 'contact');
		}).to.not.throw();
	});

	describe('.contact(body)', () => {
		it('WHEN no body is provided, THEN a ValidationError is thrown', () => {
			return instance.contact(null).should.be.rejected.then((error) => {
				expect(error.name).to.equal('ValidationError');
				expect(error.message).to.equal('a body is required');
			});
		});
		it('WHEN no email is provided, THEN a ValidationError is thrown', () => {
			return instance.contact({firstName: 'test'}).should.be.rejected.then((error) => {
				expect(error.name).to.equal('ValidationError');
				expect(error.message).to.equal('email is required');
			});
		});
		it('WHEN an invalid email is provided, THEN a ValidationError is thrown', () => {
			return instance.contact({email: 'test'}).should.be.rejected.then((error) => {
				expect(error.name).to.equal('ValidationError');
				expect(error.message).to.equal('email is invalid');
			});
		});

		it('WHEN a email is provided, THEN an email is sent.', () => {
			return instance.contact({email: 'test@spry-group.com'}).should.be.fulfilled.then((response) => {
				expect(response).to.be.a('object');
			});
		});
	});
});
