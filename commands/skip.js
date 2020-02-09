const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'skip',
    description: '[music] Skip a song!',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
        if (!serverQueue) return message.channel.send('There is no song that I could skip!');
        serverQueue.connection.dispatcher.end();
    },
};