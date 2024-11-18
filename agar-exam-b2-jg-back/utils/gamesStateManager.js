import { v4 as uuidv4 } from "uuid"
import { playerStateManager } from "./playerStateManager.js"
const games = []

const GamesStateManager = {
  getNewGameId: () => {
    return `G-${uuidv4()}`
  },

  removeGame: (game) => {
    games.splice(games.indexOf(game), 1)
  },

  getGames: () => {
    return games
  },

  addGame: (game) => {
    games.push(game)
  },

  leaveGame: (gameId, playerId) => {
    const game = GamesStateManager.getGame(gameId)
    if (!game) return
    if (!game.players) return
    game.players = game.players.filter((p) => p.playerId !== playerId)
    GamesStateManager.editGame(game)

    if (game.players.length === 0) {
      GamesStateManager.removeGame(game)
    }
  },

  getGame: (gameId) => {
    return games.find((game) => game.gameId === gameId)
  },

  editGame: (game) => {
    const index = games.findIndex((g) => g.gameId === game.gameId)
    games[index] = game
  },

  joinGame: (gameId, playerId, playerName) => {
    const newPlayer = playerStateManager.newPlayerGame(playerId, playerName)
    const game = GamesStateManager.getGame(gameId)
    game.players.push(newPlayer)
    GamesStateManager.editGame(game)
  },

  newGameState: (name) => {
    return {
      gameId: GamesStateManager.getNewGameId(),
      gameName: name,
      players: [],
      foods: [],
      world: {
        width: 1000,
        height: 1000,
      },
    }
  },

  emitGameListUpdate: (ioServer) => {
    ioServer.emit("games:roomList", GamesStateManager.getGames())
  },

  emitGameUpdate: (ioServer, gameId) => {
    ioServer
      .to(gameId)
      .emit("games:gameUpdate", GamesStateManager.getGame(gameId))
  },

  updatePlayerPosition: (gameId, playerId, position, socket) => {
    var game = GamesStateManager.getGame(gameId)
    game = GamesStateManager.generateFood(game)

    if (!game) return

    const player = game.players?.find((p) => p.playerId === playerId)
    if (!player) return

    player.position = position

    GamesStateManager.editGame(game)
    GamesStateManager.checkPlayerCollision(game, playerId, socket)
  },

  checkPlayerCollision: (game, playerId, socket) => {
    if (!game) return
    if (!game.players) return
    const player = game.players.find((p) => p.playerId === playerId)
    if (!player) return

    const { x: playerX, y: playerY } = player.position
    const playerSize = player.size

    game.players = game.players.filter((p) => {
      if (p.playerId === playerId) return true

      const { x: pX, y: pY } = p.position
      const pSize = p.size
      const distance = Math.sqrt((playerX - pX) ** 2 + (playerY - pY) ** 2)

      if (distance < playerSize + pSize) {
        if (playerSize > pSize) {
          player.size += pSize
          socket.to(game.gameId).emit("games:playerKilled", p.playerId)
          return false
        } else {
          p.size += playerSize
          return p.playerId !== playerId
        }
      }

      return true
    })

    game.foods = game.foods.filter((f) => {
      const { x: fX, y: fY } = f.position
      const fSize = f.size
      const distance = Math.sqrt((playerX - fX) ** 2 + (playerY - fY) ** 2)

      if (distance < playerSize + fSize) {
        player.size += 1
        return false
      }

      return true
    })
  },

  generateFood: (game) => {
    if (game && game.foods && game.foods.length < 40) {
      for (let i = 0; i < 20; i++) {
        game.foods.push({
          position: {
            x: Math.floor(Math.random() * game.world.width),
            y: Math.floor(Math.random() * game.world.height),
          },
          size: 5,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        })
      }
    } else if (game && !game.foods) {
      if (!game.foods) game.foods = []
      for (let i = 0; i < 40; i++) {
        game.foods.push({
          position: {
            x: Math.floor(Math.random() * game.world.width),
            y: Math.floor(Math.random() * game.world.height),
          },
          size: 5,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        })
      }
    }

    return game
  },
}

export { GamesStateManager }
