module.exports = {
	name: 'ranks',
	description: 'Display amount of users in different distributions.',
	execute(message) {

            //let roleID = "628979872466993153";
            let debianID = "629978750167154688";
            let mintID = "629012721781964860";
            let archID = "629012846839332894";
            let manjaroID = "629012791021273099";
            let ubuntuID = "629012921673973782";
            let opensuseID = "629013141807824928";
            
            
//let membersWithRole = message.guild.roles.get(roleID).members;
let debianRole = message.guild.roles.get(debianID).members;
let mintRole = message.guild.roles.get(mintID).members;
let archRole = message.guild.roles.get(archID).members;
let manjaroRole = message.guild.roles.get(manjaroID).members;
let ubuntuRole = message.guild.roles.get(ubuntuID).members;
let opensuseRole = message.guild.roles.get(opensuseID).members;
message.channel.send(`Users using different Linux distributions:\n>>> Debian: ${debianRole.size} Users \nMint: ${mintRole.size} Users \nArch: ${archRole.size} Users \nManjaro: ${manjaroRole.size} Users \nUbuntu: ${ubuntuRole.size} Users \nOpenSUSE: ${opensuseRole.size} Users`);

		
	},
};
