const npm = require('../NPM.js');
npm.npm();
module.exports = {
    name: 'play',
    description: '[music] Play a song!',
    async execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('play');
        usage.number++;
        setUsage.run(usage);
        //
        let args = message.content.slice(prefix.length + 5).split(' ');
        let openmusicurl2 = await youtube.searchVideos(`${args}`, 4);
        let openmusicurl = openmusicurl2[0].url;
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
                message.delete();
                message.channel.send(`Playing ${song.title}`);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                message.delete();
                return message.channel.send('error');
            }
        } else {
            serverQueue.songs.push(song);
            message.delete();
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
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url), {
                bitrate: 192000 /* 192kbps */
            })
            .on('end', () => {
                serverQueue.songs.shift();
                this.play(message, serverQueue.songs[0]);
            })
            .on('error', error => {
                console.error(error);
            });
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    }
};