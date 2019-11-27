const Discord = module.require('discord.js');
module.exports = {
    name: 'rules',
    description: 'rules',
    execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let embed = new Discord.RichEmbed()
                .setTitle('Server Rules')
                .setColor(`RANDOM`)
                .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                .addField('(1)\n', 'No offensive messages or nicknames - Anything that a reasonable person might find offensive.', true)
                .addField('(2)\n', 'No spam - This includes but is not limited too, loud/obnoxious noises in voice, @mention spam, character spam, image spam, and message spam.', true)
                .addField('(3)\n', 'No Gorey, Sexual, or scary content - Screamer links, porn, nudity, death.', true)
                .addField('(4)\n', 'No harassment - Including sexual harassment or encouraging of harassment.', true)
                .addField('(5)\n', 'Use the appropriate channels.', true)
                .addField('(6)\n', 'No self or user bots - These are in some cases against the discord TOS and if you need a bot for something use one of the bots already in the server.', true)
                .addField('(7)\n', 'Swearing is allowed so long as it is not directed at another member.', true)
                .addField('(8)\n', 'Do not spread the personal information of others without their consent.', true)
                .addField('(9)\n', 'There may be situations not covered by the rules or times where the rule may not fit the situation. If this happens the moderators are trusted to handle the situation appropriately.', true)
                .addField('(10)\n', 'No distro shaming. People can explain why they do not like a distro but no shaming someone for using that distro.', true)
                .setURL('https://discord.gg/dSCqtqj')
                .setFooter('Violating these rules may cause a kick, mute or ban from the server.')
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
    },
};