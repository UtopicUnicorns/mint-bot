const fs = require('fs')

module.exports = {
	name: 'rank',
	description: 'Set your rank!',
	execute(message) {
                let user = message.author;
                let args = message.content.slice().split(' ');
                let filter = ['Admin', 'Artemis', 'Bot', 'Moderator', 'fired', 'V.I.P.', 'Musician', 'Scholar', 'Lucky', 'Day 1 User', 'Discord.RSS'];
                let rolerank = message.guild.roles.find(r => r.name === `${args[1]}`);
                let member = message.member;
                
                if(message.content === "!rank") {

                    message.guild.channels.get('629020686496563220').send(`${user},\nI have listed all the available ranks!`);

                    var contents = fs.readFileSync('ranks.txt', 'utf8');

                   return message.guild.channels.get('629020686496563220').send(contents);

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
