(function() {
	var global = (function() {return this;})();

	if (!global.caplin) {
		global.caplin = {
			core: {}
		};
	} else if (!global.caplin.core) {
		global.caplin.core = {};
	}
}());