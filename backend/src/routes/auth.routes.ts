// auth.router.ts
import express from "express";
import { getAllNurse, login, register } from "../controllers/Auth.controller"; // import แบบ ES Module
import { authenticateJWT } from "../middleware/auth";
import { Role } from "@prisma/client";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/users", authenticateJWT([Role.HEAD_NURSE]), getAllNurse);
export default router;
