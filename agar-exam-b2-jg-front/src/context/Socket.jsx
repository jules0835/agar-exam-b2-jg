"use client"
import { io } from "socket.io-client"
import { createContext, useContext } from "react"

const BACKEND_URL = "http://localhost:3001"

export const Socket = io(BACKEND_URL, {
  transports: ["websocket"],
})

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={Socket}>{children}</SocketContext.Provider>
  )
}

export function useSocketContext() {
  const contextSocket = useContext(SocketContext)

  return { socket: contextSocket }
}
