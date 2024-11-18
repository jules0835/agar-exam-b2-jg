"use client"

import { useParams } from "next/navigation"
import { Socket } from "@/context/Socket"
import { useState, useEffect } from "react"
import { usePlayerContext } from "@/context/Player"
import { useRouter } from "next/navigation"
import LoadingPage from "@/components/ui/Loading"

export default function Home() {
  const [game, setGame] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { playerName, updatePlayerName, playerId } = usePlayerContext()
  const { gameId } = useParams()
  const router = useRouter()

  const joinRoom = async (roomId, playerName, playerId) => {
    return new Promise((resolve, reject) => {
      Socket.emit(
        "games:joinRoom",
        { roomId, playerName, playerId },
        (response) => {
          if (response.success) {
            resolve(response)
          } else {
            reject(response)
          }
        }
      )
    })
  }

  useEffect(() => {
    const joinGame = async () => {
      try {
        console.log("joining game", gameId, playerName, playerId)
        const response = await joinRoom(roomId, playerName, playerId)
        setGame(response.gameData)
        setIsLoading(false)
        console.log("game joined", response)
      } catch (error) {
        console.error(error.message)
        router.push("/game?e=room_not_found")
      }
    }

    joinGame()

    Socket.on("games:gameUpdate", (game) => {
      console.log("game update", game)
    })
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  return <div></div>
}
