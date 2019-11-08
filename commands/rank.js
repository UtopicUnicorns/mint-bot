const Discord = module.require('discord.js');
const {
	verynicefilter2,
} = require('../config.json');
module.exports = {
	name: 'rank',
	description: 'Set a rank!',
	async execute(message) {
                let user = message.author;
                let args = message.content.slice().split(' ');
                let filter = verynicefilter2;
                let rolerank = message.guild.roles.find(r => r.name === `${args[1]}`);
                //console.log(rolerank.id);
                let member = message.member;
                
                if(message.content === "!rank") {
                    let array = message.guild.roles.sort((a, b) => a.position - b.position).map(role => role);
                    //console.log(array);
                let filter = verynicefilter2;
                let str = "";
                    for(let i of array) {
                    if (!filter.includes(i.id))
                    str += message.guild.roles.find(r => r.name === (i.name)) + "/" + i.name + ": " + message.guild.roles.find(r => r.name === (i.name)).members.size + "\n";
                    }
                    //return console.log(str);
                    let embed = new Discord.RichEmbed()
                        .setColor(`RANDOM`)
                        .setThumbnail('https://cdn.discordapp.com/icons/628978428019736619/33f4cf09c0a0ee96c87d89bfd677e39a.png')
                        .setTitle('Ranks are case sensitive!')
                        .addField('To set or remove a rank use !rank Rank ', `${str}`, true)
                          return message.channel.send({ embed: embed });
                         //console.log("12");
                        

                }

                let checking = message.guild.roles.find(r => r.name === `${args[1]}`);
                if(!checking) {
                return message.channel.send(`${user}\n**${args[1]}** is not a role!`);
                }

                if(filter.includes(rolerank.id)) {
                    return message.channel.send(`${user}\n**${args[1]}** is a forbidden role!`);
                }
                
                let checking2 = message.member.roles.find(r => r.name === `${args[1]}`);
                if(checking2) {
                member.removeRole(rolerank).catch(console.error);
                return message.channel.send(`${user}\nYou already had the role **${args[1]}**, so I removed it for you.`);
                }
            
                message.channel.send(`${user}\nYou have joined the **${rolerank}** rank!`);
                member.addRole(rolerank).catch(console.error);
 
	},
};
