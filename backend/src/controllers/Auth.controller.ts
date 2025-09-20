import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { RegisterInput } from "../dto/RegisterInput";
import { LoginInput } from "../dto/LoginInput";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const data: RegisterInput = req.body;
    const { name, email, password } = data;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email นี้มีผู้ใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customName = `พยาบาล ${name.trim()}`;
    // สร้าง user ใหม่
    const newUser = await prisma.users.create({
      data: {
        name: customName,
        email,
        password: hashedPassword,
        role: Role.NURSE,
      },
    });

    return res.status(201).json({ message: "ลงทะเบียนสำเร็จ", user: newUser });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginInput = req.body;
    if (!data || !data.email || !data.password) {
      return res.status(400).json({ error: "กรุณากรอก email และ password" });
    }

    const { email, password } = data;
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "ไม่พบผู้ใช่งาน" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }
    const token = sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllNurse = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      where: {
        role: Role.NURSE, // หรือ equals: "NURSE"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
