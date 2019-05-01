const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!';

client.on('message', msg => {
    
  //Returns if author is a bot
  if(msg.author.bot) return;
  
  var lowtext = msg.content.toLowerCase();
  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
