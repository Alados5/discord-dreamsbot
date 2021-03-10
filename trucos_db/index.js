var dbindex = {
  
  1: {
    name: "Centrar Imp",
    tags: ["básico", "función", "meme"],
    desc: "Recuerda que puedes mantener pulsado el botón OPTIONS para centrar el duende.",
    user: "Media Molecule",
    link: ""
  },
  2: {
    name: "Dormilones",
    tags: ["básico", "spam", "meme"],
    desc: "Suscríbete a Dormilones.",
    user: "Carloitaben",
    link: "https://www.youtube.com/c/dormilonesdreams"
  },
  3: {
    name: "Pintura: Spray vs Tinte",
    tags: ["básico", "esculpir", "pintura", "spray", "tinte"],
    desc: "Hay dos maneras de aplicar color a una escultura: \n"+
          "- La primera es pintar con el spray en el modo esculpir, "+
          "que permite pintar de forma precisa regiones concretas de las esculturas. \n"+
          "- La segunda es, fuera del modo esculpir, abrir el menú de la escultura con L1+Cuadrado, "+
          "escoger un color y subir el slider de tinte, cosa que sobreescribirá el color de la escultura "+
          "y hará que toda sea uniforme, del color seleccionado. \n\n"+
          "Clonar una escultura y cambiarle el color a una con el slider no afecta al termo de gráficos, "+
          "en cambio, entrar en el modo esculpir y pintar con el spray sí!",
    user: "Alados5",
    link: ""
  },
  4: {
    name: "El spray no cambia el color!",
    tags: ["básico", "color", "esculpir", "spray", "pintura", "error"],
    desc: "Si ves que al aplicar Spray en el modo esculpir no cambia el color de tu escultura, "+
          "seguramente tengas el slider de tinte a más del 100%. Sal del modo esculpir, "+
          "reduce su valor, y prueba de nuevo. Para más detalles consulta el truco 3.",
    user: "Alados5",
    link: "https://www.twitch.tv/videos/576250083"
  },
  5: {
    name: "Modos de entrada",
    tags: ["intermedio", "lógica", "cables", "entrada", "input", "blend"],
    desc: "Las conexiones de entrada de muchos artilugios permiten cambiar el modo de entrada, "+
          "y alterar cómo interactúan el valor de entrada y el valor dentro del artilugio. "+
          "Los modos se cambian pasando el imp sobre la pestaña de entrada y pulsando L1+X. Hay 3 modos:\n\n"+
          "- **__Sobrescribir__** (símbolo de una puerta AND): El valor del cable de entrada se aplica directamente, "+
          "sobrescribiendo cualquier valor que se indique dentro del artilugio. El slider quedará gris.\n\n"+
          "- **__Multiplicar?__** (símbolo como una X): Modula el valor de entrada multiplicando la señal del cable con la del slider. "+
          "El slider quedará iluminado, pasando el imp por encima se puede ver el valor original y el resultado del producto.\n\n"+
          "- **__Ponderar?__** (símbolo como un 0): Modula el valor de entrada haciendo una media ponderada entre todos los cables conectados. "+
          "La ponderación se regula según la energía de los artilugios de donde salgan los cables.",
    user: "Alados5",
    link: ""
  },
  6: {
    name: "Vacío",
    tags: ["blank"],
    desc: "Ejemplo",
    user: "N/A",
    link: ""
  },

};

module.exports.dbindex = dbindex;
