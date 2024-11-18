import Footer from "@/components/ui/Footer"
import Header from "@/components/ui/Header"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex justify-center h-screen w-screen flex-col">
      <Header />
      <main className="text-center">
        <div className="text-4xl font-bold my-10">Welcome to Agar.io</div>
        <div className="text-lg my-4">
          Dive into the fast-paced and addictive world of Agar.io, a massively
          multiplayer online game where survival is everything! Take control of
          a tiny cell, absorb smaller cells to grow, and avoid being devoured by
          larger opponents. Strategic movement, quick reflexes, and a bit of
          cunning are key to becoming the largest cell in the arena.
        </div>
        <div className="my-16 animate-bounce">
          <Link
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full"
            href="/game"
          >
            PLAY NOW
          </Link>
        </div>
        <div className="my-4">
          Whether you're playing solo or teaming up with friends, Agar offers
          endless fun and challenge. Customize your cell with unique skins,
          experiment with different strategies, and climb the leaderboard to
          dominate the arena. Simple to learn but hard to master, this game is
          perfect for players of all ages!
        </div>
      </main>
      <Footer />
    </div>
  )
}
