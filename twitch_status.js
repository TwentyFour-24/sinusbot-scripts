registerPlugin({
	name: 'Twitch Status!',
	version: '2.0.2',
	engine: '>= 1.0.0',
	description: 'Syncs your channel\'s title and description periodically with your favourite twitch streamers!',
	author: 'TwentyFour | Original Code by Filtik & Julian Huebenthal (Xuxe)',
	requiredModules: ["http"],
	vars: [{
		name: 'dev_menu',
		title: 'Developer Setting >> USE WITH CAUTION!',
		type: 'checkbox'
	}, {
		name: 'dev_debug',
		indent: 1,
		title: 'Show detailed debug messages',
		type: 'checkbox',
		conditions: [
			{ field: 'dev_menu', value: true }
		]
	}, {
		name: "dev_latency",
		indent: 1,
		title: 'Latency between each API requests: [in ms]',
		type: 'number',
		placeholder: 100,
		conditions: [
			{ field: 'dev_menu', value: true }
		]
	}, {
		name: "dev_timeout",
		indent: 1,
		title: 'Timeout threshold for API requests: [in ms]',
		type: 'number',
		placeholder: 5000,
		conditions: [
			{ field: 'dev_menu', value: true }
		]
	}, {
		name: "twitch_apikey",
		title: 'Twitch Client-ID: (Create under https://dev.twitch.tv/console/apps)',
		type: 'string'
	}, {
		name: "twitch_apisecret",
		title: 'Twitch Client-Secret: (see Client-ID creating >> Secret is only shown once on creation!)',
		type: 'string'
	}, {
		name: "interval",
		title: 'Data refresh interval: [in min] >> Do NOT set it too low, else you might get banned by the API provider!',
		type: 'number',
		placeholder: 5
	}, {
		name: 'EnableBTTV',
		title: 'Enable grabbing of BTTV emotes >> disabled by default',
		type: 'checkbox'
	}, {
		name: 'instantEmotes',
		title: 'Load  emotes after every \'Save changes\' instead second interval >> CAREFUL: can spam the API!',
		type: 'checkbox'
	}, {
		name: 'StreamerGrActive',
		title: 'Automatically assign a "Stream is online" (-LIVE-) servergroup',
		type: 'checkbox'
	}, {
		name: "StreamerGrID",
		indent: 1,
		title: 'Servergroup-ID for (-LIVE-) streamers:',
		type: 'number',
		placeholder: 6,
		conditions: [
			{ field: 'StreamerGrActive', value: true }
		]
	}, {
		name: 'ServerMsgActive',
		title: 'Send a server-wide message when going (-LIVE-)',
		type: 'checkbox'
	}, {
		name: "ServerMsgContent",
		indent: 1,
		title: 'Customize server message: (%Streamer, %Game, %URL)',
		type: 'string',
		placeholder: '%Streamer (%Game) is online! Check out %URL and follow!',
		default: '%Streamer (%Game) is online! Check out %URL and follow!',
		conditions: [
			{ field: 'ServerMsgActive', value: true }
		]
	}, {
		name: 'flamboyantMode',
		indent: 1,
		title: 'Flamboyant-Mode >> Message a little more eye-catching',
		type: 'checkbox',
		conditions: [
			{ field: 'ServerMsgActive', value: true }
		]
	}, {
		name: 'swapGameTitle',
		title: 'Custom abbreviation of game titles in channel name >> due to 40 character limit',
		type: 'checkbox'
	}, {
		name: "swapGameArray",
		indent: 1,
		title: 'Specify game titles pairwise to shorten them...',
		type: 'array',
		conditions: [
			{ field: 'swapGameTitle', value: true }
		],
		vars: [{
			name: 'swapGameCheck',
			indent: 2,
			title: 'Original game title:',
			type: 'string'
		}, {
			name: 'swapGameReplace',
			indent: 2,
			title: '>>> replaced with: (empty = unchanged)',
			type: 'string'
		}]
	}, {
		name: "indi",
		indent: 0,
		title: 'Now setup your individual channels here...',
		type: 'array',
		vars: [{
			name: 'Streamername',
			indent: 1,
			title: 'Twitch-(Channel-)Name:',
			type: 'string'
		}, {
			name: 'StreamerUID',
			indent: 1,
			title: 'Corresponding TeamSpeak-UUID: (can be left blank, if option is disabled)',
			type: 'string',
			default: '0'
		}, {
			name: 'OutputChannel',
			indent: 1,
			title: 'TeamSpeak-Channel: (select from tree - be sure bot is online)',
			type: 'channel'
		}, {
			name: 'description',
			indent: 1,
			title: 'Channel description: (%Streamer, %Pic ([img] not required), %Logo ([img] not required), %Title, %Game, %Uptime, %Link (BB-Tag included), %URL, %Follower, %Viewer, %Status, %Emotes, %Betteremotes)',
			type: 'multiline',
			placeholder: '[center][b][size=+2]%Streamer[/size][/b]\n%Pic[/center]\n[b]Title:[/b] %Title\n\n[b]Game:[/b] %Game\n[b]Uptime:[/b] %Uptime\n\n%Link\n\n[b]Viewer:[/b] %Viewer\n[b]Followers:[/b] %Follower\n[b]Status:[/b] %Status\n\n[b]Emotes:[/b] %Emotes'
		}, {
			name: 'PictureSize',
			indent: 1,
			title: 'Size of stream preview picture:',
			type: 'select',
			default: "1",
			options: [
				'80x45',
				'320x180',
				'640x360',
				'Custom'
			]
		}, {
			name: 'PictureWidth',
			indent: 2,
			title: 'Width: [in px]',
			type: 'number',
			placeholder: 400,
			conditions: [
				{ field: 'PictureSize', value: 3 }
			]
		}, {
			name: 'PictureHeight',
			indent: 2,
			title: 'Height: [in px]',
			type: 'number',
			placeholder: 225,
			conditions: [
				{ field: 'PictureSize', value: 3 }
			]
		}, {
			name: 'PicReplace',
			indent: 1,
			title: 'Show profile picture (%Logo replaces %Pic) when stream is offline >> else there just won\'t be any picture!',
			type: 'checkbox'
		}, {
			name: 'OfflineText',
			indent: 1,
			title: 'Offline channel name: (%Streamer)',
			type: 'string',
			placeholder: '%Streamer is offline.'
		}, {
			name: 'OnlineText',
			indent: 1,
			title: 'Online channel name: (%Streamer, %Viewer, %Game)',
			type: 'string',
			placeholder: '%Streamer (%Game) is online!'
		}, {
			name: 'UpdateDisableOnline',
			indent: 1,
			title: 'Disable update when online >> Channel name or description won\'t be updated until it was offline again.',
			type: 'checkbox'
		}]
	}]
}, (_, config, meta) => {
	const engine = require('engine');
	const backend = require('backend');
	const store = require('store');
	const event = require('event');
	const http = require('http');

	// Verify length of Twitch ClientID and secret
	var READY = true;
	if (config.twitch_apikey && config.twitch_apisecret) {
		if (config.twitch_apikey.length !== 30) {
			READY = false;
			engine.log('ERROR: Invalid Client-ID entered!');
		}
		if (config.twitch_apisecret.length !== 30) {
			READY = false;
			engine.log('ERROR: Invalid Client-Secret entered!');
		}
	}
	// Check if values are set properly
	if (!config.interval) config.interval = 5;
	if (config.interval < 1) config.interval = 1;
	if (!config.dev_latency) config.dev_latency = 100;
	if (config.dev_latency < 0) config.dev_latency = 0;
	if (!config.dev_timeout) config.dev_timeout = 5000;
	if (config.dev_timeout < 1000) config.dev_timeout = 1000;
	if (!config.dev_menu) config.dev_debug = false;

	const INTERVAL = Math.floor(config.interval);
	const DEBUG = config.dev_debug;
	const APIKEY = config.twitch_apikey;
	const APISECRET = config.twitch_apisecret;
	const LATENCY = Math.floor(config.dev_latency);
	const TIMEOUT = Math.floor(config.dev_timeout);
	var TOKEN = '';

	/**
	 * Run at start-up / settings reload
	 */
	function startup() {
		engine.log(`Started ${meta.name} (${meta.version}) by >> @${meta.author} <<`);
		let toDelete = store.getKeysInstance();
		for (let i = 0; i < toDelete.length; i++) store.unsetInstance(toDelete[i]);
		if (DEBUG) engine.log('Successfully deleted cache!');
		// Check individual channel settings
		let offset = 0;
		for (let i = 0; i < config.indi.length; i++) {
			if (!config.indi[i].Streamername) {
				engine.log(`ERROR: No streamer name set by field ${i + 1}`);
				offset++;
				continue;
			}
			if (!config.indi[i].OutputChannel) {
				engine.log(`ERROR: No streamer output channel by field ${i + 1}`);
				offset++;
				continue;
			}
			if (!config.indi[i].PictureWidth) config.indi[i].PictureWidth = 400;
			if (!config.indi[i].PictureHeight) config.indi[i].PictureHeight = 225;
			let storeTTv = new TwitchStatus();
			storeTTv.TTvChannelname = `${config.indi[i].Streamername}`;
			storeTTv.StreamerUID = config.indi[i].StreamerUID;
			storeTTv.ChannelID = config.indi[i].OutputChannel;
			(!config.indi[i].OfflineText) ? storeTTv.OfflineText = '%Streamer is offline.' : storeTTv.OfflineText = config.indi[i].OfflineText;
			(!config.indi[i].OnlineText) ? storeTTv.OnlineText = '%Streamer (%Game) is online!' : storeTTv.OnlineText = config.indi[i].OnlineText;
			(!config.indi[i].description) ? storeTTv.Description = '[center][b][size=+2]%Streamer[/size][/b]\n%Pic[/center]\n[b]Title:[/b] %Title\n\n[b]Game:[/b] %Game\n[b]Uptime:[/b] %Uptime\n\n%Link\n\n[b]Viewer:[/b] %Viewer\n[b]Follower:[/b] %Follower\n[b]Status:[/b] %Status\n\n[b]Emotes:[/b] %Emotes'	: storeTTv.Description = config.indi[i].description;
			(!config.indi[i].PicReplace) ? storeTTv.PicReplace = false : storeTTv.PicReplace = config.indi[i].PicReplace;
			storeTTv.Picture = new Picture(config.indi[i].PictureSize, config.indi[i].PictureWidth, config.indi[i].PictureHeight);
			storeTTv.UpdateDisableOnline = config.indi[i].UpdateDisableOnline;
			store.setInstance(`TTvData_${i - offset}`, storeTTv);
			let errorTTv = new ErrorLog();
			store.setInstance(`TTvError_${i - offset}`, errorTTv);
		}
		// Delay the initial run and start recurring cycle
		if (DEBUG) engine.log('Initial Run in 5s...');
		setTimeout(Run, 5000);
		setInterval(Run, INTERVAL * 60000);
	}
	/**
	 * Recurring run of the data update cycles
	 */
	function Run() {
		if (DEBUG) engine.log('Started new update cycle!');
		Auth()
		.then(result => {
			if (result == 'retry') {
				engine.log(`>> Retrying authentification next cycle...`);
				return;
			}
			for (let j = 0; j < (store.getKeysInstance().length)/2; j++) FetchData(`TTvData_${j}`,`TTvError_${j}`);
		},
		error => { READY = false;
			engine.log(`FATAL Error: API credentials rejected by Twitch ... Stopping ${meta.name}`);
		})
	}
	/**
	 * Cycle once through all APIs, save their data and if successful, finally update the channel
	 * @param {string} key_name		stored key string of a "Twitch-Channel"
	 * @param {string} error_name	of error object
	 */
	function FetchData(key_name, error_name) {
		if (!READY) return;
		if (!backend.isConnected()) return;
		// Delete API log
		let resetlog = new ErrorLog();
		store.setInstance(error_name, resetlog);

		// Chaining all the shit together
		API_Users(key_name, error_name)
		.then(Sleeper(LATENCY))
		.then(key_name => API_Followers(key_name, error_name))
		.then(Sleeper(LATENCY))
		.then(key_name => API_Streams(key_name, error_name))
		.then(Sleeper(LATENCY))
		.then(key_name => API_Games(key_name, error_name))
		.then(Sleeper(LATENCY))
		.then(key_name => API_SubEmotes(key_name, error_name))
		.then(Sleeper(LATENCY))
		.then(key_name => API_BetterEmotes(key_name, error_name))
		.then(Sleeper(LATENCY))
		.then(key_name => {
			let key_value = store.getInstance(key_name);
			let error_log = store.getInstance(error_name);
			let noError = true;
			key_value.firstRun = false;
			if (error_log.StatusEmote == 404) error_log.StatusEmote = 200;
			if (error_log.StatusUser != 200 || error_log.StatusFollower != 200 || error_log.StatusStreams != 200 || error_log.StatusGames != 200 || error_log.StatusEmote != 200 || error_log.StatusBTTV != 200) noError = false;
			if (DEBUG || !noError) {
				let logoutput = '';
				for (let i = 0; i < 6; i++) {
					let status = '';
					let error = '';
					let array = ['User-Data','Follower','Stream-Data','Game','SUBemotes','BTTVemotes'];
					switch (i) {
						case 0:
							status = error_log.StatusUser;
							error = error_log.ErrorUser;
							break;
						case 1:
							status = error_log.StatusFollower;
							error = error_log.ErrorFollower;
							break;
						case 2:
							status = error_log.StatusStreams;
							error = error_log.ErrorStreams;
							break;
						case 3:
							status = error_log.StatusGames;
							error = error_log.ErrorGames;
							break;
						case 4:
							status = error_log.StatusEmote;
							error = error_log.ErrorEmote;
							break;
						case 5:
							status = error_log.StatusBTTV;
							error = error_log.ErrorBTTV;
							break;
					}
					error = (error == undefined) ? '-' : error;
					if (error == 'failed prior') {
						logoutput += 'not completed';
						break;
					}
					else logoutput += `${array[i]} (${status}:${error})`;
					if (i < 5) logoutput += ' - ';
				}
				engine.log(`API-Summary (${key_value.TTvChannelname}) / ${logoutput}`);
			}
			store.setInstance(key_name, key_value);
			setTimeout(() => { UpdateChannel(key_name) }, LATENCY * 2);
			// Re-Auth if authentification failed prior
			if (error_log.StatusUser == 401) TOKEN = "";
		});
	}
//	###########################################  API-Functions  ###########################################
	/**
	 * Download the basic JSON data for the Twitch-Channel
	 * @param {Object} key_name		stored object
	 * @param {string} error_name	of error object
	 */
	function API_Users(key_name, error_name) {
		return new Promise(resolve => {
			let key_value = store.getInstance(key_name);
			let e_log = store.getInstance(error_name);
			if (!key_value || !key_value.TTvChannelname) {
				e_log.StatusUser = 400;
				e_log.ErrorUser = 'channel not existing';
				store.setInstance(error_name,e_log);
				engine.log(`ERROR: channel NOT EXISTING >>> check your settings!`);
				resolve(key_name);
				return;
			}
			let ch_name = (key_value) ? key_value.TTvChannelname : '';
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/users?login=${ch_name}`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					e_log.StatusUser = 503;
					e_log.ErrorUser = 'no response';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				e_log.StatusUser = response.statusCode;
				if (response.statusCode != 200) {
					if (DEBUG) engine.log(`> User Data >> FAILED >>> ${ch_name}`);
					e_log.ErrorUser = 'channel not existing';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				let data = JSON.parse(response.data.toString());
				e_log.ErrorUser = data.error;
				store.setInstance(error_name,e_log);
				key_value.TTvUsersData = data;
				store.setInstance(key_name,key_value);
				if (DEBUG) engine.log(`> User Data >> 100% >>> ${ch_name}`);
				resolve(key_name);
				return;
			});
		})
	}
	/**
	 * Download the current follower count
	 * @param {Object} key_name		stored object
	 * @param {string} error_name	of error object
	 */
	function API_Followers(key_name, error_name) {
		return new Promise(resolve => {
			let key_value = store.getInstance(key_name);
			let e_log = store.getInstance(error_name);
			if (e_log.StatusUser != 200) {
				e_log.StatusFollower = e_log.StatusUser;
				e_log.ErrorFollower = 'failed prior';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			let ch_name = (key_value) ? key_value.TTvChannelname : '';
			let user_id = key_value.TTvUsersData.data[0].id;
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/users/follows?to_id=${user_id}&first=1`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					e_log.StatusFollower = 503;
					e_log.ErrorFollower = 'no response';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				e_log.StatusFollower = response.statusCode;
				if (response.statusCode != 200) {
					if (DEBUG) engine.log(`> Follower Count >> FAILED >>> ${ch_name}`);
					e_log.ErrorFollower = 'channel not existing';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				let data = JSON.parse(response.data.toString());
				e_log.ErrorFollower = data.error;
				store.setInstance(error_name,e_log);
				key_value.TTvFollowerData = data;
				store.setInstance(key_name,key_value);
				if (DEBUG) engine.log(`> Follower Count >> 100% >>> ${ch_name}`);
				resolve(key_name);
				return;
			});
		})
	}
	/**
	 * Fetch stream details (only for LIVE streams)
	 * @param {Object} key_name		stored object
	 * @param {string} error_name	of error object
	 */
	function API_Streams(key_name, error_name) {
		return new Promise(resolve => {
			let key_value = store.getInstance(key_name);
			let e_log = store.getInstance(error_name);
			if (e_log.StatusFollower != 200) {
				e_log.StatusStreams = e_log.StatusFollower;
				e_log.ErrorStreams = 'failed prior';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			let ch_name = (key_value) ? key_value.TTvChannelname : '';
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/streams?user_login=${ch_name}`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					e_log.StatusStreams = 503;
					e_log.ErrorStreams = 'no response';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				e_log.StatusStreams = response.statusCode;
				if (response.statusCode != 200) {
					if (DEBUG) engine.log(`> Channel Data >> FAILED >>> ${ch_name}`);
					e_log.ErrorStreams = 'channel not existing';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				let data = JSON.parse(response.data.toString());
				e_log.ErrorStreams = data.error;
				store.setInstance(error_name,e_log);
				key_value.TTvStreamData = data;
				store.setInstance(key_name,key_value);
				if (DEBUG) engine.log(`> Channel Data >> 100% >>> ${ch_name}`);
				resolve(key_name);
				return;
			});
		})
	}
	/**
	 * Fetch game names through game IDs
	 * @param {Object} key_name		stored object
	 * @param {string} error_name	of error object
	 */
	function API_Games(key_name, error_name) {
		return new Promise(resolve => {
			let key_value = store.getInstance(key_name);
			let e_log = store.getInstance(error_name);
			if (e_log.StatusStreams != 200) {
				e_log.StatusGames = e_log.StatusStreams;
				e_log.ErrorGames = 'failed prior';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			let ch_name = (key_value) ? key_value.TTvChannelname : '';
			if (key_value.TTvStreamData == "" || key_value.TTvStreamData.data[0] == undefined) {
				e_log.StatusGames = 200;
				e_log.ErrorGames = 'offline';
				store.setInstance(error_name,e_log);
				if (DEBUG) engine.log(`> Game Title >> OFFLINE >>> ${ch_name}`);
				resolve(key_name);
				return;
			}
			let game_id = key_value.TTvStreamData.data[0].game_id;
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/games?id=${game_id}`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					e_log.StatusGames = 503;
					e_log.ErrorGames = 'no response';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}				
				e_log.StatusGames = response.statusCode;
				if (response.statusCode != 200) {
					if (DEBUG) engine.log(`> Game Title >> FAILED >>> ${ch_name}`);
					e_log.ErrorGames = 'channel not existing';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				let data = JSON.parse(response.data.toString());
				e_log.ErrorGames = data.error;
				store.setInstance(error_name,e_log);
				key_value.TTvGameData = data;
				store.setInstance(key_name,key_value);
				if (DEBUG) engine.log(`> Game Title >> 100% >>> ${ch_name}`);
				resolve(key_name);
				return;
			});
		})
	}
	/**
	 * Fetch subscriber emotes
	 * @param {Object} key_name		stored object
	 * @param {string} error_name	of error object
	 */
	function API_SubEmotes(key_name, error_name) {
		return new Promise(resolve => {
			let key_value = store.getInstance(key_name);
			let e_log = store.getInstance(error_name);
			let firstRun = key_value.firstRun;
			if (firstRun && !config.instantEmotes) {
				e_log.StatusEmote = 200;
				e_log.ErrorEmote = 'initial run';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			if (e_log.StatusGames != 200) {
				e_log.StatusEmote = e_log.StatusGames;
				e_log.ErrorEmote = 'failed prior';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			let ch_name = (key_value) ? key_value.TTvChannelname : '';
			let user_id = key_value.TTvUsersData.data[0].id;
			let emotes = '';
			let emotesSets = [];
			let subemotes = 'no SUB emotes';
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitchemotes.com/api/v4/channels/${user_id}`,
				timeout: TIMEOUT
			}, (error, response) => {
				if (response == undefined) {
					e_log.StatusEmote = 530;
					e_log.ErrorEmote = 'no response';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				e_log.StatusEmote = response.statusCode;
				if (response.statusCode != 200) {
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				let data = JSON.parse(response.data.toString());
				e_log.ErrorEmote = data.error;
				store.setInstance(error_name,e_log);
				if (data.error == "Channel not found") {
					if (DEBUG) engine.log(`> SUB-Emotes >> FAILED >>> for channel ${ch_name} not found!`);
					resolve(key_name);
					return;
				}
				for (let i = 0; i < data.emotes.length; i++) {
					if (!emotesSets.includes(data.emotes[i].emoticon_set)) emotes = emotes + '\n' + `[img]https://static-cdn.jtvnw.net/emoticons/v1/${data.emotes[i].id}/1.0[/img] ${data.emotes[i].code}`;
				}
				emotes = emotes + '\n';
				if (emotes.length > 0) subemotes = emotes;
				key_value.Subemotes = subemotes;
				store.setInstance(key_name,key_value);
				if (DEBUG) engine.log(`> SUB-Emotes >> 100% >>> ${ch_name}`);
				resolve(key_name);
				return;
			});
		})
	}
	/**
	 * Fetch BetterTTV emotes
	 * @param {Object} key_name		stored object
	 * @param {string} error_name	of error object
	 */
	function API_BetterEmotes(key_name, error_name) {
		return new Promise(resolve => {
			let key_value = store.getInstance(key_name);
			let e_log = store.getInstance(error_name);
			let firstRun = key_value.firstRun;
			if ((firstRun && !config.instantEmotes) || !config.EnableBTTV) {
				e_log.StatusBTTV = 200;
				e_log.ErrorBTTV = 'disabled/initial run';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			if (e_log.StatusGames != 200) {
				e_log.StatusBTTV = e_log.StatusGames;
				e_log.ErrorBTTV = 'failed prior';
				store.setInstance(error_name,e_log);
				resolve(key_name);
				return;
			}
			let ch_name = (key_value) ? key_value.TTvChannelname : '';
			let Betteremotes = 'no BTTV emotes';
			http.simpleRequest({
				method: "GET",
				url: `https://api.betterttv.net/2/channels/${ch_name}`,
				timeout: TIMEOUT,
				headers: { "Content-Type": "application/json" }
			}, (error, response) => {
				if (response == undefined) {
					e_log.StatusBTTV = 530;
					e_log.ErrorBTTV = 'no response';
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				e_log.StatusBTTV = response.statusCode;
				if (response.statusCode == 404) {
					if (DEBUG) engine.log(`> BTTV-Emotes >> FAILED >>> for channel ${ch_name} not found!`);
					store.setInstance(error_name,e_log);
					resolve(key_name);
					return;
				}
				let data = JSON.parse(response.data.toString());
				e_log.ErrorBTTV = data.error;
				store.setInstance(error_name,e_log);
				let emotesBetter = '\n';
				for (let i = 0; i < data.emotes.length; i++) emotesBetter = `${emotesBetter}[img]https://cdn.betterttv.net/emote/${data.emotes[i].id}/1x[/img] ${data.emotes[i].code}` + '\n';
				if (data.emotes.length > 0) Betteremotes = emotesBetter;
				key_value.Betteremotes = Betteremotes;
				store.setInstance(key_name,key_value);
				if (DEBUG) engine.log(`> BTTV-Emotes >> 100% >>> ${ch_name}`);
				resolve(key_name);
				return;
			});
		})
	}
	/**
	 * Twitch-API token authentification
	 */
	function Auth() {
		return new Promise((resolve, reject) => {
			if (TOKEN != '') {
				resolve('already auth\'ed');
				return;
			}
			http.simpleRequest({
				method: "POST",
				url: `https://id.twitch.tv/oauth2/token?client_id=${APIKEY}&client_secret=${APISECRET}&grant_type=client_credentials`,
				timeout: TIMEOUT
			}, (error, response) => {
				if (response == undefined) {
					engine.log(`API-Error 503: no response!`);
					resolve('retry');
					return;
				}
				let data = JSON.parse(response.data.toString());
				if (response.statusCode != 200) {
					engine.log(`API-Error ${data.status}: ${data.message}!`);
					reject('failed');
					return;
				}
				TOKEN = data.access_token;
				engine.log('>> API-Token authentification successful!');
				resolve('success');
				return;
			});
		});
	}
//	##########################################  / API-Functions  ##########################################
	/**
	 * Edit a single channel's name & description
	 * @param {string} key_name		of the key where to store fetched API data
	 */
	function UpdateChannel(key_name) {
		if (!backend.isConnected()) return;
		if (typeof store.getInstance(key_name).ChannelID == 'undefined') return;
		
		var live = false;
		var key_value = store.getInstance(key_name);
		var ch = backend.getChannelByID(key_value.ChannelID);
		var user = (key_value.StreamerUID && key_value.StreamerUID.length == 28) ? backend.getClientByUID(key_value.StreamerUID) : undefined;

		// Check if fetched data is present at all
		if (key_value.TTvUsersData == '' || key_value.TTvUsersData.data[0] == undefined) {
			engine.log(`ERROR: Incomplete data from API for: ${key_value.TTvChannelname} >> SKIP!`);
			return;
		}
		// Check if live
		if (!(key_value.TTvStreamData.data[0] == undefined)) {
			if (key_value.TTvStreamData.data[0].type == 'live') live = true;
		}
		else {
			live = false;
			key_value.IsOnline = false;
			store.setInstance(key_name, key_value);
		}

		// Get the fetched information
		var twitchchannel = key_value.TTvStreamData.data[0];
		var twitchstreams = key_value.TTvUsersData.data[0];
		var followCount = key_value.TTvFollowerData.total;
		var gameNames = key_value.TTvGameData;
		var nick = twitchstreams.display_name;
		var chname = twitchstreams.login;
		var url = `https://www.twitch.tv/${chname}`;
		var logo = `[img]${twitchstreams.profile_image_url}[/img]`;
		var viewers = '';
		var followers = '';
		var result = '';
		var result2 = '';
		var resultdesc = key_value.Description;

		// HERE YOU CAN CHANGE SOME OUTPUT TEXT (mostly when offline)
		var title = '>> offline <<';
		var uptime = title;
		var imgshow = '';
		var game = 'N/A';
		var partner = twitchstreams.broadcaster_type;		// Twitch-Userstatus
		switch (partner) {
			case 'partner':
				partner = 'Twitch-Partner';
				break;
			case 'affiliate':
				partner = 'Twitch-Affiliate';
				break;
			default: partner = 'Twitch-User';
		}
		// HERE YOU CAN CHANGE SOME OUTPUT TEXT

		// Set uptime & Game title
		if (live) {
			let now = Date.now();
			let date = Date.parse(twitchchannel.started_at);
			var diffTime = now-date;
			let h = Math.floor(diffTime/1000/60/60);
			let m = Math.floor((diffTime/1000/60/60 - h)*60);
			uptime = `${h}h ${m}min`;
			title = twitchchannel.title;
			game = gameNames.data[0].name;
		}
		// Follower
		for (let i = 1; i <= followCount.toString().length; i++) {
			let round = i % 3;
			followers = followCount.toString()[followCount.toString().length - i] + followers;
			if (round == 0 && i != followCount.toString().length) followers = `.${followers}`;
		}
		// Stream is OFFLINE
		if (!live) {
			viewers = '0';
			if (key_value.PicReplace) resultdesc = resultdesc.replace('%Pic', '%Logo');
			result = key_value.OfflineText.replace('%Streamer', nick);
			if (result.length >= 40) result = result.substring(0, 37) + '...';

			// LIVE-Group:  Checking if still has LIVE-Group
			if (config.StreamerGrActive) {
				if (user != undefined) {
					if (HasServerGroupWithId(user, config.StreamerGrID.toString())) {
						user.removeFromServerGroup(config.StreamerGrID);
						if (DEBUG) engine.log(`Removed ${nick}'s OnlineGroup`);
					}
					else if (DEBUG) engine.log(`${nick}'s already not in group >> skip`);
				}
				else if (DEBUG) {
					if (key_value.StreamerUID.length == 28) engine.log(`${nick} isn't online on server >> skip`);
					else engine.log(`Invalid UUID for ${nick} >> skip`);
				}
			}
		}
		// Stream is LIVE
		else {
			// Viewers with 1k dots
			for (let i = 1; i <= twitchchannel.viewer_count.toString().length; i++) {
				let round = i % 3;
				viewers = twitchchannel.viewer_count.toString()[twitchchannel.viewer_count.toString().length - i] + viewers;
				if (round == 0 && i != twitchchannel.viewer_count.toString().length) viewers = `.${viewers}`;
			}

			// Adjust pictures links
			switch (key_value.Picture.Size) {
				case "0":
					imgshow = `${twitchchannel.thumbnail_url.substring(0, twitchchannel.thumbnail_url.length - 20)}80x45.jpg`;
					break;
				case "1":
					imgshow = `${twitchchannel.thumbnail_url.substring(0, twitchchannel.thumbnail_url.length - 20)}320x180.jpg`;
					break;
				case "2":
					imgshow = `${twitchchannel.thumbnail_url.substring(0, twitchchannel.thumbnail_url.length - 20)}640x360.jpg`;
					break;
				case "3":
					imgshow = `${twitchchannel.thumbnail_url.substring(0, twitchchannel.thumbnail_url.length - 20) + key_value.Picture.Width}x${key_value.Picture.Height}.jpg`;
					break;
			}
			imgshow = `[img]${imgshow}?${Date.now()}[/img]`;

			// Shorten game titles
			var tempStreamGame = game;
			if (config.swapGameArray != undefined) var FoundMatchIndex = config.swapGameArray.findIndex((element) => { if (element.swapGameCheck == game) return element; });
			else FoundMatchIndex = -1;
			if (FoundMatchIndex != -1) {
				let gameAfter = config.swapGameArray[FoundMatchIndex].swapGameReplace;
				if (gameAfter != undefined) tempStreamGame = gameAfter;
			}
			// Replacing and limiting channel name
			result = key_value.OnlineText
				.replace('%Streamer', nick)
				.replace('%Game', game)
				.replace('%Viewer', viewers);
			result2 = key_value.OnlineText
				.replace('%Streamer', nick)
				.replace('%Game', tempStreamGame)
				.replace('%Viewer', viewers);
			if (result.length >= 40) {
				if (result2.length >= 40) {
					result = `${result2.substring(0, 37)}...`;
					engine.log('WARNING: Name too long > 40... Trying to shorten, you may still have problems while using this channel name.');
				}
				else result = result2;
			}
			// LIVE-Group:  Checking if yet missing the LIVE-Group
			if (config.StreamerGrActive) {
				if (user != undefined) {
					if (!HasServerGroupWithId(user, config.StreamerGrID.toString())) {
						user.addToServerGroup(config.StreamerGrID);
						if (DEBUG) engine.log(`Added ${nick}'s OnlineGroup`);
					}
					else if (DEBUG) engine.log(`${nick}'s already in group >> skip`);
				}
				else if (DEBUG) {
					if (key_value.StreamerUID.length == 28) engine.log(`${nick} isn't online on server >> skip`);
					else engine.log(`Invalid UUID for ${nick} >> skip`);
				}
			}
		}
		// Replacing description
		resultdesc = resultdesc
			.replace(/%Streamer/gi, nick)
			.replace(/%Pic/gi, imgshow)
			.replace(/%Title/gi, title)
			.replace(/%Game/gi, game)
			.replace(/%Uptime/gi, uptime)
			.replace(/%Link/gi, `[url]${url}[/url]`)
			.replace(/%URL/gi, url)
			.replace(/%Follower/gi, followers)
			.replace(/%Viewer/gi, viewers)
			.replace(/%Status/gi, partner)
			.replace(/%Emotes/gi, key_value.Subemotes)
			.replace(/%Betteremotes/gi, key_value.Betteremotes)
			.replace(/%Logo/gi, logo);
		// Skip update if already online
		if (key_value.IsOnline && key_value.UpdateDisableOnline) {
			if (DEBUG) engine.log(`${nick}'s channel won't be updated, as specified in the settings.`);
			return;
		}
		// Shorten length of description to approx. maximum of 8196 byte
		resultdesc = resultdesc.substr(0, 7196);
		if (resultdesc.length == 7196) resultdesc = resultdesc.substr(0, resultdesc.lastIndexOf('[img]')) + '\n[b]exceeded limit[/b]';
		// Combined channel update to reduce server log spam
		if ((result != ch.name()) || (resultdesc != ch.description())) {
			// @ts-ignore
			ch.update({ name: result, description: resultdesc });
			if (DEBUG) engine.log(`Updated ${nick}'s channel! Confirm manually whether successful...`);
		}
		// Tag as Online to skip multiple updates if setting is ON
		if (live) {
			key_value.IsOnline = true;
			store.setInstance(key_name, key_value);
		}
		// Checking whether to deliver server message about going live
		if (live && config.ServerMsgActive) {
			let cameOnline = false;
			let resultMsg = config.ServerMsgContent
				.replace(/%Streamer/gi, nick)
				.replace(/%Game/gi, game)
				.replace(/%URL/gi, url.substr(8));
			if (diffTime <= INTERVAL * 60000 - 20000) cameOnline = true;
			if (cameOnline) {
				if (config.flamboyantMode) resultMsg = '\n\n' + resultMsg + '\n[b][/b]';
				backend.chat(resultMsg);
				if (DEBUG) engine.log(`${nick} started streaming >> server message sent!`);
			}
		}
	}
	/**
	 * Auxiliary function to check for a servergroup
	 * @param {Client} client	to be checked
	 * @param {string} groupId	to check for
	 */
	function HasServerGroupWithId(client, groupId) {
		let clientsGroups = [];
		client.getServerGroups().forEach((group) => {
				clientsGroups.push(group.id());})
		if(clientsGroups.indexOf(groupId) > -1) return true;
		return false;
	}
	/**
	 * Delays a promise
	 * @param {number} ms	wait time in milliseconds
	 */
	function Sleeper(ms) {
		return function(x) {
			return new Promise(resolve => setTimeout(() => resolve(x), ms));
		};
	}

	var TwitchStatus = /** @class */ (function () {
		function TwitchStatus() {
			this.TTvChannelname = '';
			this.TTvUsersData = '';
			this.TTvStreamData = '';
			this.TTvFollowerData = '0';
			this.TTvGameData = '';
			this.StreamerUID = '0';
			this.ChannelID = '';
			this.Description = '';
			this.OfflineText = '';
			this.OnlineText = '';
			this.Picture = new Picture();
			this.PicReplace = false;
			this.UpdateDisableOnline = false;
			this.IsOnline = false;
			this.firstRun = true;
			this.Subemotes = 'no SUB emotes';
			this.Betteremotes = 'no BTTV emotes';
		}
		return TwitchStatus;
	}());

	var ErrorLog = /** @class */ (function () {
		function ErrorLog() {
			this.StatusUser = null;
			this.ErrorUser = null;
			this.StatusFollower = null;
			this.ErrorFollower = null;
			this.StatusStreams = null;
			this.ErrorStreams = null;
			this.StatusGames = null;
			this.ErrorGames = null;
			this.StatusEmote = null;
			this.ErrorEmote = null;
			this.StatusBTTV = null;
			this.ErrorBTTV = null;
		}
		return ErrorLog;
	}());

	var Picture = /** @class */ (function () {
		function Picture(Size, Width, Height) {
			this.Size = Size;
			this.Width = Width;
			this.Height = Height;
		}
		return Picture;
	}());

	/**
	 * Start only if Twitch credentials are present
	 */
	event.on('load', (_) => {
		if (READY) startup();
		else engine.log(`FATAL Error: Missing crucial settings ... Stopping ${meta.name}`)
	});
});