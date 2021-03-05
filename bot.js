// CLIENT:
const Discord = require('discord.js');
const client = new Discord.Client({ ws: { intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS', 'GUILD_INTEGRATIONS',
                                                    'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES',
                                                    'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING',
                                                    'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'] } });

// THIS MUST BE THIS WAY:
client.login(process.env.BOT_TOKEN);

// Command prefix:
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
      "icon_url": "https://cdn.discordapp.com/avatars/284104569586450434/5e552cc6b11f538d3a6919eb22772a9b.png",
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
// --------------------------------
client.on('guildMemberAdd', (member) => {
  var gench = member.guild.channels.cache.find(ch => ch.name==='general');
  if (!gench) return;
  
  var msgcolor = 8388863;
  var msgtitle = "¡Bienvenid@ al Dreamiverso!";
  var desctext = "A modo de presentación, y para romper el hielo, "+
                   "nos puedes decir qué te gusta más de Dreams, y qué estás haciendo o quieres hacer. "+
                   "Incluso puedes asignarte un aura o pedírsela a un moderador."+
                   "\n\n¡No dudes en compartir tus creaciones, o pedir ayuda si te hace falta! :D"+
                   "\n\nÉchale un ojo a las normas del servidor, "+
                   "seguro que pronto un humano hablará contigo para darte una bienvenida mejor que la que te puedo dar yo."+
                   "\n\n¡Pero no dudes en usarme para lo que necesites!";
  
  gench.send("¡Muy buenas, "+`${member}`+"!", {embed: {
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
      "icon_url": "https://cdn.discordapp.com/avatars/284104569586450434/5e552cc6b11f538d3a6919eb22772a9b.png",
      "text": "Beep boop, yo soy un bot creado por Alados5"
    }
  }});
  
  
  var nmembers = member.guild.memberCount - 1;
  if (nmembers % 100 == 0) {
    var debugch = member.guild.channels.cache.find(ch => ch.id==688107638239920282);
    debugch.send(`${member.guild.roles.everyone}`+" Ahora somos: "+`${nmembers}`+" miembros."); 
    
    /*
    var milestonemsg = `${member.guild.roles.everyone}`+", ¡Es un momento importante para el servidor! \n"+
                       "¡Con la llegada de " +member+ ", ya somos " +nmembers+ " imps en esta comunidad! \n"+
                       "(Si veis "+(nmembers+1)+" miembros es porque yo no cuento, ¡soy un bot!)\n"+
                       "¡Gracias y felicidades a todos! :D";
    var celebgif = "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif";
    gench.send(milestonemsg, {files: [celebgif]});
    */
    
  }
  
  
});



// MESSAGE ACTIONS
// --------------------------------
client.on('message', (msg) => {
  
  // Returns if author is a bot
  if(msg.author.bot) return;

  var lowtext = msg.content.toLowerCase();
  
  // Save channels: #bot_debug, #bienvenida, #asignaciones
  var dreami_channels = msg.guild.channels.cache;
  var debugch = dreami_channels.find(ch => ch.id==688107638239920282);
  var welcomech = dreami_channels.find(ch => ch.id==552804145866866698);
  var asignch = dreami_channels.find(ch => ch.id==572891836687843328);
  var guidech = dreami_channels.find(ch => ch.id==673198900357759017);
  
  // Save Projects category
  var projcat = dreami_channels.find(ch => ch.id==552432711072088074);
  
  // Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) {
    var fecha = new Date();
    var utc = fecha.getTime();
    var cest = utc+3600000;
    
    // Purge only once a day (in real time, at 00-02h without DST, 01-03h with DST)
    if (cest % oneday > 7200000) {
      purgeflag = false;
      return;
    }
    if (purgeflag) return;
    
    purgeflag = true;
    // Fetch all the members of the server to ensure the cache is correct
    msg.guild.members.fetch({force: true}).then(mcol => {
      if (mcol.size != msg.guild.memberCount) return debugch.send("Error! Los miembros totales no cuadran!");
    }).catch(err => {
      return debugch.send("Timeout Error!");
    });

    var projchans = Array.from(projcat.children.values());
    
    for (var proji=0; proji<projchans.length; proji++) {
      if (projchans[proji].name == 'guía' || projchans[proji].name == 'asignaciones') continue;
      var projich = projchans[proji];
      var flag = "false";
      
      projich.messages.fetch({limit:1}).then(msgcol => {
        var lastmsg = msgcol.first();
        var realch = lastmsg.channel;
        var lasttime = lastmsg.createdAt.getTime();
        
        // Get corresponding role:
        var rolelist = Array.from(lastmsg.guild.roles.cache.values());
        var foundrole = false;
        for (var rolei=0; rolei<rolelist.length; rolei++) {
          if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(realch.name) >= 0) {
            var projrole = rolelist[rolei];
            foundrole = true;
          }
        }
        
        // More than two months from the last message: warn users
        if (utc-lasttime > twomonths) {
          if(foundrole) realch.send("¡Atención, "+`${projrole}`+"!\n"+
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
              if(foundrole) realch.send("¡Alerta, "+`${projrole}`+"!\n"+
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
              realch.updateOverwrite(realch.guild.roles.everyone, {VIEW_CHANNEL:false}).then(archch => {
                archch.updateOverwrite(projrole, {VIEW_CHANNEL:true});
                
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
  const fullquery = args.join(" ");
  
  
  // ----------------------------------------------------------------------------------------
  // -------------- ADMIN COMMANDS ----------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  if (msg.member.permissions.has('ADMINISTRATOR')) {
    
    // CLEAR MESSAGES IN BULK
    if (command === 'clear') {
      var ntoclear = parseInt(args[0]);
      if (!ntoclear || isNaN(ntoclear)) return msg.reply("Pon cuantos mensajes quieres eliminar!")
      msg.channel.bulkDelete(ntoclear+1);
      return;
    }
    
    // REPLY WITH SAME TEXT
    if (command === 'reply') {
      msg.delete();
      return msg.channel.send(msg.content.slice(7));
    }
    
    // CELEBRATORY GIF
    if (command === 'celebra100') {
      var nmembers = msg.guild.memberCount - 1;
      var milestonemsg = `${msg.guild.roles.everyone}`+", ¡Es un momento importante para el servidor! \n"+
                         "¡Con la llegada de [X], ya somos " +nmembers+ " imps en esta comunidad! \n"+
                         "(Si veis "+(nmembers+1)+" miembros es porque yo no cuento, ¡soy un bot!)\n"+
                         "¡Gracias y felicidades a todos! :D";
      var celebgif = "https://raw.githubusercontent.com/Alados5/discord-dreamsbot/master/media/milestone100gif.gif";
      return msg.channel.send(milestonemsg, {files: [celebgif]});
    }
    
    // WELCOME TEXT
    if (command === 'bienvenida' || command === 'welcome') {
      var msgcolor = 8388863;
      var msgtitle = "¡Bienvenid@ al Dreamiverso!";
      var desctext = "A modo de presentación, y para romper el hielo, "+
                     "nos puedes decir qué te gusta más de Dreams, y qué estás haciendo o quieres hacer. "+
                     "Incluso puedes asignarte un aura o pedírsela a un moderador."+
                     "\n\n¡No dudes en compartir tus creaciones, o pedir ayuda si te hace falta! :D"+
                     "\n\nÉchale un ojo a las normas del servidor, "+
                     "seguro que pronto un humano hablará contigo para darte una bienvenida mejor que la que te puedo dar yo."+
                     "\n\n¡Pero no dudes en usarme para lo que necesites!";
      
      msg.delete();

      msg.channel.send({embed: {
        color: msgcolor,
        description: desctext,
        title: msgtitle,
        thumbnail: {
          "url": msg.member.user.avatarURL
        },
        image: {
          "url": "https://i.imgur.com/pdmBuaV.png"
        },
        footer: {
          "icon_url": "https://cdn.discordapp.com/avatars/284104569586450434/5e552cc6b11f538d3a6919eb22772a9b.png",
          "text": "Beep boop, yo soy un bot creado por Alados5"
        }
      }});
      return;
    }
  }
  // ----------------------------------------------------------------------------------------
  // ------------ END ADMIN COMMANDS --------------------------------------------------------
  // ----------------------------------------------------------------------------------------


  
  
  // - HELP MESSAGE ---------------------------------------------
  // TODO: Finish and polish it :)
  //mkembed(msgtitle, desctext, msgfields, msgcolor, msgauthor, footeron)
  if (command === 'ayuda' || command === 'help') {
    var title = "DreamsBot - Ayuda";
    var desc  = "¡Hola! Soy un bot creado por Alados5 para ayudar en El Dreamiverso, el servidor hispanohablante de Dreams en Discord.\n"+
                "Aquí tienes mis comandos básicos y cómo usarlos, ¡espero que te sean útiles!\n\n";
    
    var msgfields = [["Ayuda", "`!ayuda`: Reproduce este mensaje"],
                     ["Aura", "`!aura [tipo]`: el bot mirará si has puesto un tipo de aura de Dreams (juego, diseño, arte, animación, audio o gestión)"+
                              "y te asignará el rol correspondiente. Si ya tienes ese rol, te lo quitará. Ejemplo: `!aura diseño`"],
                     ["Indreams", "`!dreamsearch [búsqueda]`: busca en indreams.me creaciones con el nombre especificado.\n"+
                                  "`!dreamersearch [jugador]`: busca en indreams.me jugadores con el nombre especificado.\n"+
                                  "`!creations [jugador]`: devuelve la página de creaciones del jugador especificado.\n"+
                                  "`!icons` o `!iconos`: devuelve el enlace a la página oficial con todos los iconos de Dreams"],
                     ["Proyectos", "Para una explicación extensa de cómo funcionan los proyectos y sus comandos, consulta "+`${guidech}`],
                     ["Más info", "Tienes más información sobre el servidor y el bot en "+`${welcomech}`]];
    
    var embedobj = mkembed(title, desc, msgfields, 12481535, "", true)
    msg.channel.send({embed:embedobj});

  }
  // - END HELP MESSAGE -----------------------------------------
  
  
  // - CHOOSE ---------------------------------------------------
  if (command === 'choose') {
    var randnum = Math.random();
    var chopt = msg.content.slice(prefix.length+command.length+1).split(', ');
    var nopt = chopt.length;

    for (var opti=1; opti<=nopt; opti++) {
      if (randnum <= opti/nopt) return msg.channel.send(chopt[opti-1])
    }
  }
  // - END CHOOSE -----------------------------------------------
  
  
  // - EMBED ----------------------------------------------------
  if (command === "embed") {
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

  if (command === "embedt") {
    var alltext = msg.content.slice(7).split('|');
    var notembed = alltext[0];
    var msgfields = [["Palabras clave:", "Meme, Prueba, Básico"], ["Truco proporcionado por:", "Alados5"]];
    var embedobj = mkembed(alltext[1], alltext[2], msgfields, 11075328, "", true);
    msg.channel.send({embed:embedobj})
    msg.channel.send(" ", {files: [notembed]})
    return;
  }
  // - END EMBED ------------------------------------------------
  
  
  // - AURA SECTION ---------------------------------------------
  if (command === 'aura') {
    var rolename = fullquery.toLowerCase();
    if (!rolename) return msg.reply("No has puesto ningún aura!");
    
    var rolenameslist = {"Arte":["art", "arte", "artemaníacos", "artemaniacos", "artemaniaco", "artista", "artist"],
                         "Diseño":["design", "diseño", "logic", "logica", "lógica", "hackermen", "hackerman"],
                         "Animación":["animation", "animacion", "animación", "titiriteros", "titiritero", "animador", "animator"],
                         "Audio":["music", "audio", "música", "los notas", "notas", "nota"],
                         "Gestión":["curation", "curacion", "curación", "gestion", "gestión", "organizar", "organizador", "marie kondo"],
                         "Juego":["play", "player", "juego", "jugar", "jugador", "jugadores", "4dplayers", "becario", "becarios"]};
    var modslist = ["mod", "mods", "moderador", "moderadores", "admin", "admins"];
    
    var rolelist = Array.from(msg.guild.roles.cache.values());
    var therole;
    for(var auratype in rolenameslist) {
      if(rolenameslist[auratype].indexOf(rolename) >= 0) {
        for (var rolei=0; rolei<rolelist.length; rolei++) {
          if(rolelist[rolei].name === auratype) {
            therole = rolelist[rolei];
          }
        }
      }
    }

    if (!therole) {
      if (modslist.indexOf(rolename) >= 0) {
          return msg.reply("Buen intento, pero no puedo hacerte mod.\n¡No es un aura de Dreams! 😉")
      }
      else {
          return msg.reply("El aura que has indicado no existe!")
      }
    }
    
    var usr_role_mng = msg.member.roles;
    var usr_therole = usr_role_mng.cache.find(rl => rl.name === therole.name);
    
    if(!usr_therole) {
      usr_role_mng.add(therole);
      msg.reply("Aura "+therole.name+" añadida!");
    }
    else {
      usr_role_mng.remove(therole);
      msg.reply("Aura "+therole.name+" eliminada!");
    }
  }
  // - END AURA SECTION -----------------------------------------
  
  
  // - INDREAMS.ME SECTION --------------------------------------
  
  // ICON LIST
  if (command === 'iconos') {
      var iconlink = 'https://docs.indreams.me/es/help/getting-started/icons';
      return msg.channel.send("La lista de iconos en Dreams puede encontrarse aquí (versión en español): \n" + iconlink);
  }
  if (command === 'icons') {
      var iconlink = 'https://docs.indreams.me/en/help/getting-started/icons';
      return msg.channel.send("La lista de iconos en Dreams puede encontrarse aquí (versión en inglés): \n" + iconlink);
  }
  // END ICON LIST
  
  // INDREAMS.ME SEARCH
  if (command === 'dreamsearch') {
      var basesearchlink = 'https://indreams.me/search/results/?term=';
      var searchterm = msg.content.slice(prefix.length+command.length+1);
      searchterm = searchterm.replace(/ /g, "%20");
      return msg.channel.send("Tu búsqueda en indreams.me da esto: \n" + basesearchlink + searchterm);
  }

  if (command === 'dreamsearchf') {
      var basesearchlink = 'https://indreams.me/search/results/?term=';
      var requestsearch = msg.content.slice(prefix.length+command.length+1);
      var filters = requestsearch.split('&&');
      var searchterm = filters.shift();
      searchterm = searchterm.replace(/ /g, "%20");
      var searchstring = searchterm + "&type=" + filters[0] + "&sort=" + filters[1];
      return msg.channel.send("Tu búsqueda filtrada en indreams.me da esto: \n" + basesearchlink + searchstring);

      //&type=dreams&sort=mostliked
  }

  if (command === 'dreamersearch') {
      var basesearchlink = 'https://indreams.me/search/results/?term=@';
      var searchterm = msg.content.slice(prefix.length+command.length+1);
      searchterm = searchterm.replace(/ /g, "%20");
      return msg.channel.send("Tu búsqueda de un usuario en indreams.me da esto: \n" + basesearchlink + searchterm);
  }
  if (command === 'creations') {
      var baselink = 'https://indreams.me/';
      var creator = msg.content.slice(prefix.length+command.length+1);
      var finallink = '/creations';
      creator = creator.replace(/ /g, "%20");
      return msg.channel.send("Las creaciones del usuario que me has dado son: \n" + baselink + creator + finallink);
  }
  // END INDREAMS.ME SEARCH
  
  // - END INDREAMS.ME SECTION ----------------------------------
  
  
  // - PROJECTS SECTION ------------------------------------------
  // Handy variables already created: asignch, debugch, projcat, mkproj_cd
  
  // START MKPROJECT
  if (command === 'nuevoproyecto') {
    if (mkproj_cd) return msg.reply("Un momento, aún estoy trabajando en la petición anterior!");
    
    // Remove all non-alphanumeric chars, but keep spaces and hyphens
    var givenname = msg.content.slice(prefix.length+command.length+1).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ- ]+/g,'');
    if (!givenname) return msg.reply("No has escrito ningún nombre!");
    
    // Change spaces by underscores for the channel name 
    var chname = givenname.replace(/ /g, "_");
    if (msg.channel.id != asignch.id && msg.channel.id != debugch.id) return msg.reply("Comando válido sólo en el canal "+`${asignch}`+"!");
    
    mkproj_cd = true;
    var totalproj = projcat.children.size - 1;
    var rolename = "P" + totalproj + " - " + givenname;
    
    msg.reply("Creando canal...");
    msg.guild.channels.create(chname, {
      type: 'text',
      parent: projcat,
      topic: 'Proyecto creado por '+msg.author.username,
    }).then(ch => {
      msg.channel.send('Canal del Proyecto creado: '+`${ch}`);
      
      msg.channel.send("Creando rol...");
      msg.guild.roles.create({data: {
        name: rolename,
        color: '#95a5a6',
        mentionable: true
      }}).then(projrole => {
        msg.guild.members.cache.get(msg.author.id).roles.add(projrole);
        ch.updateOverwrite(projrole, {MANAGE_MESSAGES:true});
        
        msg.channel.send('Rol '+`${projrole}`+' creado y asignado!');
        msg.channel.send("Todo listo! Disfruta del nuevo Proyecto!");
        
        ch.send("¡Aquí está, "+`${projrole}`+"! ¡Llena este canal de creatividad!\n"+
                "Puedes editar el nombre, el tema y los miembros de este proyecto con `!editaproyecto`");
        
        mkproj_cd = false;
      });
    });
  }
  // END MKPROJECT
  
  // START RECOVERPROJECT
  if (command === 'restauraproyecto') {
    if (msg.channel.parentID != projcat.id) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    
    var rolelist = Array.from(msg.guild.roles.cache.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.cache.get(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      msg.channel.updateOverwrite(msg.guild.roles.everyone, {VIEW_CHANNEL:true});
      msg.channel.send("```md\n<PROYECTO RESTAURADO>\n```");
    }
    else {
      return msg.reply("No formas parte de este proyecto (no tienes el rol).\n¿Cómo es que ves esto?");
    }
  }
  // END RECOVERPROJECT

  // START ARCHIVEPROJECT
  if (command === 'archivaproyecto') {
    if (msg.channel.parentID != projcat.id) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    
    var rolelist = Array.from(msg.guild.roles.cache.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.cache.get(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      msg.reply("Archivando proyecto manualmente...");
      
      // Archive channel -> Hide it from everyone except corresponding role and admins
      msg.channel.updateOverwrite(msg.guild.roles.everyone, {VIEW_CHANNEL:false}).then(archch => {
        archch.updateOverwrite(projrole, {VIEW_CHANNEL:true});
        
        archch.send("Ahora el canal quedará invisible menos para los Mods y el rol de este proyecto. "+
                    "Para restaurarlo se puede usar `!restauraproyecto` o contactar con un Mod.\n\n"+
                    "**¡ATENCIÓN!** Si no se dice nada por este canal en menos de **UN MES**, ```prolog\n"+
                    "ESTE PROYECTO VA A SER ELIMINADO\n```\n"+
                    "Y se hará sin previo aviso, ya que archivar es, por defecto, lo que se hace con los proyectos inactivos. "+
                    "Así que esta función de archivado manual se debe ejecutar bajo la propia responsabilidad. "+
                    "Si se envía cualquier mensaje, el proceso de purga se reinicia, y tras dos meses sin actividad se marcará el proyecto como inactivo.");
        
        // Send exactly this message:
        archch.send("```md\n<PROYECTO ARCHIVADO>\n```");
      });

    }
    else {
      return msg.reply("No formas parte de este proyecto (no tienes el rol): No puedes archivarlo.");
    }
  }
  // END ARCHIVEPROJECT
  
  // START EDITPROJECT
  if (command === 'editaproyecto') {
    if (msg.channel.parentID != projcat.id) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    
    var rolelist = Array.from(msg.guild.roles.cache.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.cache.get(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      // Edit Name - Topic - Members (add project role to others)
      if (args[0] === 'nombre') {
        // Remove weird characters from the start
        var intext = msg.content.slice(prefix.length+command.length+8).replace(/[^A-Za-zÀ-ÖØ-öø-ÿ- ]+/g,'');
        if (!intext) return msg.reply("¡No has escrito nada!");

        var chname = intext.replace(/ /g, "_");
        msg.channel.setName(chname);
        
        // Role: Keep "Pn - " regardless of length of number ("P1 - ", "P10 - ", etc.)
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
          if (mentionlist[mentioni].roles.cache.get(projrole.id)) {
            mentionlist[mentioni].roles.remove(projrole);
            msg.channel.send(`${mentionlist[mentioni]}`+" ya no colabora en este proyecto.");
          }
          else {
            mentionlist[mentioni].roles.add(projrole);
            msg.channel.send(`${mentionlist[mentioni]}`+" ahora colabora en este proyecto.");
            newcollab = true;
          }
        }
        
        if (newcollab) msg.channel.send("Recordad que con el rol "+`${projrole}`+" compartís permisos sobre este proyecto:"+
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
  // END EDITPROJECT
  
  // START RMPROJECT
  if (command === 'purgaproyecto' || command === 'borraproyecto') {
    if (msg.channel.parentID != projcat.id) return msg.reply("Esto no es el canal de un proyecto.");
    var chname = msg.channel.name;
    if (chname === "guía" || chname === "asignaciones") return msg.reply("Esto no es el canal de un proyecto.");
    
    var rolelist = Array.from(msg.guild.roles.cache.values());
    var foundrole = false;
    for (var rolei=0; rolei<rolelist.length; rolei++) {
      if(rolelist[rolei].name.replace(/ /g, "_").toLowerCase().indexOf(chname) >= 0) {
        var projrole = rolelist[rolei];
        foundrole = true;
      }
    }
    if (!foundrole) return msg.reply("Error. No se ha encontrado el rol de este proyecto.");
    
    if (msg.member.roles.cache.get(projrole.id) || msg.member.permissions.has('ADMINISTRATOR')) {
      msg.reply("¿Seguro? ¡Esta acción es irreversible!\n"+
                "**Reacciona** con el tick en menos de 10 segundos para confirmar.\n"+
                "Enviar cualquier mensaje también cancelará el proceso de eliminación.").then(sentmsg => {
        sentmsg.react('✅').then(tickreaction => {
          
          // Fetch all the members of the server to ensure the cache is correct
          msg.guild.members.fetch({force: true}).then(mcol => {
            if (mcol.size != msg.guild.memberCount) return msg.channel.send("Error! Los miembros totales no cuadran!");
          }).catch(err => {
            return msg.channel.send("Error! Fallo al buscar todos los miembros del proyecto!");
          });
          
          sleep(10000);
          
          msg.channel.messages.fetch({limit:1}).then(msgcol => {
            var lastmsg = msgcol.first();
            var realch = lastmsg.channel;
            
            // Any message from anyone other than the bot aborts purge
            if (lastmsg.author.id != 573146997419278336) return realch.send("Proceso de eliminación abortado.");
            
            // Check that someone reacted with the checkmark
            var reactlist = Array.from(lastmsg.reactions.cache.values());
            for (var reacti=0; reacti<reactlist.length; reacti++) {
              if (reactlist[reacti].emoji.name != '✅') continue;
              if (reactlist[reacti].count < 2) return realch.send("No se ha confirmado la eliminación.");
              var msgreaction = reactlist[reacti];
            }
            
            // Process data: reactions were from Project members, and the majority voted
            msgreaction.users.fetch().then(rcol => {
              var reactors = Array.from(rcol.values());
              
              // Only cached members, but should be updated!
              var rolemembers = projrole.members; 
              
              var validvotes = 0;
              for (var useri=0; useri<reactors.length; useri++) {
                if (reactors[useri].id == 573146997419278336) continue;
                var zamembah = rolemembers.get(reactors[useri].id);
                if (!zamembah) continue;
                validvotes += 1;
              }
              realch.send("Votos válidos: "+validvotes+"\nTotal de colaboradores: "+rolemembers.size);
              
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
                      realch.send(`${newname}`);
                      rolelist[rolei].setName(newname);
                    }
                  }
                  
                  // DELETE PROJECT & ROLE
                  realch.delete();
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
  // END RMPROJECT

  // - END PROJECTS SECTION --------------------------------------
  
  
  // - TRICKS SECTION --------------------------------------------
  if (command === 'trucos') {
    if (args[0]) args[0] = args[0].toLowerCase();
    if (args[1]) args[1] = args[1].toLowerCase();
    
    //dbindex = {1:{name:"...", tags:["..."], desc: "..."}, ...}
    //mkembed(msgtitle, desctext, msgfields, msgcolor, msgauthor, footeron)
    
    // TRICK LIST
    if (args[0] == "todo") {
      var response = "*Nota: Se muestran sólo los títulos. Para leer el truco entero se debe pedir con `!trucos` seguido del número correspondiente.* \n\n";
      for (var ntrick in dbindex) {
        if (dbindex.hasOwnProperty(ntrick)) {
          response = response + ntrick + ": " + dbindex[ntrick].name + "\n";
        }
      }
      var embedobj = mkembed("Lista de todos los trucos", response, [], 11075328, "", true)
      msg.channel.send({embed:embedobj});
    }
    
    // TRICKS BY TAG
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

    // TRICK BY ID
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
    
    // NOTHING SPECIFIED (HELP)
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
  // - END TRICKS SECTION ----------------------------------------

});
