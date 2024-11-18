export default function Player({ player }) {
  return (
    <div
      className="absolute rounded-full border-2"
      style={{
        width: `${player.size * 2}px`,
        height: `${player.size * 2}px`,
        backgroundColor: player.color,
        left: `${player.position.x}px`,
        top: `${player.position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span className="text-xs text-white text-center block">
        {player.playerName}
      </span>
    </div>
  )
}
