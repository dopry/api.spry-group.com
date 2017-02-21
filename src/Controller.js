let Message = require('./Message');
let ValidationError = require('./error/ValidationError');
let validator = require('validator');

/**
 *
 *
 * @class Controller
 */
class Controller {

	/**
	 * Creates an instance of Controller.
	 *
	 * @param {Logger} logger - Logger instance.
	 * @param {sparkpost} sparkpost - sparkpost client instance;
	 * @param {string} recipient - recipient alias for contact emails.
	 * @param {string} template_id - sparkpost template_id;
	 *
	 * @memberOf Controller
	 */
	constructor(logger, sparkpost, recipient, template_id ) {
		this.logger = logger;
		this.sparkpost = sparkpost;
		this.recipient = recipient;
		this.template_id = template_id;
	}

	contact(body) {
		if (!body) {
			return Promise.reject(new ValidationError('a body is required'));
		}
		if (!body.email) {
			return Promise.reject(new ValidationError('email is required'));
		}
		if (!validator.isEmail(body.email)) {
			return Promise.reject(new ValidationError('email is invalid'));
		}
		let transmission = {
			recipients: [
				{ address: { email: this.recipient } }
			],
			content: { template_id: 'contact' },
			metadata:{
				contact: body
			}
		};
		return this.sparkpost.transmissions.send(transmission).then((data) => {
			this.logger.log(new Message('contact.sent', body));
			return data;
		}).catch((reason) => {
			this.logger.log(new Message('sparkpost.error', reason));
			throw reason;
		});
	}


	/**
	 * Catch events from github webhooks and store them in firebase.
	 *
	 * @param {any} body
	 * @returns
	 *
	 * @memberOf Controller
	 */
	webhookGithub(body) {
		// store event in firebase.
		return Promise.resolve();
	}

	/**
	 * Load the issue and event history for a github repo into
	 * firebase.
	 *
	 * @param {string} owner
	 * @param {string} repo
	 *
	 * @memberOf Controller
	 */
	dashboardGithubHistory(owner, repo) {
		return Promise.resolve();
	}
}

module.exports = Controller;
