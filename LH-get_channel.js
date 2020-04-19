registerPlugin({
	name: 'Little Helpers: Get Channel-ID',
	version: '1.0.0',
	engine: '>= 1.0.0',
	description: 'Sends you the channel-ID in private, when you move the bot into a channel.',
	author: 'TwentyFour'
}, (_, config, meta) => {
	const backend = require('backend')
	const engine = require('engine')
	const event = require('event')

	/**
	 * Start-up, backend should be connected
	 */
	event.on('load', (_) => {
		engine.log(`Started ${meta.name} (${meta.version}) by >> @${meta.author} <<`);
		if (!backend.isConnected()) {
			engine.log('ERROR: Bot was not online! Please reload after making sure it is connected to a server!');
			return;
		}
	})
	/**
	 * Check if bot was really moved and not just re-/disconnected
	 */
	event.on('clientMove', moveInfo => {
		if (!backend.isConnected()) return;
		if (moveInfo.client.isSelf()) {
			if (moveInfo.fromChannel && moveInfo.toChannel) {
				moveInfo.invoker.chat(`ChannelID: ${backend.getCurrentChannel().id()}`);
			}
		}
	})
})