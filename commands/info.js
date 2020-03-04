const Discord = require("discord.js");
const db = require('better-sqlite3')('./scores.sqlite');
module.exports = {
    name: 'info',
    description: '[general] Display server info',
    execute(message) {
        const getGuild = db.prepare("SELECT * FROM guildhub WHERE guild = ?");
        const prefixstart = getGuild.get(message.guild.id);
        const prefix = prefixstart.prefix;
        const verlvl = {
            0: "None",
            1: "Low",
            2: "Medium",
            3: "(╯°□°）╯︵ ┻━┻",
            4: "(ノಠ益ಠ)ノ彡┻━┻"
        }
        let inline = true
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setThumbnail(sicon)
            .setAuthor(message.guild.name)
            .addField("Name", message.guild.name, inline)
            .addField("ID", message.guild.id, inline)
            .addField("Owner", message.guild.owner, inline)
            .addField("Region", message.guild.region, inline)
            .addField("Verification Level", verlvl[message.guild.verificationLevel], inline)
            .addField("Members", `${message.guild.memberCount}`, inline)
            .addField("Roles", message.guild.roles.size, inline)
            .addField("Channels", message.guild.channels.size, inline)
            .addField("You Joined", message.member.joinedAt)
            .setFooter(`Created ${message.guild.createdAt}`);
        message.channel.send(serverembed);
        //
        let getUsage = db.prepare("SELECT * FROM usage WHERE command = ?");
        let setUsage = db.prepare("INSERT OR REPLACE INTO usage (command, number) VALUES (@command, @number);");
        usage = getUsage.get('info');
        usage.number++;
        setUsage.run(usage);
        //
    },
};