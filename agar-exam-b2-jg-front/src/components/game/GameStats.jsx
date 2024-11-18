export default function GameStats({ gameStats }) {
  return (
    <header className="absolute flex justify-between items-center z-50 w-full p-4">
      <div>
        <h1 className="text-2xl font-bold">AGAR Game</h1>
        <p className="text-lg text-gray-500">Room: {gameStats.gameName}</p>
      </div>
      <div>
        <p className="text-lg text-gray-500">
          Players: {gameStats.players.length}
        </p>
      </div>
    </header>
  )
}
