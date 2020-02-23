const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'np',
    description: '[music] Shows the queue list',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        message.channel.send(`Now playing: ${serverQueue.songs[0].title}\n\n`);
        message.channel.send(`Queue list:\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}`);
    },
};