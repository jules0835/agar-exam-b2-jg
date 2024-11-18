const express = require("express")
const http = require("http")
const socketIo = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const PORT = process.env.PORTBACK || 3001

app.get("/", (req, res) => {
  res.send("Hello Agar player, let's go for a day of dev!")
})

io.on("connection", (socket) => {
  console.log("a user connected")

  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
