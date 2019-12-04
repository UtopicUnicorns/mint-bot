const Discord = module.require('discord.js');
module.exports = {
    name: 'help',
    description: 'Displays all available commands',
    execute(message) {
        if (message.content === "!help mod") {
            if (message.member.hasPermission('KICK_MEMBERS')) {
                let modbed = new Discord.RichEmbed()
                    .setTitle('Mod commands')
                    .setDescription('Do not be an idiot')
                    .setColor(`RANDOM`)
                    .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                    .addField('!ban', 'Ban a user', true)
                    .addField('!kick', 'Kicks a user', true)
                    .addField('!massadd', 'Add a role to everyone', true)
                    .addField('!massdell', 'Delete a role from everyone', true)
                    .addField('!purge', '!purge 1-100 OR !purge @user 1-100', true)
                    .addField('!roleadd', 'Create a new role', true)
                    .addField('!roledel', 'Destroy a role', true)
                    .addField('!rolegive', 'Give a role to mentioned member', true)
                    .addField('!mute', '!mute @mention mutes or unmutes the target', true)
                    .addField('!rules', 'Displays the server rules', true)
                    .setFooter('Artemis owns you too!')
                    .setTimestamp();
                return message.channel.send({
                    embed: modbed
                });
            }
        }
        let embed = new Discord.RichEmbed()
            .setTitle('Help')
            .setDescription('These commands are available to you')
            .setColor(`RANDOM`)
            .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
            .addField('!help', 'Display this page', true)
            .addField('!specs', 'Set up your pc specifications', true)
            .addField('!man', 'Shows you man pages', true)
            .addField('!userinfo', 'Show your user info or mention a user to get theirs', true)
            .addField('!search', 'Search duck duck go', true)
            .addField('!guide', '!guide [NUM] [NUM]', true)
            .addField('!package', 'Looks up packages for you', true)
            .addBlankField()
            .addField('!play', 'Play a song', true)
            .addField('!stop', 'Stop the music', true)
            .addField('!skip', 'Skips the current song', true)
            .addField('!np', 'Shows the current song', true)
            .addBlankField()
            .addField('!bird !cat !dog !fox', 'Show a random animal', true)
            .addField('!gamble', 'Get rid of those points', true)
            .addField('!xkcd', 'Today xkcd use !xkcd random for random xkcd', true)
            .addField('!top !points', 'See your points and level and leaderboard', true)
            .setFooter('Artemis is our overlord!')
            .setTimestamp();
        message.channel.send({
            embed: embed
        });
    },
};