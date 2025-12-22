const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const preguntas = [
  // Pregunta de opción múltiple (normal)
  { 
    tipo: "eleccion", // nuevo campo
    texto: "", 
    opciones: ["DANZA", "VAINA", "INDIA", "VIUDA"], 
    respuestasCorrectas: ["VIUDA"] // ahora es array
  },
  { 
    tipo: "eleccion",
    texto: "", 
    opciones: ["LÓPEZ", "DÍAZ", "GÓMEZ", "VÁZQUEZ"], 
    respuestasCorrectas: ["LÓPEZ"] 
  },

  // Pregunta de respuesta libre
  { 
    tipo: "texto", // tipo "texto"
    texto: "Escribe el nombre del planeta rojo",
    respuestasCorrectas: ["marte", "mars"] // acepta varias alternativas
  }
];


const games = {}; 

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
    currentQuestion: 0,
    estado: "esperando",
    respuestas: []
  };
  socket.join(gameId);
  console.log(`[CREAR] Partida creada: ${gameId} por ${socket.id}`);
  socket.emit("partida_creada", gameId);
});


  // JUGADOR se une
  socket.on("unirse_partida", ({ gameId, nombre }) => {
    const game = games[gameId];
    if (!game) {
      console.log(`[UNIRSE] Intento de unirse a partida inexistente: ${gameId}`);
      return socket.emit("error", "La partida no existe");
    }

    const nombres = Object.values(game.players).map(p => p.nombre);
    if (nombres.includes(nombre)) {
      console.log(`[UNIRSE] Nombre duplicado: ${nombre}`);
      return socket.emit("nombre_duplicado", "Ese nombre ya está en la partida. Cambia tu nombre.");
    }

    game.players[socket.id] = { nombre, score: 0, ultimaCorrecta: null };
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
      texto: pregunta.texto,
      numero: game.currentQuestion + 1
  });

  // Resetear ultimaCorrecta
  for (const id in game.players) game.players[id].ultimaCorrecta = null;

  game.currentQuestion++;
}
socket.on("forzar_fin_pregunta", gameId => {
    const game = games[gameId];
    if (!game) return;
    if (socket.id !== game.admin) return;

    console.log(`[ADMIN] Forzando fin de pregunta en ${gameId}`);

    // Avisamos SOLO a jugadores normales
    for (const id in game.players) {
        if (id !== game.admin) {
            io.to(id).emit("fin_tiempo_forzado");
        }
    }
});



socket.on("respuesta_jugador", ({ gameId, jugador, respuesta }) => {
    const game = games[gameId];
    if (!game) return;

    const playerObj = Object.values(game.players).find(p => p.nombre === jugador);
    if (!playerObj) return;

    const preguntaActual = preguntas[game.currentQuestion - 1];
    let correcto = false;

    if (preguntaActual.tipo === "eleccion") {
        // Comparación normal de elección
        correcto = preguntaActual.respuestasCorrectas.includes(respuesta);
    } else if (preguntaActual.tipo === "texto") {
        // Convertimos a minúsculas y comparamos con todas las respuestas correctas
        const respLower = (respuesta || "").trim().toLowerCase();
        correcto = preguntaActual.respuestasCorrectas.some(r => r.toLowerCase() === respLower);
    }

    // Guardamos la respuesta y puntuación SOLO al final
    playerObj.ultimaCorrecta = correcto;

    if (correcto) playerObj.score += 1; // Sumar puntos al final

    if (!game.respuestas[playerObj.nombre]) game.respuestas[playerObj.nombre] = [];
    game.respuestas[playerObj.nombre][game.currentQuestion - 1] = correcto ? 1 : 0;

    io.to(socket.id).emit("resultado_individual", { correcto, score: playerObj.score });

    const ranking = Object.values(game.players)
        .sort((a,b) => b.score - a.score)
        .map(p => ({ nombre: p.nombre, score: p.score }));

    io.to(game.admin).emit("ranking_actual", ranking);
    io.to(game.admin).emit("respuestas_detalle", game.respuestas);
});



  // Limpiar pantalla
  socket.on("limpiar_jugadores", gameId => {
    const game = games[gameId];
    if (!game) return;
    for (const id in game.players) {
      if (id !== game.admin) io.to(id).emit("limpiar_pantalla");
    }
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
      if (games[gameId].players[socket.id]) {
        delete games[gameId].players[socket.id];
      }
    }
  });
});

server.listen(3000, () => console.log("Servidor escuchando en puerto 3000"));
