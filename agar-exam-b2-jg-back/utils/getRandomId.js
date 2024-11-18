import { v4 as uuidv4 } from "uuid"

const getNewGameId = () => `G-${uuidv4()}`
const getNewPlayerId = () => `P-${uuidv4()}`
const getNewFoodId = () => `F-${uuidv4()}`

export default { getNewGameId, getNewPlayerId, getNewFoodId }
