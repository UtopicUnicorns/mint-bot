const Discord = module.require('discord.js');
module.exports = {
    name: 'rules',
    description: '[mod] Show rules',
    execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let embed = new Discord.RichEmbed()
                .setTitle('Server Rules')
                .setColor(`RANDOM`)
                .setThumbnail(message.guild.iconURL)
                .addField('(1)\n', 'Hatespeech by the means of messaging or usernames is forbidden.', true)
                .addField('(2)\n', 'No spamming. No exceptions!', true)
                .addField('(3)\n', 'Gore, nudity and general NSFW content is forbidden!', true)
                .addField('(4)\n', 'Do not be a dick, be reasonable.', true)
                .addField('(5)\n', 'Use the appropriate channels.', true)
                .addField('(6)\n', 'No selfbots or regular bots, we already have a proper bot here.', true)
                .addField('(7)\n', 'Extensive cursing is forbidden.', true)
                .addField('(8)\n', 'Spreading personal info from yourself or someone else even with consent is strictly forbidden!', true)
                .addField('(9)\n', 'In-case these rules do not cover a specific situation, mods are allowed to follow their own judgement.', true)
                .addField('(10)\n', 'We all have our preferences, but do not force it upon one another.', true)
                .addField('(11)\n', 'This is a Linux based server, keep distro trashtalking and/or editor shittalk to yourself.', true)
                .setURL('https://discord.gg/dSCqtqj')
                .setFooter('Violating these rules may cause a kick, mute or ban from the server.')
                .setTimestamp();
            return message.channel.send({
                embed: embed
            });
        }
    },
};