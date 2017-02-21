const ExtendableError = require('es6-error');

class ValidationError extends ExtendableError {}

module.exports = ValidationError;