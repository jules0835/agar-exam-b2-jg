"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Socket } from "@/context/Socket"
import { useRouter } from "next/navigation"
import { usePlayerContext } from "@/context/Player"
import LoadingPage from "@/components/ui/Loading"

const BACKEND_URL = "http://localhost:3001"

export default function Game() {
  const { playerName, updatePlayerName } = usePlayerContext()
  const [gamesRoom, setGamesRoom] = useState([])
  const [username, setUsername] = useState("")
  const [newRoomName, setNewRoomName] = useState("")
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const getRooms = () => {
    fetch(BACKEND_URL + "/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGamesRoom(data)
        console.log(data)
      })
  }

  const handleRename = () => {
    if (username.trim() !== "") {
      updatePlayerName(username.trim())
    }
  }

  const newGame = () => {
    if (!username || !newRoomName) {
      alert("Please fill in the form with your username and room name")
      return
    }

    setIsLoading(true)
    handleRename()

    fetch(BACKEND_URL + "/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameName: newRoomName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error)
        } else {
          router.push(`/game/${data.gameId}`)
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const joinGame = (gameId) => {
    if (!username) {
      alert("Please fill in the form with your username")
      return
    }

    setIsLoading(true)
    handleRename()

    router.push(`/game/${gameId}`)
  }

  useEffect(() => {
    const initializePlayer = async () => {
      if (playerName !== "") {
        setUsername(playerName)
        setPlayerLoaded(true)
      } else {
        setPlayerLoaded(false)
      }
    }

    initializePlayer()

    getRooms()

    Socket.on("games:roomList", (roomList) => {
      console.log(roomList)
      setGamesRoom(roomList)
    })

    return () => {
      Socket.off("games:roomList")
    }
  }, [playerName])

  if (!playerLoaded || isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-4 bg-white shadow-md">
        <Link href="/" className="text-blue-500 hover:underline">
          Return to home
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            It's play time!
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:space-x-16 w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <div className="flex flex-col items-center lg:w-1/3">
            <h2 className="text-center font-bold text-2xl mb-4 text-gray-700">
              Choose your username
            </h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-4 w-full bg-gray-100 border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="hidden lg:block border-l border-gray-300 mx-4"></div>

          <div className="flex flex-col items-center justify-center lg:w-2/3">
            <h2 className="text-center font-bold text-2xl mb-4 text-gray-700">
              Choose your room
            </h2>
            {gamesRoom.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {gamesRoom.map((game) => (
                  <button
                    key={game.gameId}
                    onClick={() => joinGame(game.gameId)}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                  >
                    {game.gameName}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No rooms available</p>
            )}

            <h2 className="text-center font-bold text-2xl mt-6 text-gray-700">
              Or create a new room
            </h2>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="mb-4 w-full bg-gray-100 border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter new room name"
            />
            <button
              onClick={() => newGame()}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
