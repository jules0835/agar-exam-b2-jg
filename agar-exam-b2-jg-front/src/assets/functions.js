const returnErrorMessage = (errorId) => {
  switch (errorId) {
    case "missing_data":
      return "An error occurred, please try again"
    case "room_not_found":
      return "Room not found, please try again"
    case "player_already_in_game":
      return "You are already in the game, you cannot join again"
    default:
      return "An error occurred"
  }
}

export { returnErrorMessage }
