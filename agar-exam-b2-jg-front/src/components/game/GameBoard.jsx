"use client"
import { useState, useEffect, useRef } from "react"
import Player from "@/components/game/Player"
import Food from "@/components/game/Food"

export default function GameBoard({
  game,
  playerId,
  playerPosition,
  setPlayerPosition,
}) {
  const [direction, setDirection] = useState({ dx: 0, dy: 0 })
  const gameBoardRef = useRef(null)

  const worldWidth = game.world.width
  const worldHeight = game.world.height

  const player = game.players.find((p) => p.playerId === playerId)
  const movementSpeed = 2

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gameBoardRef.current) return

      const { width, height } = gameBoardRef.current.getBoundingClientRect()

      const mouseX = e.clientX - width / 2
      const mouseY = e.clientY - height / 2

      const magnitude = Math.sqrt(mouseX ** 2 + mouseY ** 2) || 1
      const dx = (mouseX / magnitude) * movementSpeed
      const dy = (mouseY / magnitude) * movementSpeed

      setDirection({ dx, dy })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPosition((prevPosition) => ({
        x: Math.max(0, Math.min(worldWidth, prevPosition.x + direction.dx)),
        y: Math.max(0, Math.min(worldHeight, prevPosition.y + direction.dy)),
      }))
    }, 10)

    return () => clearInterval(interval)
  }, [direction, worldWidth, worldHeight])

  return (
    <div
      ref={gameBoardRef}
      className="relative w-full h-screen overflow-hidden bg-gray-800"
    >
      <div
        className="absolute top-0 left-0 border-4 border-red-500"
        style={{
          width: `${worldWidth}px`,
          height: `${worldHeight}px`,
          transform: `translate(-${playerPosition.x - 250}px, -${
            playerPosition.y - 250
          }px)`,
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: "repeat",
        }}
      >
        {game.players.map((player) => (
          <Player key={player.playerId} player={player} />
        ))}

        {game.foods.map((food, index) => (
          <Food key={index} food={food} />
        ))}
      </div>

      <div
        className="absolute z-50 w-10 h-10 rounded-full border-4 border-white bg-blue-500"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="text-white text-sm text-center block">
          {player?.playerName || "Player"}
        </span>
      </div>
    </div>
  )
}
