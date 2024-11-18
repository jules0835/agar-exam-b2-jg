import { Server } from "socket.io"
import express from "express"
import http from "http"
import { GamesStateManager } from "./utils/gamesStateManager.js"
import { playerStateManager } from "./utils/playerStateManager.js"
import cors from "cors"

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORTBACK || 3001
const SOCKET_PORT = process.env.PORTSOCKET || 3002
const ioServer = new Server({
  cors: {
    origin: "*",
  },
})

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get("/", (req, res) => {
  res.send("Hello Agar player, let's go for a day full of dev!")
})

app.get("/api/games", (req, res) => {
  res.json(GamesStateManager.getGames())
})

app.get("/api/player/new", (req, res) => {
  res.json({ playerId: playerStateManager.getNewPlayerId() })
})

app.post("/api/games", (req, res) => {
  const name = req.body.gameName
  const game = GamesStateManager.newGameState(name)
  GamesStateManager.addGame(game)
  GamesStateManager.emitGameListUpdate(ioServer)
  res.json({ gameId: game.gameId })
})

ioServer.listen(SOCKET_PORT)
ioServer.on("connection", (socket) => {
  socket.on("games:joinRoom", (data, callback) => {
    console.log("games:joinRoom", data)

    if (!data.gameId || !data.playerId || !data.playerName) {
      callback({
        success: false,
        message: "Missing data",
        messageId: "missing_data",
      })
      return
    }
    const game = GamesStateManager.getGame(data.gameId)
    if (!game) {
      callback({
        success: false,
        message: "Room not found",
        messageId: "room_not_found",
      })
      return
    }

    // Pas le temps de faire la vérification des joueurs en doubleon
    // if (game.players.find((p) => p.playerId === data.playerId)) {
    //   return
    // }

    GamesStateManager.joinGame(data.gameId, data.playerId, data.playerName)
    socket.join(data.gameId)
    GamesStateManager.emitGameUpdate(ioServer, data.gameId)
    callback({
      success: true,
      gameData: GamesStateManager.getGame(data.gameId),
    })
  })

  socket.on("games:leaveRoom", (data) => {
    GamesStateManager.leaveGame(data.gameId, data.playerId)
    socket.leave(data.gameId)
    GamesStateManager.emitGameUpdate(ioServer, data.gameId)
    console.log("games:leaveRoom", data)
  })

  socket.on("games:updatePlayerPosition", (data) => {
    GamesStateManager.updatePlayerPosition(
      data.gameId,
      data.playerId,
      data.position,
      socket
    )
    GamesStateManager.emitGameUpdate(ioServer, data.gameId)
  })

  socket.on("disconnect", () => {
    //deconnexion du joueur de la partie en cours et si il est le dernier joueur de la partie, suppression de la partie (Pas le temps pour ici)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
