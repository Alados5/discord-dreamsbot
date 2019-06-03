const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!';

client.on('message', msg => {
    
  // Returns if author is a bot
  if(msg.author.bot) return;
  
  var lowtext = msg.content.toLowerCase();
    
  // Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) return;
   
  // Handles arguments to just take the first word
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase(); 
    
  // ADMIN COMMANDS
  if (msg.member.permissions.has('ADMINISTRATOR')) {
    if (command == 'clear') {
      var ntoclear = parseInt(args[0]);
      if (!ntoclear || isNaN(ntoclear)) return msg.reply("Pon cuantos mensajes quieres eliminar!")
      msg.channel.bulkDelete(ntoclear+1);
    }
  }
  // END ADMIN COMMANDS

    
  // AURA - ADD/REMOVE DREAM ROLES
  if (command == 'aura') {       
    var rolename = msg.content.slice(prefix.length+command.length+1).toLowerCase();
    if (!rolename) return msg.reply("No has puesto ningún rol!")
      
    var rolenameslist = {"Artemaníacos":["art", "arte", "artemaníacos", "artemaniacos", "artemaniaco", "artista", "artist"],
                         "Hackermen":["design", "diseño", "logic", "logica", "lógica", "hackermen", "hackerman"],
                         "Titiriteros":["animation", "animacion", "animación", "titiriteros", "titiritero", "animador", "animator"],
                         "Los Notas":["music", "audio", "música", "los notas", "notas", "nota"],
                         "Marie Kondo":["curation", "curacion", "curación", "organizar", "organizador", "marie kondo"],
                         "Becarios":["play", "player", "jugar", "jugador", "jugadores", "4dplayers", "becario", "becarios"]};
    
    var therole;
    for(var auratype in rolenameslist) {
        if(rolenameslist[auratype].indexOf(rolename) >= 0) {
            therole = msg.guild.roles.find("name", auratype);
        }
    }
    if (!therole) return msg.reply("Este rol no existe!")
      
    if (msg.member.roles.has(therole.id)) {
        msg.member.removeRole(therole);
        msg.reply("Rol eliminado!");
    }
    else {
        msg.member.addRole(therole);
        msg.reply("Rol añadido!");
    }
  }
  // END AURA
    
  // CHOOSE
  if (command == 'choose') {
      var randnum = Math.random();
      var chopt = msg.content.slice(prefix.length+command.length+1).split(', ');
      var nopt = chopt.length;
      
      for (var opti=1; opti<=nopt; opti++) {
          if (randnum <= opti/nopt) return msg.channel.send(chopt[opti-1])
      }

  }
  // END CHOOSE
  
  // ICON LIST
  if (command == 'iconos') {
      var iconlink = 'https://indreams.me/guide/icons';
      msg.channel.send("La lista de iconos en Dreams puede encontrarse aquí: \n" + iconlink);
  }
  // END ICON LIST
  
  // INDREAMS.ME SEARCH
  if (command == 'dreamsearch') {
      var basesearchlink = 'https://indreams.me/search/results/?term=';
      var searchterm = msg.content.slice(prefix.length+command.length+1);
      searchterm = searchterm.replace(/ /g, "%20");
      msg.channel.send("Tu búsqueda en indreams.me da esto: \n" + basesearchlink + searchterm);
  }
    
  if (command == 'dreamsearchf') {
      var basesearchlink = 'https://indreams.me/search/results/?term=';
      var requestsearch = msg.content.slice(prefix.length+command.length+1);
      var filters = requestsearch.split('&&');
      var searchterm = filters.shift();
      searchterm = searchterm.replace(/ /g, "%20");
      var searchstring = searchterm + "&type=" + filters[0] + "&sort=" + filters[1];
      msg.channel.send("Tu búsqueda filtrada en indreams.me da esto: \n" + basesearchlink + searchstring);
      
      //&type=dreams&sort=mostliked
  }
    
  if (command == 'dreamersearch') {
      var basesearchlink = 'https://indreams.me/search/results/?term=@'; 
      var searchterm = msg.content.slice(prefix.length+command.length+1);
      searchterm = searchterm.replace(/ /g, "%20");
      msg.channel.send("Tu búsqueda de un usuario en indreams.me da esto: \n" + basesearchlink + searchterm);
  }
  // END INDREAMS.ME SEARCH
  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
