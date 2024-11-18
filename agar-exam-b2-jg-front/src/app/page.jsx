import Footer from "@/components/ui/Footer"
import Header from "@/components/ui/Header"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex justify-center h-screen w-screen flex-col">
      <Header />
      <main className="text-center">
        <div className="text-4xl font-bold my-10">Welcom to the Agar Game</div>
        <div className="text-lg my-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </div>
      </main>
      <Footer />
    </div>
  )
}
