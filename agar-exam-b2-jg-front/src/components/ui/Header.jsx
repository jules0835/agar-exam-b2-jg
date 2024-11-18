import Link from "next/link"

export default function Header() {
  return (
    <header>
      <div className=" bg-gray-800 p-4 flex items-center justify-between">
        <div className="text-white text-2xl font-bold">LOGO</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-white hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/game" className="text-white hover:text-gray-400">
                Play
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
