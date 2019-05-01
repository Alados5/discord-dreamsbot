const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!';

client.on('message', msg => {
    
  //Returns if author is a bot
  if(msg.author.bot) return;
  
  var lowtext = msg.content.toLowerCase();
    
  //Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) return;
    
  //Handles arguments to just take the first word
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase(); 
    
  if (command == 'aura') {       
    var rolename = args[0];
    msg.channel.send("Role is" + rolename);
    if (!rolename) return msg.reply("You didn't put a role in there!")
        
    var therole = msg.guild.roles.find("name", rolename);
    if (!therole) return msg.reply("This role does not exist")
      
    if (msg.member.roles.has(therole) {
        msg.member.removeRole(therole);
        msg.reply("Role removed!");
    }
    else {
        msg.member.addRole(therole);
        msg.reply("Role added!");
    }
  }
  
  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
