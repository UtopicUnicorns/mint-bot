module.exports = {
	name: 'roleadd',
	description: 'Add a role',
	execute(message) {
         if (message.member.hasPermission('KICK_MEMBERS')) {
            

            if (!args.length) {
                return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
            }
            else if (args[0] === 'foo') {
                return message.channel.send('bar');
            }
        
            message.guild.createRole({ // Call createRole on guild object
                name: args[0],
                color: "RANDOM" // ColorResolvable; either "RANDOM", hex as string or color name
                permissions: [ // Array of permissions the role should have 
                    "SEND_MESSAGES",
                ],
                hoist: true, // Whether the role should be displayed on the right side (online list)
                position: 8 // Role position
            });

            message.channel.send(`Created: ${args[0]}`);
        }

		

		
        }	
    },
};
