const Discord = module.require('discord.js');
module.exports = {
	name: 'rank',
	description: 'Set your rank!',
	execute(message) {
                let user = message.author;
                let args = message.content.slice().split(' ');
                let filter = ['Member', 'Admin', 'Artemis', 'Bot', 'Moderator', 'fired', 'V.I.P.', 'Musician', 'Scholar', 'Lucky', 'Day 1 User', 'Discord.RSS'];
                let rolerank = message.guild.roles.find(r => r.name === `${args[1]}`);
                let member = message.member;
                
                if(message.content === "!rank") {

                    let array = message.guild.roles.map(role => role.name);
                let filter = ['Member', 'Admin', 'Artemis', 'Bot', 'Moderator', 'fired', 'V.I.P.', 'Musician', 'Scholar', 'Lucky', 'Day 1 User', 'Discord.RSS'];
                let str = "";
                    for(let i of array) {
                    if (!filter.includes(i))
                    str += message.guild.roles.find(r => r.name === (i)) + "/" + i + ": " + message.guild.roles.find(r => r.name === (i)).members.size + "\n";
                    }
                    let embed = new Discord.RichEmbed()
                        .setColor(`RANDOM`)
                        .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                        .setTitle('Ranks are case sensitive!')
                        .addField('To set or remove a rank use !rank Rank ', `${str}`, true)
                        return message.channel.send({ embed: embed });
                        

                }

                if(filter.some(word => message.content.includes(word))) {
                return message.guild.channels.get('629020686496563220').send(`${user}\n**${args[1]}** is a forbidden role!`);
                }

                let checking = message.guild.roles.find(r => r.name === `${args[1]}`);
                if(!checking) {
                return message.guild.channels.get('629020686496563220').send(`${user}\n**${args[1]}** is not a role!`);
                }
                
                let checking2 = message.member.roles.find(r => r.name === `${args[1]}`);
                if(checking2) {
                member.removeRole(rolerank).catch(console.error);
                return message.guild.channels.get('629020686496563220').send(`${user}\nYou already had the role **${args[1]}**, so I removed it for you.`);
                }
            
                message.guild.channels.get('629020686496563220').send(`${user}\nYou have joined the **${args[1]}** rank!`);
                member.addRole(rolerank).catch(console.error);




		
	},
};
