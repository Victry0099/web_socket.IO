import express from "express";
import { Server } from "socket.io";
import { createServer } from "http"


const port = 3000;
const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methodS: ["GET", "POST"],
        credentials: true
    }
})

app.get("/", (req, res) => {
    res.send("hello world")
})

io.on("connection", (socket) => {
    console.log("User connected")
    console.log("User", socket.id)


    //  socket.emit("welcome", `Wellcome to the server`)
    // socket.broadcast.emit("welcome", `${socket.id} join the server`)

    socket.on("message", ({ room, message }) => {
        console.log({ room, message })
        // io.emit("received-message", data);

        // socket.broadcast.emit("received-message", data);

        socket.to(room).emit("received-message", message);

    })
    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`user join ${room}`)
    })


    socket.on("disconnect", () => {
        console.log(`User disconnected ${socket.id}`)
    })



})
server.listen(port, () => {

    console.log(`app listing on http://localhost:${port}`)
})
