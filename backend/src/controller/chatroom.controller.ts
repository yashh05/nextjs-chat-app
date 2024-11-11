import { Request, Response } from "express";
import prisma from "../db";

export const joinRoomController = async (req: Request, res: Response) => {
  try {
    const { chatRoomName, email } = req.body;

    let chatRoom;

    chatRoom = await prisma.chatroom.findUnique({
      where: {
        name: chatRoomName,
      },
      include: { users: true },
    });

    if (!chatRoom) {
      chatRoom = await prisma.chatroom.create({
        data: {
          name: chatRoomName,
          users: {
            connectOrCreate: {
              where: { email },
              create: { email },
            },
          },
        },
      });

      res.status(201).json({ message: "created new chatRoom" });
    } else {
      const userInRoom = chatRoom.users.some((user) => user.email === email);

      if (!userInRoom) {
        await prisma.chatroom.update({
          where: { id: chatRoom.id },
          data: {
            users: {
              connectOrCreate: {
                where: { email },
                create: { email },
              },
            },
          },
        });
        res.status(200).json({ message: "User added to the chatroom." });
      } else {
        res.status(200).json({ message: "user already exists." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllChatroomsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.query;
    const chatRooms = await prisma.user.findUnique({
      where: {
        email: email as string,
      },
      select: {
        chatrooms: true,
      },
    });
    const finalData = chatRooms?.chatrooms.map((room) => {
      return { id: room.id, name: room.name };
    });
    res.status(200).json({ data: finalData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
