import { LeaveStatus, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { LeaveRequestDto } from "../dto/LeaveRequestDto";
import { AuthRequest } from "../middleware/auth";
const prisma = new PrismaClient();

export const leaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const data: LeaveRequestDto = req.body;
    const { shiftAssignment_id, reason } = data;

    if (!data || !shiftAssignment_id || !reason) {
      return res.status(400).json({ error: "กรุณระบุ เวรที่ได้รับ เหตุผล" });
    }
    const existingLeaveRequest = await prisma.leave_Request.findFirst({
      where: { shiftAssignment_id },
    });
    if (existingLeaveRequest) {
      return res
        .status(400)
        .json({ error: "เวรที่เลือกได้ทำการส่งคำขอลาไปแล้ว รออนุมัติ" });
    }

    const newLeaveRequest = await prisma.leave_Request.create({
      data: {
        nurse_id: req.user?.id || "",
        shiftAssignment_id,
        reason,
        status: LeaveStatus.PENDING,
      },
    });
    return res.status(200).json(newLeaveRequest);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// GET: ดึงข้อมูลคำขอทั้งหมด
export const getAllLeaveRequest = async (req: Request, res: Response) => {
  try {
    const allLeaveRequests = await prisma.leave_Request.findMany({
      include: {
        nurse: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        }, // ผู้ส่งคำขอ
        approve: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        }, // ผู้อนุมัติ
        shiftAssignment: {
          select: {
            shift: true,
          },
        }, // เวรที่เกี่ยวข้อง
      },
      orderBy: { shiftAssignment: { shift: { date: "asc" } } },
    });
    return res.status(200).json(allLeaveRequests);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const approveLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const leaveRequestId = parseInt(req.params.id); // ดึง id จาก params
    const approverId = req.user?.id; // id ของผู้อนุมัติจาก JWT
    if (!approverId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const leaveRequest = await prisma.leave_Request.findUnique({
      where: { id: leaveRequestId },
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "ไม่พบคำขอลา" });
    }
    const updatedLeave = await prisma.leave_Request.update({
      where: { id: leaveRequestId },
      data: {
        status: LeaveStatus.APPROVED,
        approve_by: approverId,
      },
      include: {
        nurse: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        approve: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        shiftAssignment: true,
      },
    });
    return res
      .status(200)
      .json({ message: "อนุมัติคำขอลาเรียบร้อย", updatedLeave });
  } catch (error) {}
};

export const rejectLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const leaveRequestId = parseInt(req.params.id);
    const approverId = req.user?.id;

    if (!approverId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const leaveRequest = await prisma.leave_Request.findUnique({
      where: { id: leaveRequestId },
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "ไม่พบคำขอลา" });
    }

    const updatedLeave = await prisma.leave_Request.update({
      where: { id: leaveRequestId },
      data: {
        status: LeaveStatus.REJECTED,
        approve_by: approverId,
      },
      include: {
        nurse: {
          select: { id: true, name: true, email: true, role: true },
        },
        approve: {
          select: { id: true, name: true, email: true, role: true },
        },
        shiftAssignment: true,
      },
    });

    return res
      .status(200)
      .json({ message: "ปฏิเสธคำขอลาเรียบร้อย", updatedLeave });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getRequstLeave = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const getRequest = await prisma.leave_Request.findMany({
      where: { nurse_id: user?.id },
      include: {
        approve: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json(getRequest);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
