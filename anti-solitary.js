registerPlugin({
	name: 'Anti-Solitary-Clients',
	version: '1.1.1',
	engine: '>= 1.0.0',
	description: 'Move or punish solitary clients ( being alone in a channel ) after a specific time.',
	author: 'TwentyFour',
	vars: [{
		name: 'dev_debug',
		title: 'Show move/kick in log',
		type: 'checkbox'
	},{
		name: 'soliTime',
		title: 'Duration of max. allowed solitary time: [ in min ]',
		type: 'number',
		placeholder: '30'
	}, {
		name: 'checkTime',
		title: 'Interval of performing actions: [ in s ]',
		type: 'number',
		placeholder: '30'
	}, {
		name: 'kickChan',
		title: 'Upgrade move to a kick from channel',
		type: 'checkbox'
	}, {
		name: 'moveToChan',
		title: 'Channel to move to: ( >> automatically safe then )',
		type: 'channel',
		conditions: [
			{ field: 'kickChan', value: false }
		]
	}, {
		name: 'kickMsg',
		title: 'Enter the kick message:',
		type: 'string',
		conditions: [
			{ field: 'kickChan', value: true }
		]
	}, {
		name: 'kickServ',
		title: 'Increase to a kick from server!',
		type: 'checkbox',
		conditions: [
			{ field: 'kickChan', value: true }
		]
	}, {
		name: 'ignoreGroups',
		title: 'Enter the whitelisted server groups:',
		type: 'strings'
	}, {
		name: 'checkChannelHow',
		title: 'Choose mode to check which channel:',
		type: 'select',
		options: [
			'Total-Mode >> Check ALL channel',
			'Whitelist-Mode >> ALL - but the selected',
			'Blacklist-Mode >> NONE - besides the selected'
		]
	}, {
		name: 'checkChannelList',
		title: 'SELECT here: ( Lobby is always safe, when channel kick is enabled! )',
		type: 'array',
		indent: 1,
		vars: [{
			name: 'chan',
			title: 'Channel: ',
			type: 'channel'
		}, {
			name: 'inclSubChannel',
			title: 'Include all sub-channel ([) just one level deeper >> NO "sub-sub"-channel! )',
			type: 'checkbox'
		}, {
			name: 'inclSubSubChannel',
			title: '+ one more level ( "sub-sub"-channel )',
			type: 'checkbox',
			indent: 1,
			conditions: [
				{ field: 'inclSubChannel', value: true }
			]
		}]
	}]
}, (_, config, meta) => {
	const backend = require('backend')
	const engine = require('engine')
	const event = require('event')

	// Check if values are set properly
	if (typeof config.soliTime == 'undefined' || !config.soliTime) config.soliTime = 30;
	else if (config.soliTime < 5) config.soliTime = 5;
	if (typeof config.checkTime == 'undefined' || !config.checkTime) config.checkTime = 30;
	else if (config.checkTime < 5) config.checkTime = 5;
	if (typeof config.checkChannelHow == 'undefined' || !config.checkChannelHow) config.checkChannelHow = 0;
	
	const DEBUG = config.dev_debug;
	const SOLITIME = config.soliTime;
	const INTERVAL = config.checkTime;
	const MOVETO = config.moveToChan;
	const IGNORE_MODE = parseInt(config.checkChannelHow);
	var ready = false;
	var iso = [];
	
	var ignoreGroups = [];
	var ignoreChannel = [];
	var checkChannel = [];

/** ############################################################################################
 * 											EVENTS
 * ########################################################################################## */
/**
 * Delay start-up to prevent backend not ready
 */
	event.on('load', (_) => {
		engine.log(`Started ${meta.name} (${meta.version}) by >> @${meta.author} <<`);
		setTimeout(Init, 5000);
	})
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
		InitLists();
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
		setInterval(InitLists, SOLITIME * 20000);		// Re-fetching the channel structure at 3x per solitary time
	}
/**
 * Get Channel White-/Blacklist
 */
	function InitLists() {
		if (!backend.isConnected()) {
			engine.log(`${meta.name} >> ERROR: Bot was not online! Please reload, after making sure it is connected to a server!`);
			return;
		}
		let igCh = [];
		let chCh = [];
		let AllChannel = backend.getChannels();

		// Create to channel arrays to filter with
		if (config.kickChan && !config.kickServ) {
			AllChannel.forEach((channel) => {
				if (channel.isDefault()) igCh.push(channel.id());
			})
		}
		else if (!config.kickServ) {
			igCh.push(MOVETO);
		}
		switch (IGNORE_MODE) {
			case 0:
				break;
			case 1:
				for (var i = 0; i < config.checkChannelList.length; i++) {
					igCh.push(config.checkChannelList[i].chan);
					if (config.checkChannelList[i].inclSubChannel) {
						// sub channel
						let array = getSubchannels(config.checkChannelList[i].chan);
						array.forEach((channel) => {
							// sub sub channel
							if (config.checkChannelList[i].inclSubSubChannel) {
								let subarray = getSubchannels(channel.id());
								subarray.forEach((subchannel) => {
									igCh.push(subchannel.id());
								})
							}
							igCh.push(channel.id());
						})
					}
				}
				break;
			case 2:
				for (var i = 0; i < config.checkChannelList.length; i++) {
					chCh.push(config.checkChannelList[i].chan);
					if (config.checkChannelList[i].inclSubChannel) {
						// sub channel
						let array = getSubchannels(config.checkChannelList[i].chan);
						array.forEach((channel) => {
							// sub sub channel
							if (config.checkChannelList[i].inclSubSubChannel) {
								let subarray = getSubchannels(channel.id());
								subarray.forEach((subchannel) => {
									chCh.push(subchannel.id());
								})
							}
							chCh.push(channel.id());
						})
					}
				}
				break;
		}
		ignoreChannel = igCh;
		checkChannel = chCh;
	}
/**
 * Periodically check the isolation times
 */
	function CheckTime() {
		if (!backend.isConnected() || !ready) return;
		let AllChannel = backend.getChannels();
		for (var i = 0; i < AllChannel.length; i++) {
			// Check if entry present
			let id = AllChannel[i].id();
			if (iso[id] !== null && iso[id] !== undefined) {
				// Process channel depending on setting
				if (IGNORE_MODE == 0 && ignoreChannel.includes(id))  continue;
				if (IGNORE_MODE == 1 && ignoreChannel.includes(id))  continue;
				if (IGNORE_MODE == 2 && !checkChannel.includes(id))  continue;

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
 * @return {boolean}
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
/**
 * Returns an array with all sub-channel objects
 * @param {string} ChannelID 
 * @return {Channel[]} sub channel array
 */
	function getSubchannels(ChannelID) {
		let AllChannel = backend.getChannels();
		let result = [];
		for (var i = 0; i < AllChannel.length; i++) {
			let currentParChannel = AllChannel[i].parent();
			if (currentParChannel && (currentParChannel.id() == ChannelID)) {
				result.push(AllChannel[i]);
			}
		}
		return result;
	}
});