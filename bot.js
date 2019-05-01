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
    const userx = msg.author;
        
    var rolename = args[0];
    if (!rolename) return msg.reply("You didn't put a role in there!")
        
    var therole = msg.guild.roles.find("name", rolename);
    if (!therole) return msg.reply("This role does not exist")
        
    userx.addRole(therole);
  }
  
  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
