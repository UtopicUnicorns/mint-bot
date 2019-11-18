const Discord = module.require('discord.js');
module.exports = {
	name: 'embed',
	description: 'generate an embed',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
            let args = message.content.slice(7).split('\n');
            let element = `${args[0]}`;
            let str = "";
            for(let i of args) {
                if (i != element)
                str += i+"\n";
                //console.log(i);
            }
            message.delete();
            let embed = new Discord.RichEmbed()
            .setColor(`RANDOM`)
            .setTitle(args[0])
            .setDescription(str)
            return message.channel.send({ embed: embed });
             
            
        }	
    },
};
