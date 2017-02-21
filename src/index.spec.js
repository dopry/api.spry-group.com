/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 6] */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const supertest = require('supertest');

chai.use(chaiAsPromised);
let expect = chai.expect;

describe('api', () => {
	let app;
	let client;


	describe('require', () => {
		it('can be required without thrown and exception', () => {
			expect(() => { app = require('./'); }).to.not.throw();
		});

		it('is a function', () => {
			expect(app).to.be.a('function');
		});
	});

	describe('integration tests', () => {

		before(() => {
			app.logger.quiet = true;
			client = supertest(app);
		});

		describe('WHEN GET /', () => {
			it('the swagger documentation for the API is returned', () => {
				return client.get('/').expect(200);
			});
		});

		describe('WHEN POST /v1/contact', () => {
			it('AND no email provided, THEN there is an error', () => {
				return client.post('/v1/contact').send({}).expect(400, {"type":"error","payload":"email is required"});
			});
			it('AND invalid email provided, THEN there is an error', () => {
				return client.post('/v1/contact').send({email: 'test'}).expect(400, {"type":"error","payload":"email is invalid"});
			});
			it.skip('AND valid email provided, THEN there is success', () => {
				return client.post('/v1/contact').send({email: 'test@spry-group.com'}).expect(200, {"type": "contact", payload: "OK"});
			});
		});

	});
});
