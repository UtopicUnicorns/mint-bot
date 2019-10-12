module.exports = {
	name: 'rolegive',
	description: 'Give a role to a member',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
            
            let args = message.content.slice().split(' ');
            let rolegive = message.guild.roles.find(r => r.name === `${args[1]}`);
            let member = message.mentions.users.first();
           // let check = message.mentions.users.first().roles.some(r=>[`${args[2]}`].includes(r.name));
          // if(check) {
            member.addRole(rolegive).catch(console.error);
            //message.channel.send(`Gave/Took ${member} the following role: **${args[1]}**!`);
           // }

            member.removeRole(rolegive).catch(console.error);
           // message.channel.send(`Took the following role: **${args[1]}** from: ${member}!`);

		

            }
        },	
    };
