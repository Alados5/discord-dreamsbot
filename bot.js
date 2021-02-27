// CLIENT:
const Discord = require('discord.js');
const client = new Discord.Client();

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
  //var gench = member.guild.channels.cache.find(ch => ch.name==='general');
  
  
  // TO-REDO: MAKE & SEND THE EMBED
  
  member.guild.channels.cache.find(ch => ch.name==='general').send("Hola");
  
  // TO-REDO: MEMBER COUNT!
  
});



// MESSAGE ACTIONS
// --------------------------------
client.on('message', (msg) => {
  
  // Returns if author is a bot
  if(msg.author.bot) return;

  var lowtext = msg.content.toLowerCase();
  
  // Save channels: #bot_debug and #bienvenida
  var dreami_channels = msg.guild.channels.cache;
  var debugch = dreami_channels.find(ch => ch.id==688107638239920282);
  var welcomech = dreami_channels.find(ch => ch.id==552804145866866698);
  
  // Returns if message doesn't start with prefix
  if(!msg.content.startsWith(prefix)) {
    var fecha = new Date();
    var utc = fecha.getTime();
    var cest = utc+3600000;
    
    // Purge only once a day (in real time, at 00-02h without DST, 01-03h with DST)
    if (cest % oneday > 7200000000) {
      purgeflag = false;
      return;
    }
    if (purgeflag) return;
    
    purgeflag = true;
    
    // ID of channel: #asignaciones
    var asignch = dreami_channels.find(ch => ch.id==572891836687843328);
    
    // Project Category ID: 552432711072088074
    var projcat = dreami_channels.find(ch => ch.id==552432711072088074);
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
              // Everyone ID: 530381279749865482
              // SEND_MESSAGES, VIEW_CHANNEL
              realch.overwritePermissions([{
                id: 458303268913938443,
                deny: ['VIEW_CHANNEL'],
              }]);
              //.then(archch => {
              //  archch.overwritePermissions([{
              //    id: projrole.id,
              //    allow: ['VIEW_CHANNEL'],
              //  }]);
                
                // Send exactly this message:
                //archch.send("```md\n<PROYECTO ARCHIVADO>\n```");
              realch.send("```md\n<PROYECTO ARCHIVADO>\n```");
              //});

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
  if (msg.author.id == 284104569586450434 || msg.author.id == 267707200577732608) {
    if (command === 'clear') {
      var ntoclear = parseInt(args[0]);
      if (!ntoclear || isNaN(ntoclear)) return msg.reply("Pon cuantos mensajes quieres eliminar!")
      msg.channel.bulkDelete(ntoclear+1);
      return;
    }
  // TO-REDO: OTHER ADMIN COMMANDS
  }
  // ----------------------------------------------------------------------------------------
  // ------------ END ADMIN COMMANDS --------------------------------------------------------
  // ----------------------------------------------------------------------------------------


  
  // - HELP MESSAGE ---------------------------------------------
  if (command === 'ayuda' || command === 'help') {
    msg.reply("¡Hola! Soy un bot creado por Alados5.\n\n"+
              "Aquí debería haber un mensaje de ayuda, pero aún no ha podido escribirlo bien. "+
              "Mientras tanto, puedes echarle un ojo a "+`${welcomech}`+", donde tienes algunos de los comandos con los que me puedes llamar.\n\n"+
              "¡Disculpa las molestias!");
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
    
    var usr_role_mng = msg.guild.members.cache.get(msg.author.id).roles;
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
  
  
  


});
