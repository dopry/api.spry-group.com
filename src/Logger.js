class Logger {

	constructor() {
		this.quiet = false;
	}

	/**
	 * Log to console as json.
	 * @param {Message}  message - message to log as json.
	 * @returns null
	 */
	log(message) {
		if (this.quiet) { return; }
		console.log(JSON.stringify(message));
	}
}

module.exports = Logger;