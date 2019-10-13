const {
	Util
} = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const fs = require('fs');
const youtube = new YouTube('YOURAPIKEYHERE');

module.exports = {
	name: 'play',
	description: 'Play a song!',
	async execute(message) {
        let args = message.content.slice(5).split(' ');
        //musicstring = "";
        youtube.searchVideos(`${args}`, 4)
    .then(results => {
        musicurl = `${results[0].url}`;
               fs.writeFile('urlfetch.txt', musicurl, (err) => {
            if (err) throw err;
        });
    })
	.catch(console.log);
	message.channel.send("Fetching your song.");

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      for (let i = 0; i < 5; i++) {
        if (i === 1)
          await sleep(1000);
		//console.log(i);
		
      }
    let openmusicurl = fs.readFileSync('urlfetch.txt').toString();
    //message.channel.send(openmusicurl);

		const queue = message.client.queue;
		const serverQueue = message.client.queue.get(message.guild.id);

		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
			return message.channel.send('I need the permissions to join and speak in your voice channel!');
		}


        
		const songInfo = await ytdl.getInfo(openmusicurl);
		const song = {
			title: songInfo.title,
			url: songInfo.video_url,
		};

		if (!serverQueue) {
			const queueContruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			queue.set(message.guild.id, queueContruct);

			queueContruct.songs.push(song);

			try {
				var connection = await voiceChannel.join();
				queueContruct.connection = connection;
				this.play(message, queueContruct.songs[0]);
			} catch (err) {
				console.log(err);
				queue.delete(message.guild.id);
				return message.channel.send('error');
			}
		} else {
			serverQueue.songs.push(song);
			return message.channel.send(`${song.title} has been added to the queue!`);
		}
	},

	play(message, song) {
		const queue = message.client.queue;
		const guild = message.guild;
		const serverQueue = queue.get(message.guild.id);
	
		if (!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}
	
		const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
			.on('end', () => {
				console.log('Music ended!');
				//serverQueue.songs.push(song);
				serverQueue.songs.shift();
				this.play(message, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.error(error);
			});
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);




	}
};
