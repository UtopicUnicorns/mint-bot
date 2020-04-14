const npm = require('../NPM.js');
npm.npm();
module.exports = {
    name: 'np',
    description: '[music] Shows the queue list',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('np');
        usage.number++;
        setUsage.run(usage);
        //
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) return message.channel.send('There is nothing playing.');
        let array = [];
        let count = "-1";
        serverQueue.songs.map(song => count++ && array.push('(' + count + ') ' + song.title));
        const rembed = new Discord.RichEmbed()
            .setTitle('Now playing:' + serverQueue.songs[0].title)
            .setAuthor(message.author.username, message.author.avatarURL)
            .setThumbnail(serverQueue.songs[0].thumb)
            .setColor("RANDOM")
            .setDescription("Queue below:\n" + array.slice(1).join('\n'))
            .setFooter('You can skip songs by using the matching song number:\n' + prefix + 'skip 4');
           message.channel.send(rembed);
    },
};