import { Router } from "express";
import {
  getAllChatroomsController,
  joinRoomController,
} from "../controller/chatroom.controller";

const router = Router();

router.post("/joinroom", joinRoomController);
router.get("/allChatrooms", getAllChatroomsController);

export default router;
