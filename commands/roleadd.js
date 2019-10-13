const fs = require('fs')

module.exports = {
	name: 'roleadd',
	description: 'Add a role',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
            
            let args = message.content.slice().split(' ');
            let checking = message.guild.roles.find(r => r.name === `${args[1]}`);
            if (message.content.length < 9) {
                return message.channel.send(`First arg is ROLENAME\nSecond arg is COLOR\nCOLOR has to be capital or hex\n , ${message.author}!`);
           }
           if (checking) {

            return message.channel.send(`**${args[1]}** already exists!`);

           }
              message.guild.createRole({name: `${args[1]}`, color: `${args[2]}`, position: `8`, hoist: `true`});
           message.channel.send(`Created: Role: ** ${args[1]} ** with color: ** ${args[2]} **`);
           
           fs.open('ranks.txt', 'a', (err, fd) => {
            if (err) throw err;
            fs.appendFile(fd, `${args[1]}`, 'utf8', (err) => {
              fs.close(fd, (err) => {
                if (err) throw err;
              });
              if (err) throw err;
            });
          });


        
        }

		

		
        },	
    };
