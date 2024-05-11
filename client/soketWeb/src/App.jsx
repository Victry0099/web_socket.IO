import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Container, Typography, TextField, Button, Stack } from "@mui/material"; // Import missing components

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketId, setSocketId] = useState("");
  // console.log(messages);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  const socket = useMemo(() => io("http://localhost:3000"), []);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    socket.on("received-message", (data) => {
      setMessages((messages) => [...messages, data]);
      console.log(data);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <Container maxWidth="sm">
        <Typography variant="h6" component="div" gutterBottom>
          Welcome to Socket.io
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          Welcome to {socketId}
        </Typography>

        <form onSubmit={joinRoomHandler}>
          <TextField
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)} // Add missing equal sign here
            id="outlined-basic"
            label="room Name"
            variant="outlined"
          />

          <Button variant="contained" color="primary" type="submit">
            Join
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)} // Add missing equal sign here
            id="outlined-basic"
            label="Message"
            variant="outlined"
          />

          <TextField
            value={room}
            onChange={(e) => setRoom(e.target.value)} // Add missing equal sign here
            id="outlined-basic"
            label="Room"
            variant="outlined"
          />

          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </form>

        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default App;
