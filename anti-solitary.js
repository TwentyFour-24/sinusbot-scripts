registerPlugin({
	name: 'Anti-Solitary-Clients',
	version: '1.1.0',
	engine: '>= 1.0.0',
	description: 'Move or punish solitary clients (being alone in a channel) after a specific time.',
	author: 'TwentyFour',
	vars: [{
		name: 'dev_debug',
		title: 'Show move/kick in log',
		type: 'checkbox'
	},{
		name: 'soliTime',
		title: 'Duration of max. allowed solitary time: [in min]',
		type: 'number',
		placeholder: '30'
	}, {
		name: 'checkTime',
		title: 'Checking interval: [in s]',
		type: 'number',
		placeholder: '30'
	}, {
		name: 'moveToChan',
		title: 'Channel to move to: (thereby whitelisted)',
		type: 'channel'
	}, {
		name: 'kickChan',
		title: 'Kick from channel instead?',
		type: 'checkbox'
	}, {
		name: 'kickMsg',
		title: 'Enter the kick message:',
		type: 'string',
		conditions: [
			{ field: 'kickChan', value: true }
		]
	}, {
		name: 'kickServ',
		title: 'Directly kick from server!',
		type: 'checkbox',
		conditions: [
			{ field: 'kickChan', value: true }
		]
	}, {
		name: 'ignoreGroups',
		title: 'Whitelisted server groups:',
		type: 'strings'
	}, {
		name: 'ignoreChannel',
		title: 'Whitelisted channels: (Lobby is always!)',
		type: 'array',
		vars: [{
			name: 'channel',
			title: 'Channel',
			type: 'channel'
		}]
	}]
}, (_, config, meta) => {
	const backend = require('backend')
	const engine = require('engine')
	const event = require('event')

	/**
	 * Load up OKlib if present
	 */
	event.on('load', (_) => {
		var oklib = require('OKlib.js')
		
		if (!oklib) {
			engine.log(`${meta.name} >> OKlib is required for the script but wasn't to be found!`)
			engine.log(`${meta.name} >> Install the OKlib, which can be found here: https://forum.sinusbot.com/resources/oklib.325/`)
		}
		else if (!oklib.general.checkVersion('1.0.8')) {
			engine.log(`${meta.name} >> OKlib is outdated! This script requires v1.0.8`)
			engine.log(`${meta.name} >> Update the OKlib, which can be found here: https://forum.sinusbot.com/resources/oklib.325/`)
		}
		else {
			main(oklib);
		}
	})
/**
 * Main run function
 * @param {object} oklib the loaded OKlib
 */
	function main(oklib) {
		engine.log(`Started ${meta.name} (${meta.version}) by >> @${meta.author} <<`);

		// Check if values are set properly
		if (typeof config.soliTime == 'undefined' || !config.soliTime) config.soliTime = 30;
		else if (config.soliTime < 5) config.soliTime = 5;
		if (typeof config.checkTime == 'undefined' || !config.checkTime) config.checkTime = 30;
		else if (config.checkTime < 5) config.checkTime = 5;

		const DEBUG = config.dev_debug;
		const SOLITIME = config.soliTime;
		const INTERVAL = config.checkTime;
		const MOVETO = config.moveToChan;
		var ready = false;
		var iso = [];
		var ignoreGroups = [];
		var ignoreChannel = [];
		ignoreGroups = config.ignoreGroups;
		ignoreChannel = config.ignoreChannel;
		ignoreChannel.push(config.moveToChan);

		Init();

/** ############################################################################################
 * 											EVENTS
 * ########################################################################################## */
	/**
	 * Get new data after connection loss
	 */
		event.on('connect', (_) => {
			iso = [];
			Init();
			engine.log(`${meta.name} >> (Re-)Connected to server ... getting new data!`);
		})
	/**
	 * Pause while dc'ed
	 */
		event.on('disconnect', (_) => {
			ready = false;
			engine.log(`${meta.name} >> Disconnected from server ... pausing until reconnect!`);
		})
	/**
	 * Check channel composition on every move event
	 */
		event.on('clientMove', moveInfo => {
			if (ready) {
				var EVfromChannel = null;
				var EVtoChannel = null;
				var DBfromMatch = null;
				var fromID = null;
				var DBtoMatch = null;
				var toID = null;

				// Check and prepare
				if (moveInfo.fromChannel !== undefined) {
					EVfromChannel = moveInfo.fromChannel;
				}
				if (moveInfo.toChannel !== undefined) {
					EVtoChannel = moveInfo.toChannel;
				}
				if (EVfromChannel) {
					fromID = EVfromChannel.id();
					if (iso[EVfromChannel.id()] !== undefined) {
						DBfromMatch = iso[fromID];
					}
				}
				if (EVtoChannel) {
					toID = EVtoChannel.id();
					if (iso[EVtoChannel.id()] !== undefined) {
						DBtoMatch = iso[toID];
					}
				}
				// If move came from isolated channel >> REMOVE
				if (DBfromMatch) {
					if (backend.getChannelByID(fromID).getClientCount() !== 1) {
						iso[fromID] = null;
					}
				}
				// Is fromChannel now an isolated channel? >> ADD
				else {
					if (fromID) {
						if (backend.getChannelByID(fromID).getClientCount() == 1) {
							iso[fromID] = {
								user: EVfromChannel.getClients()[0].id(),
								since: Date.now()
							}
						}
					}
				}
				// If move made channel non-isolated >> REMOVE
				if (DBtoMatch) {
					if (backend.getChannelByID(toID).getClientCount() !== 1) {
						iso[toID] = null;
					}
				}
				// Is toChannel now an isolated channel? >> ADD
				else {
					if (toID) {
						if (backend.getChannelByID(toID).getClientCount() == 1) {
							iso[toID] = {
								user: EVtoChannel.getClients()[0].id(),
								since: Date.now()
							}
						}
					}
				}
			}
		})
/** ############################################################################################
 * 										FUNCTION DECLARATIONS
 * ########################################################################################## */
	/**
	 * Start-up routine: Check all existing channels
	 */
		function Init() {
			if (!backend.isConnected()) {
				engine.log(`${meta.name} >> ERROR: Bot was not online! Please reload, after making sure it is connected to a server!`);
				return;
			}
			let AllChannel = backend.getChannels();
			AllChannel.forEach((channel) => {
				if (channel.isDefault()) ignoreChannel.push(channel.id());
				// Check if isolation channel
				if (channel.getClientCount() == 1) {
					if (!iso[channel.id()]) {
						iso[channel.id()] = {}
					}
					// Create entry
					iso[channel.id()] = {
						user: channel.getClients()[0].id(),
						since: Date.now()
					}
				}
			})
			ready = true;
			setInterval(CheckTime, INTERVAL * 1000);
		}
	/**
	 * Periodically check the isolation times
	 */
		function CheckTime() {
			if (!backend.isConnected() || !ready) return;
			let AllChannel = backend.getChannels();
			AllChannel.forEach((channel) => {
				// Check if entry present
				let id = channel.id();
				if (iso[id] !== null && iso[id] !== undefined) {
					// Exclude whitelisted channel
					if (!ignoreChannel.includes(id)) {
						// Exclude whitelisted server groups
						let ignore = false;
						let checky = backend.getClientByID(iso[id].user);
						ignoreGroups.forEach((group) => {
							ignore = hasServerGroupWithId(checky, group);
						})
						if (!ignore) {
							// Calculate the isolation time
							let since = iso[id].since;
							let diff = Date.now() - since;
							if (diff > (SOLITIME * 60000)) {
								// if surpassed >> execute punishment
								TakeAction(iso[id].user);
							}
						}
					}
				}
			})
		}
	/**
	 * If isolated client found >> execute punishment
	 * @param {string} clientUID the temporary TS-ID
	 */
		function TakeAction(clientUID) {
			if (!backend.isConnected()) return;
			let user = backend.getClientByID(clientUID);

			// Execute 
			if (config.kickServ) {
				user.kickFromServer(config.kickMsg);
				if (DEBUG) engine.log(`${meta.name} >> Server-Kick issued to: ${user.name()}`);
				return;
			}
			if (config.kickChan) {
				user.kickFromChannel(config.kickMsg);
				if (DEBUG) engine.log(`${meta.name} >> Channel-Kick issued to: ${user.name()}`);
				return;
			}
			user.moveTo(MOVETO);
			if (DEBUG) engine.log(`${meta.name} >> Move issued to: ${user.name()}`);
			return;
		}
	/**
	 * Auxiliary function to check for a servergroup
	 * @param {Client} client to be checked
	 * @param {string} groupId to check for
	 */
		function hasServerGroupWithId(client, groupId) {
			let clientsGroups = [];
			client.getServerGroups().forEach(
				function (group) {
					clientsGroups.push(group.id());
				})
			if(clientsGroups.indexOf(groupId) > -1) return true;
			return false;
		}
	}
});