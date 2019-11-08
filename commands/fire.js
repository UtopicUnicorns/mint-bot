module.exports = {
	name: 'fire',
	description: 'You are fired',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {

            let args = message.content.slice().split(' ');
            let rolegive = message.guild.roles.find(r => r.name === `fired`);
            let member = message.mentions.members.first();
            if(message.author.id == member.id) {
                return message.channel.send("You got fire--- Wait.. you played yourself.");
            }

           let check = message.mentions.members.first().roles.some(r=>[`fired`].includes(r.name));
          
           if(!check) {
            member.addRole(rolegive).catch(console.error);
            return message.channel.send(`${member}, You are FIRED!`);
            }

            member.removeRole(rolegive).catch(console.error);
           message.channel.send(`You are hired again ${member}!`);

		

            }
        },	
    };
