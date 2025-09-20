// auth.router.ts
import express from "express";
import { authenticateJWT } from "../middleware/auth";
import { Role } from "@prisma/client";
import {
  getAllShfit,
  getNurseInShift,
  getShift,
  getShiftNurseById,
  shift,
  shift_assignments,
} from "../controllers/Appointment.controller";

const router = express.Router();

router.post("/shift", authenticateJWT([Role.HEAD_NURSE]), shift);
router.post(
  "/shift-assignments",
  authenticateJWT([Role.HEAD_NURSE]),
  shift_assignments
);
router.get("/shift/:date", authenticateJWT([Role.HEAD_NURSE]), getShift);
router.get("/shift", authenticateJWT([Role.HEAD_NURSE]), getAllShfit);
router.get(
  "/shift/:shift_id/nurse",
  authenticateJWT([Role.HEAD_NURSE]),
  getNurseInShift
);
router.get("/nurse/shift", authenticateJWT([Role.NURSE]), getShiftNurseById);
export default router;
