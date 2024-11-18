import { v4 as uuidv4 } from "uuid"

const playerStateManager = {
  getNewPlayerId: () => `P-${uuidv4()}`,

  newPlayerGame: (playerId, playerName) => {
    return {
      playerId,
      playerName,
      position: {
        x: Math.floor(Math.random() * 5000),
        y: Math.floor(Math.random() * 5000),
      },
      size: 10,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    }
  },
}

export { playerStateManager }
