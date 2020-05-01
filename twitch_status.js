registerPlugin({
	name: 'Twitch Status!',
	version: '2.0.0-b15',
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
			title: 'Channel description: (%Streamer, %Pic ([img] not required), %Title, %Game, %Uptime, %Link (BB-Tag included), %URL, %Follower, %Viewer, %Status, %Emotes, %Betteremotes, %Logo ([img] not required))',
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
			title: 'Show profile picture when stream is offline >> else there just won\'t be any picture!',
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

	// Verify length of Twitch ClientID and Secret
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
	const E_LOG = [{ "error" : null, "status" : null }, { "error" : null, "status" : null }, { "error" : null, "status" : null }, { "error" : null, "status" : null }, { "error" : null, "status" : null }, { "error" : null, "status" : null }];
	var TOKEN = "";

	/**
	 * Run at start-up / settings reload
	 */
	function startup() {
		engine.log(`Started ${meta.name} (${meta.version}) by >> @${meta.author} <<`);
		let toDelete = store.getKeysInstance();
		for (var i = 0; i < toDelete.length; i++) {
			store.unsetInstance(toDelete[i]);			
		}
		if (DEBUG) engine.log('Successfully deleted cache!');
		// Check individual channel settings
		for (var i = 0; i < config.indi.length; i++) {
			if (!config.indi[i].Streamername) {
				engine.log(`ERROR: No streamer name set by field ${i + 1}`);
				continue;
			}
			if (!config.indi[i].OutputChannel) {
				engine.log(`ERROR: No streamer output channel by field ${i + 1}`);
				continue;
			}
			if (!config.indi[i].PictureWidth) config.indi[i].PictureWidth = 400;
			if (!config.indi[i].PictureHeight) config.indi[i].PictureHeight = 225;
			var storeTTv = new TwitchStatus();
			storeTTv.TTvChannelname = `${config.indi[i].Streamername}`;
			storeTTv.StreamerUID = config.indi[i].StreamerUID;
			storeTTv.ChannelID = config.indi[i].OutputChannel;
			(!config.indi[i].OfflineText) ? storeTTv.OfflineText = '%Streamer is offline.' : storeTTv.OfflineText = config.indi[i].OfflineText;
			(!config.indi[i].OnlineText) ? storeTTv.OnlineText = '%Streamer (%Game) is online!' : storeTTv.OnlineText = config.indi[i].OnlineText;
			(!config.indi[i].description) ? storeTTv.Description = '[center][b][size=+2]%Streamer[/size][/b]\n%Pic[/center]\n[b]Title:[/b] %Title\n\n[b]Game:[/b] %Game\n[b]Uptime:[/b] %Uptime\n\n%Link\n\n[b]Viewer:[/b] %Viewer\n[b]Follower:[/b] %Follower\n[b]Status:[/b] %Status\n\n[b]Emotes:[/b] %Emotes'	: storeTTv.Description = config.indi[i].description;
			(!config.indi[i].PicReplace) ? storeTTv.PicReplace = "0" : storeTTv.PicReplace = config.indi[i].PicReplace;
			storeTTv.Picture = new Picture(config.indi[i].PictureSize, config.indi[i].PictureWidth, config.indi[i].PictureHeight);
			storeTTv.UpdateDisableOnline = config.indi[i].UpdateDisableOnline;
			store.setInstance("TTvData_" + i, storeTTv);
		}
		// Delay the initial run and start recurring cycle
		if (DEBUG) engine.log('Initial Run in 5s...');
		setTimeout(Run, 5000);
		setInterval(Run, INTERVAL * 60000);
	}

//	#####################  Debug Functions  #####################
event.on('chat', function (ev) {
	if (ev.text == "auth") Auth();
});
event.on('chat', function (ev) {
	if (ev.text == "valid") Validate();
});
//	#####################  Debug Functions  #####################

	/**
	 * Initialising the cycles
	 */
	function Run() {
		if (DEBUG) engine.log('Started fresh update cycle...');

		for (var j = 0; j < store.getKeysInstance().length; j++) {
			FetchData(`TTvData_${j}`);
		}
	}
	/**
	 * Cycle once through all APIs and save their data
	 * @param {string} key_name		stored key string of a "Channel"
	 */
	function FetchData(key_name) {
		let READY = true;
		if (!backend.isConnected() || (typeof store.getInstance(key_name).TTvChannelname) == 'undefined') READY = false;
		if (!READY) return;

		let key_value = store.getInstance(key_name);
		key_value.e_log = E_LOG;

		API_Users(key_value)
		.then(sleeper(LATENCY))
		.then(key_result => API_Followers(key_result))
		.then(sleeper(LATENCY))
		.then(key_result => API_Streams(key_result))
		.then(sleeper(LATENCY))
		.then(key_result => API_Games(key_result))
		.then(sleeper(LATENCY))
		.then(key_result => API_SubEmotes(key_result, key_value.firstRun))
		.then(sleeper(LATENCY))
		.then(key_result => API_BetterEmotes(key_result, key_value.firstRun))
		.then(sleeper(LATENCY))
		.then(key_result => {
			key_result.firstRun = false;

			let e_log = key_result.e_log;
			let noError = true;
			if (e_log[4].status == 404) e_log[4].status = 200;
			e_log.forEach((arr) => {
				if (arr.status !== 200) noError = false;
			})
			if (DEBUG || !noError) engine.log(`API-Status-Log: ${key_value.TTvChannelname} - ${JSON.stringify(e_log)}`);

			store.setInstance(key_name, key_result);
			setTimeout(() => { UpdateChannel(key_name) }, LATENCY * 2);
		});
	}
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
		if (key_value.TTvUsersData == "" || key_value.TTvUsersData.data[0] == undefined) {
			engine.log(`ERROR: Incomplete data from API for: ${key_value.TTvChannelname} >> SKIP!`);
			return;
		}
		// Check if live
		if (!(key_value.TTvStreamData.data[0] == undefined)) {
			if (key_value.TTvStreamData.data[0].type == "live") live = true;
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
		var imgshow = '';
		var viewers = '';
		var followers = '';
		var result = '';
		var result2 = '';
		var resultdesc = key_value.Description;

		// Exclude some function when offline, API limitations
		var title = ">> offline <<";
		var game = "N/A";
		var uptime = title;
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
		// Twitch-Status
		var partner = twitchstreams.broadcaster_type;
		switch (partner) {
			case "partner":
				partner = "Twitch-Partner";
				break;
			case "affiliate":
				partner = "Twitch-Affiliate";
				break;
			default: partner = "Twitch-User";
		}
		// Follower
		for (var i = 1; i <= followCount.toString().length; i++) {
			var round = i % 3;
			followers = followCount.toString()[followCount.toString().length - i] + followers;
			if (round == 0 && i != followCount.toString().length) followers = `.${followers}`;
		}

		// Stream is OFFLINE
		if (!live) {
			viewers = "0";
			if (key_value.PicReplace) resultdesc = resultdesc.replace('%Pic', '%Logo');
			result = key_value.OfflineText.replace('%Streamer', nick);
			if (result.length >= 40) result = result.substring(0, 37) + "...";

			// LIVE-Group:  Checking if still has LIVE-Group
			if (config.StreamerGrActive) {
				if (user != undefined) {
					if (hasServerGroupWithId(user, config.StreamerGrID.toString())) {
						user.removeFromServerGroup(config.StreamerGrID);
						if (DEBUG) engine.log(`Removed ${nick}'s OnlineGroup`);
					}
					else {
						if (DEBUG) engine.log(`${nick}'s already not in group >> skip`);
					}
				}
				else {
					if (DEBUG) {
						if (key_value.StreamerUID.length == 28) engine.log(`${nick} isn't online on server >> skip`);
						else engine.log(`Invalid UUID for ${nick} >> skip`);
					}
				}
			}
		}
		// Stream is LIVE
		else {
			// Viewers with 1k dots
			for (var i = 1; i <= twitchchannel.viewer_count.toString().length; i++) {
				var round = i % 3;
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
			if (config.swapGameArray != undefined) {
				var FoundMatchIndex = config.swapGameArray.findIndex(function(element){
					if (element.swapGameCheck == game) return element;
				});
			}
			else {
				FoundMatchIndex = -1;
			}
			if (FoundMatchIndex != -1) {
				var gameAfter = config.swapGameArray[FoundMatchIndex].swapGameReplace;
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
					engine.log("WARNING: Name too long > 40... Trying to shorten, you may still have problems while using this channel name.");
				}
				else result = result2;
			}
			// LIVE-Group:  Checking if yet missing the LIVE-Group
			if (config.StreamerGrActive) {
				if (user != undefined) {
					if (!hasServerGroupWithId(user, config.StreamerGrID.toString())) {
						user.addToServerGroup(config.StreamerGrID);
						if (DEBUG) engine.log(`Added ${nick}'s OnlineGroup`);
					}
					else {
						if (DEBUG) engine.log(`${nick}'s already in group >> skip`);
					}
				}
				else {
					if (DEBUG) {
						if (key_value.StreamerUID.length == 28) engine.log(`${nick} isn't online on server >> skip`);
						else engine.log(`Invalid UUID for ${nick} >> skip`);
					}
				}
			}
		}
		// Replacing description
		resultdesc = resultdesc
			.replace('%Streamer', nick)
			.replace('%Pic', imgshow)
			.replace('%Title', title)
			.replace('%Game', game)
			.replace('%Uptime', uptime)
			.replace('%Link', `[url]${url}[/url]`)
			.replace('%URL', url)
			.replace('%Follower', followers)
			.replace('%Viewer', viewers)
			.replace('%Status', partner)
			.replace('%Emotes', key_value.Subemotes)
			.replace('%Betteremotes', key_value.Betteremotes)
			.replace('%Logo', logo);
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
			var cameOnline = false;
			var resultMsg = config.ServerMsgContent
				.replace('%Streamer', nick)
				.replace('%Game', game)
				.replace('%URL', url.substr(8));
			if (diffTime <= INTERVAL * 60000 - 20000) cameOnline = true;
			if (cameOnline) {
				if (config.flamboyantMode) resultMsg = '\n\n' + resultMsg + '\n[b][/b]';
				backend.chat(resultMsg);
				if (DEBUG) engine.log(`${nick} started streaming >> server message sent!`);
			}
		}
	}
//	###########################################  API-Functions  ###########################################
	/**
	 * Download the basic JSON data for the channel
	 * @param {Object} key_value	stored object
	 */
	function API_Users(key_value) {
		return new Promise((resolve, reject) => {
			if (key_value.TTvChannelname == undefined) {
				key_value.e_log[0].status = 404;
				key_value.e_log[0].error = 'channel not existing';
				engine.log(`ERROR: channel NOT EXISTING >>> check your settings!`);
				resolve(key_value);
				return;
			}
			let ch_name = key_value.TTvChannelname;
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/users?login=${ch_name}`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					key_value.e_log[0].error = 'Failed - no response';
					resolve(key_value);
					return;
				}
				key_value.e_log[0].status = response.statusCode;
				if (response.statusCode != 200) {
					resolve(key_value);
					return;
				}
				let data = JSON.parse(response.data.toString());
				key_value.e_log[0].error = data.error;
				if (data.error == "Unauthorized") {
					resolve(key_value);
					return;
				}
				key_value.TTvUsersData = data;
				if (DEBUG) engine.log(`> getting Twitch user data >> 100% >>> ${ch_name}`);
				resolve(key_value);
				return;
			});
		})
	}
	/**
	 * Download the current follower count
	 * @param {Object} key_value	stored object
	 */
	function API_Followers(key_value) {
		return new Promise((resolve, reject) => {
			if (key_value.e_log[0].status == 404) {
				resolve(key_value);
				return;
			}
			let ch_name = key_value.TTvChannelname;
			if (key_value.TTvUsersData.data[0] == undefined) {
				key_value.e_log[1].status = 404;
				key_value.e_log[1].error = 'channel not existing';
				engine.log(`ERROR: channel NOT EXISTING >>> ${ch_name}`);
				resolve(key_value);
				return;
			}
			let user_id = key_value.TTvUsersData.data[0].id;
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/users/follows?to_id=${user_id}&first=1`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					key_value.e_log[1].error = 'Failed - no response';
					resolve(key_value);
					return;
				}
				key_value.e_log[1].status = response.statusCode;
				if (response.statusCode != 200) {
					resolve(key_value);
					return;
				}
				let data = JSON.parse(response.data.toString());
				key_value.e_log[1].error = data.error;
				if (data.error == "Unauthorized") {
					resolve(key_value);
					return;
				}
				key_value.TTvFollowerData = data;
				if (DEBUG) engine.log(`> getting follower count >> 100% >>> ${ch_name}`);
				resolve(key_value);
				return;
			});
		})
	}
	/**
	 * Fetch stream details (only for LIVE streams)
	 * @param {Object} key_value	stored object
	 */
	function API_Streams(key_value) {
		return new Promise((resolve, reject) => {
			if (key_value.e_log[0].status == 404) {
				resolve(key_value);
				return;
			}
			let ch_name = key_value.TTvChannelname;
			http.simpleRequest({
				method: "GET",
				url: `https://api.twitch.tv/helix/streams?user_login=${ch_name}`,
				timeout: TIMEOUT,
				headers: { "Authorization": `Bearer ${TOKEN}`, "Client-ID": APIKEY }
			}, (error, response) => {
				// ERRORS
				if (response == undefined) {
					key_value.e_log[2].error = 'Failed - no response';
					resolve(key_value);
					return;
				}
				key_value.e_log[2].status = response.statusCode;
				if (response.statusCode != 200) {
					resolve(key_value);
					return;
				}
				let data = JSON.parse(response.data.toString());
				key_value.e_log[2].error = data.error;
				if (data.error == "Unauthorized") {
					resolve(key_value);
					return;
				}
				key_value.TTvStreamData = data;
				if (DEBUG) engine.log(`> getting stream channel data >> 100% >>> ${ch_name}`);
				resolve(key_value);
				return;
			});
		})
	}
	/**
	 * Fetch game names through game IDs
	 * @param {Object} key_value	stored object
	 */
	function API_Games(key_value) {
		return new Promise((resolve, reject) => {
			if (key_value.e_log[0].status == 404) {
				resolve(key_value);
				return;
			}
			let ch_name = key_value.TTvChannelname;
			if (key_value.TTvStreamData.data[0] == undefined) {
				key_value.e_log[3].status = 200;
				key_value.e_log[3].error = 'channel offline';
				if (DEBUG) engine.log(`> getting game names >> OFFLINE >>> ${ch_name}`);
				resolve(key_value);
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
					key_value.e_log[3].error = 'Failed - no response';
					resolve(key_value);
					return;
				}
				key_value.e_log[3].status = response.statusCode;
				if (response.statusCode != 200) {
					resolve(key_value);
					return;
				}
				let data = JSON.parse(response.data.toString());
				key_value.e_log[3].error = data.error;
				if (data.error == "Unauthorized") {
					resolve(key_value);
					return;
				}
				key_value.TTvGameData = data;
				if (DEBUG) engine.log(`> getting game names >> 100% >>> ${ch_name}`);
				resolve(key_value);
				return;
			});
		})
	}
	/**
	 * Fetch subscriber emotes
	 * @param {Object} key_value	stored object
	 * @param {boolean} firstRun	initial download?
	 */
	function API_SubEmotes(key_value, firstRun) {
		return new Promise((resolve, reject) => {
			if (firstRun && !config.instantEmotes) {
				key_value.e_log[4].status = 200;
				key_value.e_log[4].error = 'initial run';
				resolve(key_value);
				return;
			}
			if (key_value.e_log[0].status == 404) {
				resolve(key_value);
				return;
			}
			let ch_name = key_value.TTvChannelname;
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
					key_value.e_log[4].error = 'Failed - no response';
					resolve(key_value);
					return;
				}
				key_value.e_log[4].status = response.statusCode;
				if (response.statusCode != 200) {
					resolve(key_value);
					return;
				}
				let data = JSON.parse(response.data.toString());
				key_value.e_log[4].error = data.error;
				if (data.error == "Channel not found") {
					if (DEBUG) engine.log(`API error: SUB emotes for channel ${ch_name} not found!`);
					resolve(key_value);
					return;
				}
				for (var i = 0; i < data.emotes.length; i++) {
					if (!emotesSets.includes(data.emotes[i].emoticon_set)) emotes = emotes + '\n' + `[img]https://static-cdn.jtvnw.net/emoticons/v1/${data.emotes[i].id}/1.0[/img] ${data.emotes[i].code}`;
				}
				emotes = emotes + '\n';
				if (emotes.length > 0) subemotes = emotes;
				key_value.Subemotes = subemotes;
				if (DEBUG) engine.log(`> getting SUB emotes >> 100% >>> ${ch_name}`);
				resolve(key_value);
				return;
			});
		})
	}
	/**
	 * Fetch BetterTTV emotes
	 * @param {Object} key_value	stored object
	 * @param {boolean} firstRun	initial download?
	 */
	function API_BetterEmotes(key_value, firstRun) {
		return new Promise((resolve, reject) => {
			if ((firstRun && !config.instantEmotes) || !config.EnableBTTV) {
				key_value.e_log[5].status = 200;
				key_value.e_log[5].error = 'disabled/initial run';
				resolve(key_value);
				return;
			}
			if (key_value.e_log[0].status == 404) {
				resolve(key_value);
				return;
			}
			let ch_name = key_value.TTvChannelname;
			let Betteremotes = 'no BTTV emotes';
			http.simpleRequest({
				method: "GET",
				url: `https://api.betterttv.net/2/channels/${ch_name}`,
				timeout: TIMEOUT,
				headers: { "Content-Type": "application/json" }
			}, (error, response) => {
				if (response == undefined) {
					key_value.e_log[5].error = 'Failed - no response';
					resolve(key_value);
					return;
				}
				key_value.e_log[5].status = response.statusCode;
				if (response.statusCode == 404) {
					if (DEBUG) engine.log(`API error: BTTV emotes for channel ${ch_name} not found!`);
					resolve(key_value);
					return;
				}
				let data = JSON.parse(response.data.toString());
				key_value.e_log[5].error = data.error;
				let emotesBetter = '\n';
				for (var i = 0; i < data.emotes.length; i++) emotesBetter = `${emotesBetter}[img]https://cdn.betterttv.net/emote/${data.emotes[i].id}/1x[/img] ${data.emotes[i].code}` + '\n';
				if (data.emotes.length > 0) Betteremotes = emotesBetter;
				key_value.Betteremotes = Betteremotes;
				if (DEBUG) engine.log(`> getting BTTV emotes >> 100% >>> ${ch_name}`);
				resolve(key_value);
				return;
			});
		})
	}
//	###########################################  API-Authentification  ###########################################
	/**
	 * Twitch-API token authentification
	 */
	function Auth() {
		http.simpleRequest({
			method: "POST",
			url: `https://id.twitch.tv/oauth2/token?client_id=${APIKEY}&client_secret=${APISECRET}&grant_type=client_credentials`,
			timeout: TIMEOUT
		}, (error, response) => {
			if (response == undefined) return;
			if (response.statusCode != 200) {
				engine.log('ERROR: Exceeded Twitch API-Rate limit... please try later!');
				return;
			}
			let data = JSON.parse(response.data.toString());
			TOKEN = data.access_token;
			/*if (DEBUG) */engine.log('>> API-Token authentification successful!');
		});
	}
	/**
	 * Twitch-API token validation
	 */
	function Validate() {
		http.simpleRequest({
			method: "GET",
			url: "https://id.twitch.tv/oauth2/validate",
			timeout: TIMEOUT,
			headers: { "Authorization": (`OAuth ${TOKEN}`) }
		}, (error, response) => {
			if (response == undefined) return;
			let data = JSON.parse(response.data.toString());
			if (response.statusCode == 401) {
				if (data.message == "missing authorization token") {
					engine.log('ERROR: Missing auth token, please re-authenticate!');
					return;
				}
				if (data.message == "invalid access token") {
					engine.log('ERROR: Invalid access token, please re-authenticate!');
					return;
				}
			}
			else if (response.statusCode != 200) {
				engine.log('ERROR: Exceeded Twitch API-Rate limit... please try later!');
				return;
			}
			TOKEN = data.access_token;
			/*if (DEBUG) */engine.log('>> API-Token validation successful!');
		});
	}
//	###########################################  API-Functions  ###########################################

	/**
	 * Auxiliary function to check for a servergroup
	 * @param {Client} client	to be checked
	 * @param {string} groupId	to check for
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
	 * Delays a promise
	 * @param {number} ms	wait time in milliseconds
	 */
	function sleeper(ms) {
		return function(x) {
			return new Promise(resolve => setTimeout(() => resolve(x), ms));
		};
	}

	var TwitchStatus = /** @class */ (function () {
		function TwitchStatus() {
			this.TTvChannelname = "";
			this.TTvUsersData = "";
			this.TTvStreamData = "";
			this.TTvFollowerData = "0";
			this.TTvGameData = "";
			this.StreamerUID = "0";
			this.ChannelID = "";
			this.Description = "";
			this.OfflineText = "";
			this.OnlineText = "";
			this.Picture = new Picture();
			this.PicReplace = "0";
			this.UpdateDisableOnline = false;
			this.IsOnline = false;
			this.firstRun = true;
			this.Subemotes = 'no SUB emotes';
			this.Betteremotes = 'no BTTV emotes';
			this.e_log = E_LOG;
		}
		return TwitchStatus;
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
	 * Delay execution until finished loading
	 */
	event.on('load', function (ev) {
		if (READY) startup();
		else engine.log(`ERROR: Missing crucial settings... Stopped ${meta.name}`)
	});
});