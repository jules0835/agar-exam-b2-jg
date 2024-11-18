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
  res.send("Hello Agar player, let's go for a day of dev!")
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
      })
      return
    }
    const game = GamesStateManager.getGame(data.gameId)
    if (!game) {
      callback({
        success: false,
        message: "Room not found",
      })
      return
    }

    if (game.players.find((p) => p.playerId === data.playerId)) {
      callback({
        success: false,
        message: "Player already in the game",
      })
      return
    }

    GamesStateManager.joinGame(data.gameId, data.playerId, data.playerName)
    socket.join(data.gameId)
    GamesStateManager.emitGameUpdate(ioServer, data.gameId)
    callback({
      success: true,
      gameData: GamesStateManager.getGame(data.gameId),
    })
  })

  socket.on("games:move", (data) => {
    //verifier si le joueur est dans la partie
    //verifier si le joueur peut se déplacer
    //mettre à jour la position du joueur
    //verifier si le joueur mange un autre joueur
    //verifier si le joueur mange de la nourriture
    //verifier si le joueur est mangé
    //mettre à jour la partie
    //envoyer la mise à jour de la partie à tous les joueurs
  })

  socket.on("disconnect", () => {
    //verifier si il s'agit du dernier joueur de la partie, si oui, on supprime la partie
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
