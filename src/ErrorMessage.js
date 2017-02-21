const Message = require('./Message');

class ErrorMessage extends Message {
	/**
	 * @param {Error} error
	 */
	constructor(error) {
		let _error = (typeof error === 'object') ?  error.message : error;
		super('error', _error);
	}
}

module.exports = ErrorMessage;