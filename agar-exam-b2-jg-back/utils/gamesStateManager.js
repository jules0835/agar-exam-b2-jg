import { v4 as uuidv4 } from "uuid"
import { playerStateManager } from "./playerStateManager.js"
const games = []

const GamesStateManager = {
  getNewGameId: () => {
    return `G-${uuidv4()}`
  },

  addGame: (game) => {
    games.push(game)
  },

  removeGame: (game) => {
    games.splice(games.indexOf(game), 1)
  },

  getGames: () => {
    return games
  },

  getGame: (roomId) => {
    return games.find((game) => game.room === roomId)
  },

  editGame: (game) => {
    const index = games.findIndex((g) => g.gameId === game.gameId)
    games[index] = game
  },

  joinGame: (gameId, playerId, playerName) => {
    newPlayer = playerStateManager.newPlayerGame(playerId, playerName)
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
        width: 5000,
        height: 5000,
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
}

export { GamesStateManager }
