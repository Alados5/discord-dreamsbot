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
  var dreami_channels = msg.guild.channels.cache;
  var debugch = dreami_channels.find(ch => ch.id==688107638239920282);
  var welcomech = dreami_channels.find(ch => ch.id==552804145866866698);
  
  // Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) {
    // TO-REDO: TRIGGER OF PURGE PROJECTS
    
    return;
  }
  
  // Handles arguments to just take the first word
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  
  
  // ----------------------------------------------------------------------------------------
  // -------------- ADMIN COMMANDS ----------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  
  // TO-REDO: ADMIN COMMANDS
  
  // ----------------------------------------------------------------------------------------
  // ------------ END ADMIN COMMANDS --------------------------------------------------------
  // ----------------------------------------------------------------------------------------


  // HELP
  if (command == 'ayuda' || command == 'help') {
    msg.reply("¡Hola! Soy un bot creado por Alados5.\n\n"+
              "Aquí debería haber un mensaje de ayuda, pero aún no ha podido escribirlo bien. "+
              "Mientras tanto, puedes echarle un ojo a +"welcomech+", donde tienes algunos de los comandos con los que me puedes llamar.\n\n"+
              "¡Disculpa las molestias!");
  }
  // END HELP
  

});
