import { PlayerProvider } from "@/context/Player"
import "../styles/globals.css"
import { SocketProvider } from "@/context/Socket"

export const metadata = {
  title: "Agar Exam B2 JG",
  description: "Agar Exam B2 JG",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <PlayerProvider>
        <SocketProvider>
          <body className={``}>{children}</body>
        </SocketProvider>
      </PlayerProvider>
    </html>
  )
}
