import express from "express";
import { Role } from "@prisma/client";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import {
  approveLeaveRequest,
  getAllLeaveRequest,
  getRequstLeave,
  leaveRequest,
  rejectLeaveRequest,
} from "../controllers/Leave-Request.controller";
const router = express.Router();

router.post("/leave-requests", authenticateJWT([Role.NURSE]), leaveRequest);
router.get(
  "/leave-requests",
  authenticateJWT([Role.HEAD_NURSE]),
  getAllLeaveRequest
);

router.patch(
  "/leave-requests/:id/approve",    
  authenticateJWT([Role.HEAD_NURSE]),
  approveLeaveRequest
);
router.patch(
  "/leave-requests/:id/reject",
  authenticateJWT([Role.HEAD_NURSE]),
  rejectLeaveRequest
);
router.get(
  "/leave-request/nurse",
  authenticateJWT([Role.NURSE]),
  getRequstLeave
);

// router
export default router;
