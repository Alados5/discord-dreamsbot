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
  if (command === 'ayuda' || command === 'help') {
    msg.reply("¡Hola! Soy un bot creado por Alados5.\n\n"+
              "Aquí debería haber un mensaje de ayuda, pero aún no ha podido escribirlo bien. "+
              "Mientras tanto, puedes echarle un ojo a "+`${welcomech}`+", donde tienes algunos de los comandos con los que me puedes llamar.\n\n"+
              "¡Disculpa las molestias!");
  }
  // END HELP
  

});
