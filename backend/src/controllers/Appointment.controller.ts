import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ShiftAssignmentRequest } from "../dto/ShiftAssignmentRequest";
import { ShiftRequest } from "../dto/ShiftRequest";
import { AuthRequest } from "../middleware/auth";
const prisma = new PrismaClient();

export const shift = async (req: Request, res: Response) => {
  try {
    const data: ShiftRequest = req.body;
    const { date, start_time, end_time } = data;

    if (!date || !start_time || !end_time) {
      return res.status(400).json({
        error: "กรุณาระบุ วันที่, เวลาตั้งแต่เริ่ม, เวลาสิ้นสุด",
      });
    }

    // const existingShi
    const dateObj = new Date(date); // แปลง string เป็น Date

    const newShift = await prisma.shift.create({
      data: {
        date: dateObj,
        start_time,
        end_time,
      },
    });

    return res.status(200).json(newShift);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
export const shift_assignments = async (req: Request, res: Response) => {
  try {
    const data: ShiftAssignmentRequest = req.body;
    const { user_id, shift_id } = data;

    if (!data || !user_id?.length || !shift_id) {
      return res.status(400).json({
        error: "กรุณาระบุพยาบาล หรือ เวร",
      });
    }

    // สร้าง assignment ให้พยาบาลแต่ละคน
    const assignments = await Promise.all(
      user_id.map((id) =>
        prisma.shift_Assignment.create({
          data: {
            user_id: id,
            shift_id: shift_id,
          },
        })
      )
    );

    return res.status(200).json(assignments);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getShift = async (req: Request, res: Response) => {
  try {
    const { date } = req.params; // "2025-09-19"
    if (!date) {
      return res.status(400).json({ error: "กรุณาระบูวันที่" });
    }

    // แปลงเป็น Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "วันที่ไม่ถูกต้อง" });
    }

    const start = new Date(date); // "2025-09-19"
    start.setHours(0, 0, 0, 0); // 2025-09-19 00:00:00

    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // 2025-09-19 23:59:59

    const dateShift = await prisma.shift.findFirst({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    return res.status(200).json({ dateShift });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllShfit = async (req: Request, res: Response) => {
  try {
    const AllShift = await prisma.shift.findMany();
    return res.status(200).json(AllShift);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getNurseInShift = async (req: Request, res: Response) => {
  try {
    const { shift_id } = req.params; // "2025-09-19"

    const getNurese = await prisma.shift_Assignment.findMany({
      where: {
        shift_id: parseInt(shift_id),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
    return res.status(200).json(getNurese);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getShiftNurseById = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    // ดึงเวรทั้งหมดของพยาบาล
    const shifts = await prisma.shift_Assignment.findMany({
      where: { user_id: user?.id },
      include: { shift: true },
      orderBy: { shift: { date: "asc" } },
    });

    // ดึงการลาของพยาบาล
    const leaves = await prisma.leave_Request.findMany({
      where: { nurse_id: user?.id },
      include: {
        approve: {
          select: {
            name: true,
          },
        },
      },
    });

    // รวมเข้าด้วยกัน
    const result = shifts.map((s) => {
      // หาว่ามี Leave_Request ของพยาบาลคนนี้สำหรับ shiftAssignment ไหนก็ได้
      const leave = leaves.find((l) => l.shiftAssignment_id === s.id);
      return {
        ...s,
        leaveRequest: leave || null,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
