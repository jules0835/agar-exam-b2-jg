const games = []

const GamesStateManager = {
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
    const index = games.findIndex((g) => g.room === game.room)
    games[index] = game
  },

  newGameState: () => {
    return {
      players: [],
      food: [],
      viruses: [],
    }
  },
}

export { GamesStateManager }
