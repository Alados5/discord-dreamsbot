const Discord = require('discord.js');
const client = new Discord.Client();

var prefix = '!';

var dbindex = require("./trucos_db/index.js");
dbindex = dbindex.dbindex;

// EMBED AS FUNCTION
function mkembed(msgtitle, desctext, msgfields, msgcolor, msgauthor, footeron) {
  var embedobj = {
      description:desctext,
      title: msgtitle,
  }
  if (msgcolor) {
    embedobj.color = msgcolor;
  }
  if (msgauthor) {
    embedobj.author = msgauthor;
  }
  if (footeron) {
    embedobj.footer = {
      "icon_url": "https://images-ext-2.discordapp.net/external/nT8HH6V_sT5nhEVJE1sgYbsiAIv44AJlyK6kbhwGabE/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/284104569586450434/9c4e15c73c4f4d7709ca9981527b2a64.png",
      "text": "Beep boop, yo soy un bot creado por Alados5"
    }
  }
  if (msgfields.length && Array.isArray(msgfields)) {
    //msgfields = [["name1","value1"],["name2","value2"]...];
    var fieldsarray = [];
    for (var f=0; f<msgfields.length; f++) {
      var nvarray = msgfields[f];
      var fieldobj = { name: nvarray[0], value: nvarray[1] };
      fieldsarray.push(fieldobj);
    }
    embedobj.fields = fieldsarray;
    //fields: [ {name: "field name", value: "field text value"}, {...}, ...]
  }
  
  return embedobj
}  
// -----------------

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
    var fecha = new Date();
    var utc = fecha.getTime();
    //var oneweek = 604800000;
    var tensec = 10000;
    if (utc % tensec > 5000) return;
    if (msg.channel.id == 684539074224455763) {
      msg.channel.fetchMessages({limit:1}).then(msgcol => {
        var lastmsg = msgcol.first();
        var lasttime = lastmsg.createdAt.getTime();
        msg.channel.send("Fecha de ahora: "+utc)
        msg.channel.send("Fecha del mensaje: "+lasttime)
      }); 
      
    }
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
  if (command == "embed") {
    //mkembed(msgtitle, desctext, msgfields, msgcolor, msgauthor, footeron)
    var alltext = msg.content.slice(7).split('|');
    var theauthor = {
        name: msg.author.username,
        icon_url: msg.author.avatarURL
    };
    var notembed = alltext[0];
    var embedobj = mkembed(alltext[1], alltext[2], [], parseInt(alltext[3]), theauthor, false);
    msg.channel.send({embed:embedobj})
    msg.channel.send(" ", {files: [notembed]})
  }
  
  if (command == "embedt") {
    var alltext = msg.content.slice(7).split('|');
    var notembed = alltext[0];
    var msgfields = [["Palabras clave:", "Meme, Prueba, Básico"], ["Truco proporcionado por:", "Alados5"]];
    var embedobj = mkembed(alltext[1], alltext[2], msgfields, 11075328, "", true);
    msg.channel.send({embed:embedobj})
    msg.channel.send(" ", {files: [notembed]})
  }
  // END EMBED
  
  
  // START MKPROJ
  if (command == 'nuevoproyecto') {
    var givenname = msg.content.slice(prefix.length+command.length+1);
    var chname = givenname.replace(/ /g, "_");
    if (msg.channel.id != 572891836687843328 && msg.channel.id != 552435323108589579) return msg.reply("Comando válido sólo en el canal de asignaciones!");
    msg.reply("Creando canal...");
    msg.guild.createChannel(chname, "text").then(ch => {
      ch.setParent('552432711072088074')
      ch.setTopic('Proyecto creado por '+msg.author.username)
    });
    msg.channel.send('Canal del Proyecto ***'+chname+'*** creado.')
    
    // Count projects, assign n (new already created)
    var projcateg = msg.guild.channels.find('id','552432711072088074');
    var totalproj = projcateg.children.size - 1;
    var rolename = "P" + totalproj + " - " + givenname;
    //msg.channel.send(rolename)
    
    msg.channel.send("Creando rol...");
    //Gray color: #95a5a6
    msg.guild.createRole({name:rolename, color:'#95a5a6'}).then(projrole => {
      msg.member.addRole(projrole)
      projrole.setMentionable(true)
      msg.channel.send("Rol "+projrole+" creado y asignado.")
      msg.channel.send("Todo listo! Disfruta con tu nuevo Proyecto!")
    });

  }
  // END MKPROJ
  
  // START MKCATEGORY
  if (command == 'mkcategory') {
    var chname = msg.content.slice(prefix.length+command.length+1);
    msg.channel.send("Creando categoría...")
    msg.guild.createChannel(chname, "category")
    msg.channel.send("Categoría ***"+chname+"*** creada.")
  }
  // END MKCATEGORY
  
  
  // START TRUCOS
  if (command == 'trucos') {
    //dbindex = {1:{name:"...", tags:["..."], desc: "..."}, ...}
    //mkembed(msgtitle, desctext, msgfields, msgcolor, msgauthor, footeron)
    if (args[0] == "todo") {
      var response = "*Nota: Se muestran sólo los títulos. Para leer el truco entero se debe pedir con `!trucos` seguido del número correspondiente.* \n\n";
      for (var ntrick in dbindex) {
        if (dbindex.hasOwnProperty(ntrick)) {
          response = response + ntrick + ": " + dbindex[ntrick].name + "\n";
        }
      }
      var embedobj = mkembed("Lista de todos los trucos", response, [], 11075328, "", true)
      msg.channel.send({embed:embedobj});
      //msg.channel.send("*Nota: En esta lista se muestran sólo los títulos de los trucos* \n"+
      //                 "*Para leer un truco de la base de datos, usa `!trucos` seguido del número del truco que quieras ver.* \n"+
      //                 "*Por ejemplo: `!trucos 3`*")
    }

    else if (args[0] == "tag") {
      if (!args[1]) return msg.reply("No has especificado ninguna palabra clave!");
      var response = "Lista de trucos con esta palabra clave: \n";
      var matchfound = false;
      for (var ntrick in dbindex) {
        if (dbindex.hasOwnProperty(ntrick)) {
          if (dbindex[ntrick].tags.includes(args[1])) {
            response = response + ntrick + ": " + dbindex[ntrick].name + "\n";
            matchfound = true;
          }
        }
      }
      if (matchfound) {
        msg.channel.send(response);
      }
      else {
        var nomatch = "No hay trucos con esta palabra clave. \n"+
                      "Prueba `!trucos todo` para una lista completa con los nombres y números de los trucos. \n"+
                      "Si crees que algún truco debería tener la etiqueta propuesta no dudes en decirlo!";
        msg.channel.send(nomatch)
      }
          
    }
    
    else if (!isNaN(parseInt(args[0]))) {
      var response = "**TRUCO " + args[0] + ": " + dbindex[args[0]].name + "** \n";
      response = response + dbindex[args[0]].desc + "\n";
      if (dbindex[args[0]].link) response = response + "Enlace o contenido multimedia: \n" + dbindex[args[0]].link + "\n";
      response = response + "Enviado por: " + dbindex[args[0]].user;
      msg.channel.send(response);
    }
    
    else {
      var response = "";
      if (!args[0]) response = response + "No has especificado qué hacer! \n\n";
      else response = response + "Comando no válido! \n\n";
      response = response + "`!trucos` accede a una base de datos de trucos, pero tienes que indicar más cosas. Aquí tienes las posibles opciones: \n\n"+
                     "  - `!trucos todo` devuelve una lista numerada con los títulos de todos los trucos de la base de datos \n\n"+
                     "  - `!trucos tag [TAG]` devuelve una lista numerada con todos los trucos con esa palabra clave. \n"+
                     "       Por ejemplo: `!trucos tag Esculpir` \n\n"+
                     "  - `!trucos [N]` devuelve el truco del número escrito, completo con descripción, imagen y autor \n"+
                     "       Por ejemplo: `!trucos 3` \n\n"+
                     "Si tienes un truco, consejo, ayuda o tutorial chulo y quieres que esté en la base de datos, no dudes en decirlo!";
      msg.reply(response);
    }
    
  }
  // END TRUCOS
  

  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
