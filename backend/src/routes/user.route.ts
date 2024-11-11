import { Request, Response, Router } from "express";
import prisma from "../db";
const router = Router();

router.post("/create-user", async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const checkUser = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    if (!checkUser) {
      await prisma.user.create({
        data: {
          email: req.body.email,
        },
      });

      res.status(200).json({ message: "new user created" });
    } else res.status(200).json({ message: "already exists" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});
export default router;
