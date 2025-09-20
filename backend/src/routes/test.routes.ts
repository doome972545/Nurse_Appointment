import express, { Response } from "express";
import { Role } from "@prisma/client";
import { authenticateJWT, AuthRequest } from "../middleware/auth";

const router = express.Router();

// HEAD_NURSE เท่านั้น
router.get(
  "/admin",
  authenticateJWT([Role.HEAD_NURSE]),
  (req: AuthRequest, res: Response) => {
    res.json({ message: "เฉพาะ HEAD_NURSE เข้าถึงได้", user: req.user });
  }
);

// NURSE หรือ HEAD_NURSE
router.get(
  "/nurse",
  authenticateJWT([Role.NURSE, Role.HEAD_NURSE]),
  (req: AuthRequest, res: Response) => {
    res.json({ message: "NURSE หรือ HEAD_NURSE เข้าถึงได้", user: req.user });
  }
);

export default router;
