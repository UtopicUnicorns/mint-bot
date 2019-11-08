const fs = require('fs');
module.exports = {
	name: 'mute',
	description: 'mute a member',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
            
            const member = message.mentions.members.first();
            //return console.log(member.user.username);
            if(message.author.id == member.id) {
                return message.channel.send("You can't mute yourself");
            }
            let filter = fs.readFileSync('mute.txt').toString().split("\n");
            let member2 = member.id;
            //console.log(member.id);
            if(!filter.includes(member2)) {
              fs.appendFile('mute.txt', '\n' + member2, function (err) {
                if (err) throw err;
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                member.addRole(mutedrole).catch(console.error);
               return message.channel.send(member.user.username + " was muted"); //console.log('done! added');
              });
            }
            
            else{
            let array = fs.readFileSync('mute.txt').toString().split("\n");
            let element = member2;
            let str = "";
            for(let i of array) {
                if (i != element)
                str += i + '\n';
                }
            fs.writeFile("mute.txt", str, (error) => {
                if (error) throw error;
                let mutedrole = message.guild.roles.find(r => r.name === `Muted`);
                member.removeRole(mutedrole).catch(console.error);
               return message.channel.send(member.user.username + " was unmuted"); //console.log('done! removed');
            });
        }



        }	
    },
};
