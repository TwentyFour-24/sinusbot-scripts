registerPlugin({
	name: 'Slim-Online-Sheriff',
	version: '1.0.3',
	engine: '>= 1.0.0',
	description: 'Forces instances to connect once on load/disconnect, or optionally ensures it periodically.',
	author: 'TwentyFour',
	backends: ['ts3', 'discord'],
	vars: [{
		name: 'auto',
		title: 'Verify connectivity each minute as well',
		type: 'checkbox'
	}]
}, (_, config) => {
	const engine = require('engine')
	const backend = require('backend')
	const event = require('event')

	event.on('load', checkConnection)
	event.on('disconnect', checkConnection)

	if (config.auto) setInterval(checkConnection, 6e4);

	function checkConnection() {
		if (!backend.isConnected()) {
			backend.disconnect();
			setTimeout(backend.connect(), 5e3);
			engine.log("S-O-S >> Forcing reconnect, since instance was offline.");
		}
	}
});