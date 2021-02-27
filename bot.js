// CLIENT:
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

var prefix = '!';

client.on('message', (msg) => {
  
  // Returns if author is a bot
  if(msg.author.bot) return;

  var lowtext = msg.content.toLowerCase();
  
  // ID of channel: #bot_debug
  var debugch = msg.guild.channels.find('id','688107638239920282');
  
  // Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) {
    return;
  }
  
  msg.channel.send('Debugging');
});
