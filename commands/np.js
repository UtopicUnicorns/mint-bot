module.exports = {
    name: 'np',
    description: '[music] Shows the queue list',
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        message.channel.send(`Now playing: ${serverQueue.songs[0].title}\n\n`);
        message.channel.send(`Queue list:\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}`);
    },
};