const Discord = module.require('discord.js');
const Canvas = require('canvas');
module.exports = {
    name: 'approve',
    description: 'Accepts a new member',
    async execute(message) {
        if (message.member.hasPermission('KICK_MEMBERS')) {
            let args = message.content.slice().split(' ');
            let roleadd = message.guild.roles.find(r => r.name === "~/Members");
            let roledel = message.guild.roles.find(r => r.name === "Muted");
            let member = message.mentions.members.first();
            member.addRole(roleadd).catch(console.error);
            member.removeRole(roledel).catch(console.error);
            const modembed = new Discord.RichEmbed()
                .setTitle("The command !approve was used")
                .setColor('RANDOM')
                .addField(`${message.author.tag} approved: \n`, `${member}`, true)
            message.guild.channels.get('646672806033227797').send({
                embed: modembed
            });
            var ReBeL = member;
            var bel = ["\njust started brewing some minty tea!", "\nis using Arch BTW!", "\necho 'is here!'", "\nis sipping minty tea!", "\nuseradd -m -g users /bin/sh @"];
            var moon = bel[~~(Math.random() * bel.length)];
            moon = moon.replace('@', ReBeL.user.username)
            const canvas = Canvas.createCanvas(700, 250);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('./mintwelcome.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#74037b';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px Zelda';
            ctx.shadowColor = "black";
            ctx.shadowBlur = 5;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(ReBeL.user.username, canvas.width / 3.0, canvas.height / 2.0);
            ctx.font = '21px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(moon, canvas.width / 3.0, canvas.height / 2.0);
            const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
            message.guild.channels.get('628984660298563584').send(attachment);
            return message.channel.send(`${member} has been approved.`);
        }
    },
};