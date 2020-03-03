const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!';

var dbindex = require("./trucos_db/index.js");
dbindex = dbindex.dbindex;

// WELCOME MESSAGE
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'general');
  if (!channel) return;
  if (channel.id == 530381279749865484) {
    var msgcolor = 8388863;
    var msgtitle = "¡Bienvenid@ al Servidor de Dreams en Español!";
    var desctext = "A modo de presentación, y para romper el hielo, "+
                   "normalmente pedimos a los nuevos miembros qué faceta de Dreams les gusta más, "+
                   "y qué están haciendo o quieren hacer en el juego."+
                   "\n\n¡No dudes en compartir tus creaciones, o pedir ayuda si te hace falta! :D"+
                   "\n\nÉchale un ojo a las normas del servidor, "+
                   "seguro que pronto un humano hablará contigo para darte una bienvenida mejor que la que te puedo dar yo."+
                   "\n\n¡Pero no dudes en usarme para lo que necesites!";
    
    channel.send("¡Muy buenas, " + member + "!", {embed: {
      color: msgcolor,
      description: desctext,
      title: msgtitle,
      thumbnail: {
        "url": member.user.avatarURL
      },
      image: {
        "url": "https://i.imgur.com/pdmBuaV.png"
      },
      footer: {
        "icon_url": "https://images-ext-2.discordapp.net/external/nT8HH6V_sT5nhEVJE1sgYbsiAIv44AJlyK6kbhwGabE/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/284104569586450434/9c4e15c73c4f4d7709ca9981527b2a64.png",
        "text": "Beep boop, yo soy un bot creado por Alados5"
      }
    }})
    
    
    /*
    channel.send(`¡Muy buenas, ${member}! ¡Te damos la bienvenida al Servidor de Dreams en Español!`+
                 `\nA modo de presentación, y para romper el hielo, `+
                 `normalmente pedimos a los nuevos qué faceta de Dreams les gusta más, `+
                 `y qué están haciendo o quieren hacer en el juego.`+
                 `\n¡No dudes en compartir tus creaciones, o pedir ayuda si te hace falta! :D`+
                 `\nÉchale un ojo a las normas del servidor, seguro que pronto un humano hablará contigo `+
                 `para darte una bienvenida mejor que la que te puedo dar yo.`+
                 `\n¡Pero no dudes en usarme para lo que necesites!`+
                 `\n \n    ***Beep boop, yo soy un bot creado por Alados5***`);
    */
  }
});

client.on('message', msg => {
    
  // Returns if author is a bot
  if(msg.author.bot) return;
  
  var lowtext = msg.content.toLowerCase();
    
  // Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) {
    // TRIGGER OF PURGE PROJECTS
    //var fecha = new Date();
    //var utc = fecha.getTime();
    //var oneweek = 604800000;
    return;
  }
   
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
      
    var rolenameslist = {"Arte":["art", "arte", "artemaníacos", "artemaniacos", "artemaniaco", "artista", "artist"],
                         "Diseño":["design", "diseño", "logic", "logica", "lógica", "hackermen", "hackerman"],
                         "Animación":["animation", "animacion", "animación", "titiriteros", "titiritero", "animador", "animator"],
                         "Audio":["music", "audio", "música", "los notas", "notas", "nota"],
                         "Gestión":["curation", "curacion", "curación", "gestion", "gestión", "organizar", "organizador", "marie kondo"],
                         "Juego":["play", "player", "juego", "jugar", "jugador", "jugadores", "4dplayers", "becario", "becarios"]};
    var modslist = ["mod", "mods", "moderador", "moderadores", "admin", "admins"];
    
    var therole;
    for(var auratype in rolenameslist) {
        if(rolenameslist[auratype].indexOf(rolename) >= 0) {
            therole = msg.guild.roles.find("name", auratype);
        }
    }
    
    
    if (!therole) {
      if (modslist.indexOf(rolename) >= 0) {
          return msg.reply("Buen intento, pero no puedo hacerte mod.\n¡No es un aura de Dreams! ;)")
      }
      else {
          return msg.reply("Este rol no existe!")
      }
    }
      
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
  if (command == 'creations') {
      var baselink = 'https://indreams.me/'; 
      var creator = msg.content.slice(prefix.length+command.length+1);
      var finallink = '/creations';
      creator = creator.replace(/ /g, "%20");
      msg.channel.send("Las creaciones del usuario que me has dado son: \n" + baselink + creator + finallink);
  }
    
    
  // END INDREAMS.ME SEARCH

  
  // START EMBED
  if (command == 'embed') {
    var alltext = msg.content.slice(7).split('|');
    var notembed = alltext[0];
    var msgtitle = alltext[1];
    var desctext = alltext[2];
    var msgcolor = parseInt(alltext[3]);
    msg.channel.send(" ", {files: [notembed]})
    msg.channel.send({embed: {
      color: msgcolor,
      author: {
        name: msg.author.username,
        icon_url: msg.author.avatarURL
      },
      description:desctext,
      title: msgtitle,
      //fields: [
      //  {
      //    name: "CAMPO 1",
      //    value: "Texto 1"
      //  },
      //  {
      //    name: "CAMPO 2",
      //    value: "Texto 2"
      //  }
      //]
    }})
  }
  // END EMBED
  
  // START MKCH
  if (command == 'nuevocanal') {
    const newch = msg.guild.createChannel('test'); 
    newch.setParent('552432711072088074');
    msg.reply("Debería haberse creado y asignado bajo Proyectos");
  }
  // END MKCH
  
  
  // START TRUCOS
  if (command == 'trucos') {
    //dbindex = {1:{name:"...", tags:["..."], desc: "..."}, ...}
    if (args[0] == "todo") {
      var response = "Todos los trucos: \n";
      for (var ntrick in dbindex) {
        if (dbindex.hasOwnProperty(ntrick)) {
          response = response + ntrick + ": " + dbindex[ntrick].name + "\n";
        }
      }
      msg.channel.send(response);
    }

    else if (args[0] == "tag") {
      if (!args[1]) return msg.reply("No has especificado ninguna palabra clave!");
      
      var response = "Lista de trucos con esta palabra clave: \n";
      for (var ntrick in dbindex) {
        if (dbindex.hasOwnProperty(ntrick)) {
          if (dbindex[ntrick].tags.includes(args[1])) {
            response = response + ntrick + ": " + dbindex[ntrick].name + "\n";
          }
        }
      }
      msg.channel.send(response);
    }
    
    else if (!isNaN(parseInt(args[0]))) {
      var response = "**TRUCO " + args[0] + ": " + dbindex[args[0]].name + "** \n";
      response = response + dbindex[args[0]].desc + "\n";
      if (dbindex[args[0]].link) response = response + "Enlace o contenido multimedia: \n" + dbindex[args[0]].link + "\n";
      response = response + "Enviado por: " + dbindex[args[0]].user;
      msg.channel.send(response);
    }
    
  }
  // END TRUCOS
  

  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
