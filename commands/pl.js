const {
    Util
} = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const fs = require('fs');
const {
    youtubekey,
} = require('../config.json');
const youtube = new YouTube(youtubekey);
module.exports = {
    name: 'pl',
    description: '[music] Adds a playlist to the bot(experimental)',
    async execute(message) {
        let args = message.content.slice(4).split(' ');

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        for (let i = 0; i < 5; i++) {
            if (i === 1)
                await sleep(3000);
            fs.writeFile('urlfetch.txt', '', (err) => {
                if (err) throw err;
            });
            youtube.getPlaylist(`${args}`)
                .then(playlist => {
                    playlist.getVideos()
                        .then(videos => {
                            let str = "";
                            for (let i in videos) {
                                str += videos[i].url + '\n';
                            }
                            fs.writeFile('urlfetch.txt', str, function(err) {
                                if (err) throw err;
                            });
                        })
                        .catch(console.log);
                })
                .catch(console.log);
            await sleep(3000);
            let array = fs.readFileSync('urlfetch.txt').toString().split("\n");
            for (let i of array) {
                const queue = message.client.queue;
                const serverQueue = message.client.queue.get(message.guild.id);
                const voiceChannel = message.member.voiceChannel;
                if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
                const permissions = voiceChannel.permissionsFor(message.client.user);
                if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                    return message.channel.send('I need the permissions to join and speak in your voice channel!');
                }
                let songInfo = await ytdl.getInfo(i);
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
                    message.channel.send(`${song.title} has been added to the queue!`);
                }
            }
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