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



// TO-REDO: WELCOME MESSAGE



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
    // TO-REDO: TRIGGER OF PURGE PROJECTS
    
    return;
  }
  
  // Handles arguments to just take the first word
  const args = msg.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const fullquery = args.join(" ");
  
  
  // ----------------------------------------------------------------------------------------
  // -------------- ADMIN COMMANDS ----------------------------------------------------------
  // ----------------------------------------------------------------------------------------
  
  // TO-REDO: ADMIN COMMANDS
  
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
    if (!rolename) return msg.reply("No has puesto ningún rol!");
    
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
          return msg.reply("Buen intento, pero no puedo hacerte mod.\n¡No es un aura de Dreams! ;)")
      }
      else {
          return msg.reply("Este rol no existe!")
      }
    }
    debugch.send('Aura: ' + therole.name);
    
    var usr_role_mng = msg.guild.members.cache.get(msg.author.id).roles;
    var usr_therole = usr_role_mng.cache.find(rl => rl.name === therole.name);
    
    msg.channel.send(usr_therole);

    
    msg.reply('WIP');
  }
  // - END AURA SECTION -----------------------------------------
  
  
  


});
