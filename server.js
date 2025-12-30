const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const games = {}; 

const preguntas = [
  // Pregunta 1
  { 
    tipo: "eleccion", // nuevo campo
    texto: "", 
    opciones: ["DANZA", "VAINA", "INDIA", "VIUDA"], 
    respuestasCorrectas: ["VIUDA"]
  },
  // Pregunta 2
  { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["LÓPEZ", "DÍAZ", "GÓMEZ", "VÁZQUEZ"], 
    respuestasCorrectas: ["LÓPEZ"] 
  },
    // Pregunta 3
  { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["DAVID BISBAL", "NATHY PELUSO", "ROCÍO JURADO"], 
    respuestasCorrectas: ["ROCÍO JURADO"] 
  },
      // Pregunta 4
  {
    tipo: "eleccion",
    texto: "",
    opciones: ["A", "B"],
    respuestasCorrectas: ["A"]
  },
    // Pregunta 5
{
    tipo: "texto",
    texto: "",
    respuestasCorrectas: ["BAJADA", "bajada", "Bajada"]
  },
  // Pregunta 6
  { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["A", "E", "I", "O", "U"], 
    respuestasCorrectas: ["A"] 
  },
  // Pregunta 7
    {
    tipo: "texto",
    texto: "",
    respuestasCorrectas: ["97"]
  },
    // Pregunta 8
    {
    tipo: "texto",
    texto: "",
    respuestasCorrectas: ["sus", "SUS", "Sus"]
  },
  // Pregunta 9
    {
    tipo: "texto",
    texto: "",
    respuestasCorrectas: ["5"]
  },
    // Pregunta 10
      {
    tipo: "texto",
    texto: "",
    respuestasCorrectas: ["chicago", "Chicago", "CHICAGO"]
  },
  // Pregunta 11
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["DIFÍCIL Y ABURRIDO", "FÁCIL Y DIVERTIDO", "DIVERTIDO Y AMENO"], 
    respuestasCorrectas: ["FÁCIL Y DIVERTIDO"] 
  },
  // Pregunta 12
    {
    tipo: "texto",
    texto: "",
    respuestasCorrectas: ["N", "n"]
  },
  // Pregunta 13
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["Derecha", "Izquierda"], 
    respuestasCorrectas: ["Derecha"] 
  },
    // Pregunta 14
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["1", "2", "Los dos a la vez"], 
    respuestasCorrectas: ["Los dos a la vez"] 
  },
      // Pregunta 15
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["J", "S", "V"], 
    respuestasCorrectas: ["S"] 
  },
        // Pregunta 16
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["Norte","Este", "Sur",  "Oeste"], 
    respuestasCorrectas: ["Oeste"] 
  },
  // Pregunta 17
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["365"]
  },
  // Pregunta 18
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["A", "H", "M", "J", "O", "P", "F"], 
    respuestasCorrectas: ["F"] 
  },
    // Pregunta 19
{ 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["5"]
  },
  // Pregunta 20
  { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["AMIGO", "Amigo", "amigo"]
  },
    // Pregunta 21
  { 
    tipo: "texto", // tipo "texto"
    texto: "Escribe el resultado x-x",
    respuestasCorrectas: ["43-90", "43 - 90"]
  },
    // Pregunta 22
  { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["SSSSSS", "ssssss", "Ssssss"]
  },
      // Pregunta 23
  { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["2", "Dos", "dos"]
  },
    // Pregunta 24
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["A(azul)", "L(rojo)", "O(rojo)", "Z(azul)", "L(azul)", "A(rojo)"], 
    respuestasCorrectas: ["L(rojo)"] 
  },
      // Pregunta 25
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["MIL", "mil", "Mil", "1.000", "1000"]
  },
  // Pregunta 26
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["Aitana", "Rosalía", "Malú"], 
    respuestasCorrectas: ["Rosalía"] 
  },
  // Pregunta 27
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["XVII", "xvii", "17"]
  },
    // Pregunta 28
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["3", "tres", "TRES", "Tres"]
  },
  //Pregunta 29
{ 
    tipo: "eleccion",
    texto: "", 
    opciones: ["Alegre", "Escrito", "Laberinto", "Cuaderno"], 
    respuestasCorrectas: ["Laberinto"] 
  },
    // Pregunta 30
{ 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["3", "tres", "TRES", "Tres"]
  },
  // Pregunta 31
  { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["1", "2", "3", "4", "5","6", "7", "8", "9", "10", "11", "12"], 
    respuestasCorrectas: ["4"] 
  },
    // Pregunta 32
  { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["A", "B", "C"], 
    respuestasCorrectas: ["A"] 
  },
    // Pregunta 33
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["TEATRO", "Teatro", "teatro"]
  },
      // Pregunta 34
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["2", "Dos", "DOS", "dos"]
  },
    // Pregunta 35
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["BOLSO", "Bolso", "bolso"]
  },
      // Pregunta 36
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["Z", "z"]
  },
  // Pregunta 37
    { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["Casilla blanca", "Casilla negra"], 
    respuestasCorrectas: ["Casilla negra"] 
  },
    // Pregunta 38
    { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["4", "cuatro", "CUATRO", "Cuatro"]
  },
  // Pregunta 39
      { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["2701", "2710","271"], 
    respuestasCorrectas: ["271"] 
  },
  // Pregunta 40
        { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["Salomé me molas", "Adán no calla con nada", "Anastasia se va a Asia","Isaac no ronca así"], 
    respuestasCorrectas: ["Anastasia se va a Asia"] 
  },
  // Pregunta 41
{ 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["100", "CIEN", "cien", "Cien"]
  },
  // Pregunta 42
  { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["D", "d"]
  },
    // Pregunta 43
  { 
    tipo: "texto", // tipo "texto"
    texto: "",
    respuestasCorrectas: ["9", "NUEVE", "nueve", "Nueve"]
  }
];


function generarGameId() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", socket => {
  console.log("[CONEXION] Usuario conectado:", socket.id);

  // ADMIN crea partida
socket.on("crear_partida", () => {
  const gameId = generarGameId();
  games[gameId] = {
    admin: socket.id,
    players: {},
    playersByName: {},
    currentQuestion: 0,
    estado: "esperando",
    respuestas: []
  };
  socket.join(gameId);
  console.log(`[CREAR] Partida creada: ${gameId} por ${socket.id}`);
  socket.emit("partida_creada", gameId);
});


socket.on("unirse_partida", ({ gameId, nombre }) => {
  const game = games[gameId];
  if (!game) return socket.emit("error", "La partida no existe");

  // Reconexión: si ya existe el nombre
  if (game.playersByName[nombre]) {
    const oldSocketId = game.playersByName[nombre];

    // Transferir datos del jugador antiguo al nuevo socket
    const oldPlayer = game.players[oldSocketId];
    game.players[socket.id] = { ...oldPlayer, conectado: true };
    delete game.players[oldSocketId];

    game.playersByName[nombre] = socket.id;

    socket.join(gameId);
    console.log(`[RECONNECT] ${nombre} se reconecta a ${gameId}`);
    io.to(socket.id).emit("jugador_reconectado", {
      score: oldPlayer.score,
      currentQuestion: game.currentQuestion
    });

    // Avisar al resto de jugadores
    io.to(gameId).emit("jugadores_actualizados", game.players);
    return;
  }

  // Nueva conexión
  const nombres = Object.values(game.players).map(p => p.nombre);
  if (nombres.includes(nombre)) {
    return socket.emit("nombre_duplicado", "Ese nombre ya está en la partida. Cambia tu nombre.");
  }

  game.players[socket.id] = { nombre, score: 0, ultimaCorrecta: null, conectado: true };

  // Inicializar array de respuestas vacío para este jugador
  if (!game.respuestas[nombre]) game.respuestas[nombre] = [];

  game.playersByName[nombre] = socket.id;
  socket.join(gameId);

  console.log(`[UNIRSE] ${nombre} se unió a ${gameId}`);
  io.to(gameId).emit("jugadores_actualizados", game.players);
});

  // ADMIN inicia partida
  socket.on("iniciar_partida", gameId => {
    const game = games[gameId];
    if (!game) return;
    if (socket.id !== game.admin) return socket.emit("error", "No eres el admin");

    game.estado = "en_juego";
    game.currentQuestion = 0;

    console.log(`[INICIAR] Partida ${gameId} iniciada por admin ${socket.id}`);

    io.to(gameId).emit("mensaje_general", "El admin inició la partida. ¡Comenzando primera pregunta!");

    for (const id in game.players) {
      io.to(id).emit("mostrar_pantalla_pregunta", {
        nombre: game.players[id].nombre,
        score: game.players[id].score
      });
    }

    enviarPregunta(gameId);
  });

  // ADMIN pasa a siguiente pregunta
  socket.on("siguiente_pregunta", gameId => {
    const game = games[gameId];
    if (!game) return;
    if (socket.id !== game.admin) return socket.emit("error", "No eres el admin");
    console.log(`[SIGUIENTE] Admin ${socket.id} pide siguiente pregunta en ${gameId}`);
    enviarPregunta(gameId);
  });
    function enviarPregunta(gameId) {
  const game = games[gameId];
  if (!game) return;

  if (game.currentQuestion >= preguntas.length) {
      io.to(gameId).emit("fin_juego", game.players);
      return;
  }

  const pregunta = preguntas[game.currentQuestion];
  game.estado = "en_juego";

  // Jugadores normales
  for (const id in game.players) {
      if (id !== game.admin) {
          io.to(id).emit("limpiar_pantalla_pregunta", {
              nombre: game.players[id].nombre,
              score: game.players[id].score
          });

          io.to(id).emit("nueva_pregunta", {
              texto: pregunta.texto,
              opciones: pregunta.opciones,
            tipo: pregunta.tipo,          // <-- esto
              numero: game.currentQuestion + 1
          });
      }
  }

  // Admin
    io.to(game.admin).emit("pregunta_para_admin", {
        numero: game.currentQuestion + 1,
        texto: pregunta.texto,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || []
    });


  // Resetear ultimaCorrecta
  for (const id in game.players) game.players[id].ultimaCorrecta = null;

  game.currentQuestion++;
}
socket.on("fin_tiempo_forzado", () => {
    if(contador) clearInterval(contador);

    tiempoRestante = 0;
    preguntaActiva = false;

    const tempJugador = document.getElementById("temporizador");
    if(tempJugador) tempJugador.textContent = "⏹ Pregunta cerrada";

    if(!soyAdmin){
        enviarRespuesta();
    }

    const radios = document.querySelectorAll('#pregunta input');
    radios.forEach(i => i.disabled = true);
});


// JUGADOR envía respuesta
socket.on("respuesta_jugador", ({ gameId, jugador, respuesta }) => {
  const game = games[gameId];
  if (!game) return;

  const playerObj = Object.values(game.players).find(p => p.nombre === jugador);
  if (!playerObj) return;

  const preguntaActual = preguntas[game.currentQuestion - 1];
  if (!preguntaActual) return; // <-- Protección extra

  let correcto = false;

  if (preguntaActual.tipo === "eleccion") {
      correcto = preguntaActual.respuestasCorrectas.includes(respuesta);
  } else if (preguntaActual.tipo === "texto") {
      const respLower = (respuesta || "").trim().toLowerCase();
      correcto = preguntaActual.respuestasCorrectas.some(r => r.toLowerCase() === respLower);
  }

  playerObj.ultimaCorrecta = correcto;
  if (correcto) playerObj.score += 1;

  // Guardar la respuesta real
  if (!game.respuestas[playerObj.nombre]) game.respuestas[playerObj.nombre] = [];
  game.respuestas[playerObj.nombre][game.currentQuestion - 1] = respuesta;  

  io.to(socket.id).emit("resultado_individual", { correcto, score: playerObj.score });

  // Calcular ranking
  const ranking = Object.values(game.players)
      .sort((a,b) => b.score - a.score)
      .map(p => ({ nombre: p.nombre, score: p.score }));

  // Enviar ranking
  io.to(game.admin).emit("ranking_actual", ranking);

  // Enviar detalle de respuestas al admin
  const detalleRespuestas = {};
  for (const id in game.players) {
      const p = game.players[id];
      // Protección contra índices inexistentes
      detalleRespuestas[p.nombre] = game.respuestas[p.nombre][game.currentQuestion - 1] || null;
  }

  // Para preguntas de elección, contar cuántos eligieron cada opción
  let opcionesConteo = null;
  if (preguntaActual.tipo === "eleccion") {
      opcionesConteo = {};
      for (const opt of preguntaActual.opciones) {
          opcionesConteo[opt] = 0;
      }
      for (const jugador in game.respuestas) {
          const r = game.respuestas[jugador][game.currentQuestion - 1];
          if (r && opcionesConteo[r] !== undefined) opcionesConteo[r]++;
      }
  }

  io.to(game.admin).emit("respuestas_detalle", {
      pregunta: preguntaActual.texto,
      tipo: preguntaActual.tipo,
      respuestasPorJugador: detalleRespuestas,
      conteoOpciones: opcionesConteo
  });
});

  // Limpiar pantalla
  socket.on("limpiar_jugadores", gameId => {
    const game = games[gameId];
    if (!game) return;
    for (const id in game.players) {
      if (id !== game.admin) io.to(id).emit("limpiar_pantalla");
    }
  });
socket.on("ir_a_pregunta", ({ gameId, numero }) => {
  const game = games[gameId];
  if (!game) return;
  if (socket.id !== game.admin) return;

  const index = numero - 1;
  if (index < 0 || index >= preguntas.length) return;

  console.log(`[ADMIN] Ir a pregunta ${numero}`);

  clearInterval(game.timer);
  game.timeLeft = 20; // o el tiempo que uses

  game.currentQuestion = index;

  enviarPregunta(gameId);
});


  // Admin finaliza partida
    socket.on("finalizar_partida", gameId => {
        const game = games[gameId];
        if (!game) return;
        if (socket.id !== game.admin) return socket.emit("error", "No eres el admin");

        // Ranking final ordenado
        const ranking = Object.values(game.players)
            .sort((a,b) => b.score - a.score)
            .map(p => ({ nombre: p.nombre, score: p.score }));

        // Enviar a todos los jugadores
        io.to(gameId).emit("fin_juego_ranking", ranking);
    });


socket.on("disconnect", () => {
  console.log("[DESCONECTADO] Usuario desconectado:", socket.id);
  for (const gameId in games) {
    const game = games[gameId];
    if (game.players[socket.id]) {
      const nombre = game.players[socket.id].nombre;
      game.players[socket.id].conectado = false;

      // Avisar al jugador que se desconectó
      io.to(gameId).emit("jugador_desconectado", { nombre });

      // No borramos para que pueda reconectar
      console.log(`[DESCONECTADO] ${nombre} queda marcado como desconectado en ${gameId}`);
    }
  }
});
});

server.listen(3000, () => console.log("Servidor escuchando en puerto 3000"));
