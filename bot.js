// CLIENT:
const Discord = require('discord.js');
const client = new Discord.Client();
var prefix = '!';

// PROJECTS INITIAL DATA:
var oneday = 86400000;
var oneweek = 604800000;
var twomonths = 5270400000;
var purgeflag = false;
var mkproj_cd = false;

// TRICKS DATABASE:
var dbindex = require("./trucos_db/index.js");
dbindex = dbindex.dbindex;



// - EMBED AS FUNCTION ------------
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
// --------------------------------



// - SLEEP FUNCTION ---------------
function sleep(mstime) {
  const tini = Date.now();
  var tend = tini;
  while (tend <= tini+mstime) {
    tend = Date.now();
  }
}
// --------------------------------



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
    
    var nmembers = member.guild.memberCount - 1;
    if (nmembers % 100 == 0) { 
      var milestonemsg = member.guild.defaultRole+", ¡Es un momento importante para el servidor! \n"+
                         "¡Con la llegada de " +member+ ", ya somos " +nmembers+ " imps en esta comunidad! \n"+
                         "(Si veis "+(nmembers+1)+" miembros es porque yo no cuento, ¡soy un bot!)\n"+
                         "¡Gracias y felicidades a todos! :D";
      var celebgif = "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/milestone100gif.gif";
      channel.send(milestonemsg, {files: [celebgif]});
    }
    
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
    var cest = utc+3600000;
    
    // Purge only once a day (in real time, at 00-01h without DST, 01-02h with DST)
    if (cest % oneday > 3600000) {
      purgeflag = false;
      return;
    }
    if (purgeflag) return;
    
    purgeflag = true;
    // ID of channel: #asignaciones
    var asignch = msg.guild.channels.find('id','572891836687843328');
    
    // Project Category ID: 552432711072088074
    var projcat = msg.guild.channels.find('id','552432711072088074');
    var projchans = Array.from(projcat.children.values());
    
    for (var proji=0; proji<projchans.length; proji++) {
      if (projchans[proji].name == 'guía' || projchans[proji].name == 'asignaciones') continue;
      var projich = projchans[proji];
      var flag = "false";
      
      projich.fetchMessages({limit:1}).then(msgcol => {
        var lastmsg = msgcol.first();
        var realch = lastmsg.channel;
        var lasttime = lastmsg.createdAt.getTime();
        
        // Get corresponding role:
        var rolelist = Array.from(lastmsg.guild.roles.values());
        var foundrole = false;
        for (var rolei=0; rolei<rolelist.length; rolei++) {
          if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(realch.name) >= 0) {
            var projrole = rolelist[rolei];
            foundrole = true;
          }
        }
        
        // More than two months from the last message: warn users
        if (utc-lasttime > twomonths) {
          if(foundrole) realch.send("¡Atención, "+projrole+"!\n"+
                                     "Esto es un aviso por inactividad:\n"+
                                     "No se ha detectado ningún mensaje en los últimos dos meses en este proyecto.");
          realch.send("Esta es la primera fase del proceso de purga de proyectos inactivos.\n"+
                       "Para detenerlo, cualquier mensaje por este canal bastará.\n"+
                       "Si no se responde a este mensaje en menos de **UNA SEMANA**, este proyecto quedará **ARCHIVADO** durante **UN MES**.\n"+
                       "Si dentro de ese mes tampoco hay actividad, el proyecto será **ELIMINADO**.");
          realch.send("¿Está abandonado este proyecto? También se puede eliminar inmediatamente mandando `!purgaproyecto` en este canal.");
          
          // Send exactly this message:
          realch.send("```md\n<PROYECTO INACTIVO>\n```");
        }
        
        // Bot Discord User ID: 573146997419278336
        else if (lastmsg.author.id == 573146997419278336) {
          // More than a month since ARCHIVED: delete
          if (lastmsg.content === "```md\n<PROYECTO ARCHIVADO>\n```") {
            if (utc-lasttime > twomonths/2) {
              
              // Subtract 1 to all project numbers greater than the deleted one
              var projnum = parseInt(projrole.name.slice(1, projrole.name.indexOf("-")-1));

              for (var rolei=0; rolei<rolelist.length; rolei++) {
                var numi = parseInt(rolelist[rolei].name.slice(1, rolelist[rolei].name.indexOf("-")-1));
                if (isNaN(numi)) continue;
                if (numi>projnum) {
                  var newname = "P"+(numi-1)+" "+rolelist[rolei].name.slice(rolelist[rolei].name.indexOf("-"), rolelist[rolei].name.length);
                  rolelist[rolei].setName(newname);
                }
              }
              
              // DELETE PROJECT & ROLE
              realch.delete();
              projrole.delete();
              
              // Send notice through "asignaciones"
              asignch.send('```prolog\nPROYECTO "'+realch.name.toUpperCase()+'" ELIMINADO\n```');
            }
          }
          // More than a week since INACTIVE: archive (mention users again)
          else if (lastmsg.content === "```md\n<PROYECTO INACTIVO>\n```") {
            if (utc-lasttime > oneweek) {
              if(foundrole) realch.send("¡Alerta, "+projrole+"!\n"+
                                        "No se ha respondido al aviso de inactividad.");
              realch.send("Esta es la segunda fase del proceso de purga de proyectos inactivos.\n"+
                          "Para detenerlo, cualquier mensaje por este canal bastará.\n"+
                          "Ahora el canal quedará invisible menos para los Mods y el rol de este proyecto.\n"+
                          "Para restaurarlo se puede usar `!restauraproyecto` o contactar con un Mod\n"+
                          "Si no se dice nada por este canal en menos de **UN MES**, ```prolog\n"+
                          "ESTE PROYECTO VA A SER ELIMINADO\n"+
                          "```Este es el último aviso, **¡si no hay actividad durante un mes no habrá vuelta atrás!**");
              realch.send("¿Está abandonado este proyecto? También se puede eliminar inmediatamente mandando `!purgaproyecto` en este canal.");
            
              // Archive channel -> Hide it from everyone except corresponding role and admins
              // SEND_MESSAGES, VIEW_CHANNEL
              realch.overwritePermissions(realch.guild.defaultRole, {VIEW_CHANNEL:false}).then(archch => {
                archch.overwritePermissions(projrole, {VIEW_CHANNEL:true});
                
                // Send exactly this message:
                archch.send("```md\n<PROYECTO ARCHIVADO>\n```");
              });

            }
          }
        }
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
 
    if (command == 'reply') {
      msg.delete();
      msg.channel.send(msg.content.slice(7));
    }
    
    if (command == 'mkcategory') {
      var chname = msg.content.slice(prefix.length+command.length+1);
      msg.channel.send("Creando categoría...")
      msg.guild.createChannel(chname, "category")
      msg.channel.send("Categoría ***"+chname+"*** creada.")
    }
    
    if (command == 'celebra100') {
      var nmembers = msg.guild.memberCount - 1;
      var milestonemsg = msg.guild.defaultRole+", ¡Es un momento importante para el servidor! \n"+
                         "¡Con la llegada de [X], ya somos " +nmembers+ " imps en esta comunidad! \n"+
                         "(Si veis "+(nmembers+1)+" miembros es porque yo no cuento, ¡soy un bot!)\n"+
                         "¡Gracias y felicidades a todos! :D";
      var celebgif = "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/milestone100gif.gif";
      msg.channel.send(milestonemsg, {files: [celebgif]});
    }
    
  }
  // END ADMIN COMMANDS
  
  
  
  // HELP
  if (command == 'ayuda' || command == 'help') {
    msg.reply("¡Hola! Soy un bot creado por Alados5.\n"+
              "Aquí debería haber un mensaje de ayuda, pero aún no ha podido escribirlo bien. "+
              "Mientras tanto, puedes echarle un ojo a #bienvenida, donde tienes algunos de los comandos con los que me puedes llamar.\n"+
              "¡Disculpa las molestias!");
  }
  // END HELP
  
  
  
  // - AURA SECTION ---------------------------------------------
    
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
  // ------------------------------------------------------------
  
  
  
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
  
  
  
  // - INDREAMS.ME SECTION --------------------------------------
  
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
  
  // ------------------------------------------------------------
  
  
  
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
  
  
  
  // - PROJECTS SECTION ------------------------------------------
  
  // START MKPROJ
  if (command == 'nuevoproyecto') {
    if (mkproj_cd) return msg.reply("Un momento, aún estoy trabajando en la petición anterior!");
    var givenname = msg.content.slice(prefix.length+command.length+1);
    if (!givenname) return msg.reply("No has escrito ningún nombre!");
    var chname = givenname.replace(/ /g, "_");
    if (msg.channel.id != 572891836687843328 && msg.channel.id != 552435323108589579) return msg.reply("Comando válido sólo en el canal de asignaciones!");
    
    mkproj_cd = true;
    
    msg.reply("Creando canal...");
    msg.guild.createChannel(chname, "text").then(ch => {
      ch.setParent('552432711072088074')
      ch.setTopic('Proyecto creado por '+msg.author.username)
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
        // Make role be able to manage messages!
        ch.overwritePermissions(projrole, {MANAGE_MESSAGES:true});
      
        msg.channel.send("Rol "+projrole+" creado y asignado.")
        msg.channel.send("Todo listo! Disfruta del nuevo Proyecto!")
      
        ch.send("¡Aquí está, "+projrole+"! ¡Llena este canal de creatividad!\n"+
                "Puedes editar el nombre, el tema y los miembros de este proyecto con `!editaproyecto`");
        mkproj_cd = false;
      });
    });
  }
  // END MKPROJ
  
  // START RECOVERPROJ
  if (command == 'restauraproyecto') {
    if (msg.channel.parentID != 552432711072088074) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    var rolelist = Array.from(msg.guild.roles.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.has(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      msg.channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL:true});
      msg.channel.send("```md\n<PROYECTO RESTAURADO>\n```")
    }
    else {
      return msg.reply("No formas parte de este proyecto (no tienes el rol).\n¿Cómo es que ves esto?");
    }
  }
  // END RECOVERPROJ
  
  // START ARCHIVEPROJ
  if (command == 'archivaproyecto') {
    if (msg.channel.parentID != 552432711072088074) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    var rolelist = Array.from(msg.guild.roles.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.has(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      //msg.channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL:false});
      
      // Archive channel -> Hide it from everyone except corresponding role and admins
      // SEND_MESSAGES, VIEW_CHANNEL
      msg.reply("Archivando proyecto manualmente...");
      msg.channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL:false}).then(archch => {
        archch.overwritePermissions(projrole, {VIEW_CHANNEL:true});

        // Send exactly this message:
        archch.send("```md\n<PROYECTO ARCHIVADO>\n```");
      });
      
    }
    else {
      return msg.reply("No formas parte de este proyecto (no tienes el rol): No puedes archivarlo.");
    }
  }
  // END ARCHIVEPROJ
  
  // START EDITPROJ
  if (command == 'editaproyecto') {
    if (msg.channel.parentID != 552432711072088074) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    var rolelist = Array.from(msg.guild.roles.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.has(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      // Edit Name - Topic - Members (add project role to others)
      if (args[0] == 'nombre') {
        var intext = msg.content.slice(prefix.length+command.length+8);
        if (!intext) return msg.reply("¡No has escrito nada!");
        var chname = intext.replace(/ /g, "_");
        msg.channel.setName(chname);
        // Keep "Pn - " regardless of length of number ("P1 - ", "P10 - ", etc.)
        projrole.setName(projrole.name.slice(0,projrole.name.indexOf("-")+2)+intext);
        msg.reply("¡Hecho!")
      }
      else if (args[0] == 'tema') {
        var intext = msg.content.slice(prefix.length+command.length+6);
        if (!intext) return msg.reply("¡No has escrito nada!");
        msg.channel.setTopic(intext);
        msg.reply("¡Hecho!")
      }
      else if (args[0] == 'miembros') {
        var mentionlist = Array.from(msg.mentions.members.values());
        if (mentionlist.length == 0) return msg.reply("¡No has mencionado a ningún usuario!")
        
        var newcollab = false;
        for (var mentioni=0; mentioni<mentionlist.length; mentioni++) {
          if (mentionlist[mentioni].roles.has(projrole.id)) {
            mentionlist[mentioni].removeRole(projrole);
            msg.channel.send(mentionlist[mentioni]+" ya no colabora en este proyecto.");
          }
          else {
            mentionlist[mentioni].addRole(projrole);
            msg.channel.send(mentionlist[mentioni]+" ahora colabora en este proyecto.");
            newcollab = true;
          }
        }
        
        if (newcollab) msg.channel.send("Recordad que con el rol "+projrole+" compartís permisos sobre este proyecto:"+
                                        " podéis cambiarle nombre, tema, colaboradores, etc.");
        msg.reply("¡Hecho!");
      }
      else {
        msg.reply("Debes especificar qué editar: nombre, tema o miembros.\n"+
                  "`!editaproyecto nombre` cambia el nombre del proyecto y del rol asociado a lo que escribas después.\n"+
                  "`!editaproyecto tema` cambia el tema (la descripción que ves arriba desde PC"+
                  " o en la barra lateral derecha desde móvil) del canal a lo que escribas después.\n"+
                  "`!editaproyecto miembros` le dará el rol de este proyecto a quién menciones."+
                  " Si mencionas a alguien que ya colabora, se le quitará el rol.\n\n"+
                  "Si lo que quieres es eliminar el proyecto, usa `!purgaproyecto`. Pero cuidado, porque no hay vuelta atrás!");
      }
    }
    else {
      return msg.reply("No formas parte de este proyecto (no tienes el rol): No puedes editar este canal.");
    }
  }
  // END EDITPROJ
  
  // START VERIFYPROJ
  if (command == 'verificaproyecto') {
    if (msg.channel.parentID != 552432711072088074) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    
    if (msg.member.permissions.has('ADMINISTRATOR')) {
      //msg.channel.overwritePermissions(msg.guild.defaultRole, {VIEW_CHANNEL:true});
      
      // ADD SOMETHING TO TELL
      
      msg.channel.send("```md\n<PROYECTO VERIFICADO>\n```");
    }
    else {
      return msg.reply("No eres moderador. No puedes verificar proyectos.");
    }
  }
  // END VERIFYPROJ
  
  // START RMPROJ
  if (command == 'purgaproyecto') {
    if (msg.channel.parentID != 552432711072088074) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    var rolelist = Array.from(msg.guild.roles.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.has(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      // Actually doesn't delete the project, just hides it even from them
      msg.reply("¿Seguro? ¡Esta acción es irreversible!\n"+
                "**Reacciona** con el tick en menos de 5 segundos para confirmar.\n"+
                "Enviar cualquier mensaje también cancelará el proceso de eliminación.").then(sentmsg => {
        sentmsg.react('✅').then(tickreaction => {
          
          // This didn't work, but in theory are valid options:
          //const purge_filter = (reaction, user) => reaction.emoji.name === '✅' && user.id != 573146997419278336; //&& (user.roles.has(projrole)) //|| user.permissions.has('ADMINISTRATOR'));
          //tickreaction.message.awaitReactions(purge_filter, { time: 20000 })
          //  .then(tickreaction.message.channel.send("OK"));
          
          //const collector = tickreaction.message.createReactionCollector(purge_filter, { time: 10000 });
          //collector.on('collect', tickreaction.message.channel.send("OK"));
          //collector.on('end', tickreaction.message.channel.send("Timeout"));
          
          sleep(5000);
          
          tickreaction.message.channel.fetchMessages({limit:1}).then(msgcol => {
            var lastmsg = msgcol.first();
            var realch = lastmsg.channel;
            
            // ID of channel: #asignaciones
            var asignch = msg.guild.channels.find('id','572891836687843328');
            
            if (lastmsg.author.id != 573146997419278336) return realch.send("Proceso de eliminación abortado.");
            var reactlist = Array.from(lastmsg.reactions.values());
            for (var reacti=0; reacti<reactlist.length; reacti++) {
              if (reactlist[reacti].emoji.name != '✅') continue;
              if (reactlist[reacti].count < 2) return realch.send("No se ha confirmado la eliminación.");
              var msgreaction = reactlist[reacti];
            }
            
            msgreaction.fetchUsers().then(rcol => {
              var rolemembers = projrole.members;
              var reactors = Array.from(rcol.values());
              var validvotes = 0;
              for (var useri=0; useri<reactors.length; useri++) {
                if (reactors[useri].id == 573146997419278336) continue;
                var zamembah = rolemembers.find('id', reactors[useri].id)
                if (!zamembah) continue;
                validvotes += 1;
              }
              realch.send("Votos válidos: "+validvotes+"\nTotal de colaboradores: "+rolemembers.size)
              if (validvotes >= Math.ceil(rolemembers.size/2)) {
                realch.send("```prolog\nELIMINANDO PROYECTO\n```").then(sentmsg => {
                  sleep(1000);
                  
                  // Subtract 1 to all project numbers greater than the deleted one
                  var projnum = parseInt(projrole.name.slice(1, projrole.name.indexOf("-")-1));
                  for (var rolei=0; rolei<rolelist.length; rolei++) {
                    var numi = parseInt(rolelist[rolei].name.slice(1, rolelist[rolei].name.indexOf("-")-1));
                    if (isNaN(numi)) continue;
                    if (numi>projnum) {
                      var newname = "P"+(numi-1)+" "+rolelist[rolei].name.slice(rolelist[rolei].name.indexOf("-"), rolelist[rolei].name.length);
                      rolelist[rolei].setName(newname);
                    }
                  }
                  
                  // DELETE PROJECT & ROLE
                  sentmsg.channel.delete();
                  projrole.delete();
                  
                  // Send notice through "asignaciones"
                  asignch.send('```prolog\nPROYECTO "'+realch.name.toUpperCase()+'" ELIMINADO\n```');
                });
              }
              else {
                realch.send("La mayoría de colaboradores no ha votado para eliminar el proyecto. No lo puedo eliminar.");
              }
              
            }); 
          });
        });
      });  
    }
    else {
      return msg.reply("No formas parte de este proyecto (no tienes el rol): No puedes eliminar este canal.");
    }
  }
  // END RMPROJ
  
  // ------------------------------------------------------------
  
  
  
  // - TRICKS SECTION -------------------------------------------
  
  // START TRUCOS
  if (command == 'trucos') {
    if (args[0]) args[0] = args[0].toLowerCase();
    if (args[1]) args[1] = args[1].toLowerCase();
    
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
      var title = "Lista de trucos con esta palabra clave";
      var matchfound = false;
      var response = "*Nota: Se muestran sólo los títulos. Para leer el truco entero se debe pedir con `!trucos` seguido del número correspondiente.* \n\n";
      for (var ntrick in dbindex) {
        if (dbindex.hasOwnProperty(ntrick)) {
          if (dbindex[ntrick].tags.includes(args[1])) {
            response = response + ntrick + ": " + dbindex[ntrick].name + "\n";
            matchfound = true;
          }
        }
      }
      if (matchfound) {
        var embedobj = mkembed(title, response, [], 11075328, "", true)
        msg.channel.send({embed:embedobj});
      }
      else {
        var title = "No hay trucos con esta palabra clave"
        var response = "Prueba `!trucos todo` para una lista completa con los nombres y números de los trucos. \n\n"+
                       "Si crees que algún truco debería tener la etiqueta propuesta no dudes en decirlo!";
        var embedobj = mkembed(title, response, [], 11075328, "", true)
        msg.channel.send({embed:embedobj});
      }
    }
    
    //mkembed(msgtitle, desctext, msgfields, msgcolor, msgauthor, footeron)
    else if (!isNaN(parseInt(args[0]))) {
      var title = "TRUCO " + args[0] + ": " + dbindex[args[0]].name;
      var response = dbindex[args[0]].desc + "\nㅤ";
      var taglist = "";
      for (var tagi=0; tagi<dbindex[args[0]].tags.length; tagi++) {
        var thistag = dbindex[args[0]].tags[tagi];
        taglist += thistag[0].toUpperCase() + thistag.slice(1,thistag.length) + ", ";
      }
      taglist = taglist.slice(0,taglist.length-2);
      var msgfields = [["Palabras clave:", taglist], ["Truco proporcionado por:", dbindex[args[0]].user]];
      var embedobj = mkembed(title, response, msgfields, 11075328, "", true)
      msg.channel.send({embed:embedobj});
      if (dbindex[args[0]].link) msg.channel.send("Enlace o contenido multimedia: \n" + dbindex[args[0]].link);
      
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
  // ------------------------------------------------------------

  
});

// THIS  MUST  BE  THIS  WAY
client.login(process.env.BOT_TOKEN);
