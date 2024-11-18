"use client"

import { useParams } from "next/navigation"
import { Socket } from "@/context/Socket"
import { useState, useEffect } from "react"
import { usePlayerContext } from "@/context/Player"
import { useRouter } from "next/navigation"
import LoadingPage from "@/components/ui/Loading"
import GameStats from "@/components/game/GameStats"
import GameBoard from "@/components/game/GameBoard"

export default function Home() {
  const [game, setGame] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 })
  const { playerName, updatePlayerName, playerId } = usePlayerContext()
  const { gameId } = useParams()
  const router = useRouter()

  const joinRoom = async (gameId, playerName, playerId) => {
    return new Promise((resolve, reject) => {
      Socket.emit(
        "games:joinRoom",
        { gameId, playerName, playerId },
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
    Socket.emit("games:updatePlayerPosition", {
      gameId,
      playerId,
      position: playerPosition,
    })
  }, [playerPosition])

  useEffect(() => {
    const joinGame = async () => {
      try {
        console.log("joining game", gameId, playerName, playerId)
        const response = await joinRoom(gameId, playerName, playerId)
        setGame(response.gameData)
        setIsLoading(false)
        console.log("game joined", response)
        setInitialPlayerPosition(response.gameData) // Passez les données pour éviter de dépendre de l'état
      } catch (error) {
        console.error(error.message)
        router.push(`/game?e=${error.messageId}`)
      }
    }

    joinGame()

    Socket.on("games:gameUpdate", (game) => {
      console.log("game update", game)
      setGame(game)
    })

    return () => {
      Socket.emit("games:leaveRoom", { gameId, playerId })
      Socket.off("games:gameUpdate")
    }
  }, [gameId, playerName, playerId])

  const setInitialPlayerPosition = (gameData) => {
    if (!gameData || !gameData.players) return
    const player = gameData.players.find((p) => p.playerId === playerId)
    if (player) {
      setPlayerPosition(player.position)
    } else {
      console.error("Player not found in game data")
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div>
      <div>
        <GameStats gameStats={game} />
      </div>
      <div>
        <GameBoard
          game={game}
          playerId={playerId}
          playerPosition={playerPosition}
          setPlayerPosition={setPlayerPosition}
        />
      </div>
    </div>
  )
}
