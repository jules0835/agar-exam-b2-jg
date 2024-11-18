"use client"

import { createContext, useContext, useEffect, useReducer } from "react"

const BACKEND_URL = "http://localhost:3001"

export const PlayerContext = createContext()

const playerReducer = (state, action) => {
  switch (action.type) {
    case "SET_PLAYER":
      return { ...state, ...action.payload }
    case "SET_PLAYER_NAME":
      return { ...state, playerName: action.payload }
    default:
      return state
  }
}

export const PlayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, {
    playerId: "",
    playerName: "",
  })

  useEffect(() => {
    const initializePlayer = async () => {
      let player = JSON.parse(localStorage.getItem("player"))

      if (!player || !player.playerId) {
        try {
          const response = await fetch(`${BACKEND_URL}/api/player/new`)
          console.log("response", response)
          if (!response.ok) {
            throw new Error("Error geting player id")
          }
          const data = await response.json()
          player = {
            playerId: data.playerId,
            playerName: "Anonymous",
          }

          localStorage.setItem("player", JSON.stringify(player))
        } catch (error) {
          console.error("Erreur with :", error)
          return
        }
      }

      dispatch({ type: "SET_PLAYER", payload: player })
    }

    initializePlayer()
  }, [])

  const updatePlayerName = (newName) => {
    const updatedPlayer = { ...state, playerName: newName }

    localStorage.setItem("player", JSON.stringify(updatedPlayer))

    dispatch({ type: "SET_PLAYER_NAME", payload: newName })
  }

  return (
    <PlayerContext.Provider value={{ ...state, updatePlayerName }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayerContext() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("context need to be in PlayerProvider")
  }
  return context
}
