/**
 * Constructs a new <code>Error</code> of the provided type.
 * 
 * @param {String} sType The error type to be thrown.
 * @param {String} sMessage A human-readable description of the error.
 * 
 * @class
 * <code>caplin.core.Error</code> extends the built in <code>Error</code> and allows the
 * error type to be specified in the constructor. The <code>name</code>
 * property is set to the specified type.
 */
caplin.core.Error = function(sType, sMessage)
{
	Error.call(this, sMessage);
	this.name = sType || "";
};

caplin.core.Error.prototype = new Error();

/**
 * This error type is thrown when a method is called with one or more invalid
 * parameters. This could either be because a required parameter is not provided
 * or a provided parameter is of the wrong type or is invalid for another reason
 * (eg a string representation of a date that doesn't parse to an actual date).
 */
caplin.core.Error.INVALID_PARAMETERS = "InvalidParameters";
