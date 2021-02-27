// CLIENT:
const Discord = require('discord.js');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN);

var prefix = '!';

client.on('message', (msg) => {
  if(msg.author.bot) return;
  msg.channel.send('Debugging');
});
