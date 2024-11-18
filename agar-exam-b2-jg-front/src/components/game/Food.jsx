export default function Food({ food }) {
  console.log("food", food)
  return (
    <div
      className="absolute rounded-full z-50 p-2"
      style={{
        width: `${food.size / 10}px`,
        height: `${food.size / 10}px`,
        backgroundColor: food.color,
        left: `${food.position.x}px`,
        top: `${food.position.y}px`,
        transform: "translate(-50%, -50%)",
      }}
    ></div>
  )
}
