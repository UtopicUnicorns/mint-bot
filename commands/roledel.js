module.exports = {
	name: 'roledel',
	description: 'Delete roles',
	execute(message) {

                if (message.member.hasPermission('KICK_MEMBERS')) {

                let user = message.author;
                let args = message.content.slice().split(' ');
                let filter = ['Admin', 'Artemis', 'Bot', 'Moderator', 'fired', 'V.I.P.', 'Musician', 'Scholar', 'Lucky', 'Day 1 User', 'Discord.RSS'];
                //let rolerank = message.guild.roles.find(r => r.name === `${args[1]}`);
                //let member = message.member;
                
                if(message.content === "!roledel") {

                return message.channel.send(`${user}, it's simple really...\n!roledel RANK`);

                }

                if(filter.some(word => message.content.includes(word))) {
                return message.channel.send(`${user}\n**${args[1]}** is a protected role!`);
                }

                let checking = message.guild.roles.find(r => r.name === `${args[1]}`);
                if(!checking) {
                return message.channel.send(`${user}\n**${args[1]}** is not a role!`);
                }
                
                //let checking2 = message.member.roles.find(r => r.name === `${args[1]}`);
                //if(checking2) {
                    message.guild.roles.find(r => r.name === `${args[1]}`).delete();
                return message.channel.send(`${user}\nYou have deleted rank: **${args[1]}**!`);
                //}
            


        }

		
	},
};
