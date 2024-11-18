import { GamesStateManager } from "./gamesStateManager.js"

const Game = {
  checkRoom: async (game, io, socket, roomId) => {
    try {
      await inviteCodeValidator.validate(roomId)
    } catch (error) {
      socket.emit("game:errorMessage", error.errors[0])
      return
    }

    if (!game.room || roomId !== game.room) {
      socket.emit("game:errorMessage", "Room not found")
      return
    }

    socket.emit("game:successRoom", roomId)
  },
}

export default Game
