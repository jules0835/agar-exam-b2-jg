import { v4 as uuidv4 } from "uuid"

const playerStateManager = {
  getNewPlayerId: () => `P-${uuidv4()}`,
}

export { playerStateManager }
