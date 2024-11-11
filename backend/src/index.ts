import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.route";
import chatRoomRouter from "./routes/chatroom.route";
import prisma from "./db";

dotenv.config();

const app = express();
app.use(cors());
const server = require("http").Server(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the Express server!");
});

app.use("/api/users", userRouter);
app.use("/api/chatroom", chatRoomRouter);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", async ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("joinroom", chatroomId);

    console.log(`User ${socket.id} joined room ${chatroomId}`);

    const messages = await prisma.message.findMany({
      where: { chatroomId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        userId: true,
        content: true,
      },
    });

    messages.reverse();
    socket.emit("messageHistory", messages);
  });

  socket.on(
    "message",
    async ({
      user,
      message,
      chatroomId,
    }: {
      user: string;
      message: string;
      chatroomId: string;
    }) => {
      await prisma.message.create({
        data: {
          content: message,
          chatroomId,
          userId: user,
        },
      });

      io.to(chatroomId).emit("message", {
        content: message,
        userId: user,
      });
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log("WebSocket server running ");
  console.log("Express server running ");
});
