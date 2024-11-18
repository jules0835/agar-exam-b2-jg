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
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const gameBoardRef = useRef(null)

  const worldWidth = game.world.width
  const worldHeight = game.world.height

  const player = game.players.find((p) => p.playerId === playerId)
  const movementSpeed = 2

  // Handle player movement direction
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

  // Update player position at a fixed interval
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPosition((prevPosition) => ({
        x: Math.max(0, Math.min(worldWidth, prevPosition.x + direction.dx)),
        y: Math.max(0, Math.min(worldHeight, prevPosition.y + direction.dy)),
      }))
    }, 10)

    return () => clearInterval(interval)
  }, [direction, worldWidth, worldHeight])

  // Center the map on the player's position
  useEffect(() => {
    if (!gameBoardRef.current) return

    const { width, height } = gameBoardRef.current.getBoundingClientRect()

    setOffset({
      x: Math.max(0, playerPosition.x - width / 2),
      y: Math.max(0, playerPosition.y - height / 2),
    })
  }, [playerPosition])

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
          transform: `translate(-${offset.x}px, -${offset.y}px)`,
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
    </div>
  )
}
