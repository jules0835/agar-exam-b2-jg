import { Server } from "socket.io"
import express from "express"
import http from "http"
import Game from "./utils/game.js"
import { GamesStateManager } from "./utils/gamesStateManager.js"
import { playerStateManager } from "./utils/playerStateManager.js"
import cors from "cors"

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORTBACK || 3001

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
  const name = req.body.name
  const game = GamesStateManager.newGameState()
  GamesStateManager.addGame(game)
  res.json({ id: game.room })
})

ioServer.on("connection", (socket) => {
  console.log("a user connected")

  socket.on("disconnect", () => {
    //verifier si il s'agit du dernier joueur de la partie, si oui, on supprime la partie
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
