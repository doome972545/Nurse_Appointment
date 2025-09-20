import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { ShiftData } from "./columns";

type DialogDetailProps = {
  shift: ShiftData;
};

export function DialogDetail({ shift }: DialogDetailProps) {
  return (
    <Dialog>
      {/* ✅ ใช้ asChild เพื่อไม่ให้ Dropdown ปิดเอง */}
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          ดูรายละเอียด
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>รายละเอียดเวร</DialogTitle>
          <DialogDescription>ข้อมูลของเวรที่คุณเลือก</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          <p>
            <b>วันที่:</b> {shift.shift.date.toLocaleDateString("th-TH")}
          </p>
          <p>
            <b>เวลาเข้างาน:</b> {shift.shift.start_time}
          </p>
          <p>
            <b>เวลาเลิกงาน:</b> {shift.shift.end_time}
          </p>
          <p>
            <b>สถานะขอลา:</b>{" "}
            {shift.leaveRequest ? (
              <span
                className={`
      px-2 py-1 rounded-md text-sm font-medium
      ${
        shift.leaveRequest.status === "APPROVED"
          ? "text-green-800 bg-green-100 border border-green-300"
          : shift.leaveRequest.status === "PENDING"
          ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
          : shift.leaveRequest.status === "REJECTED"
          ? "text-red-700 bg-red-100 border border-red-300"
          : ""
      }
    `}
              >
                {shift.leaveRequest.status === "APPROVED"
                  ? "อนุมัติ"
                  : shift.leaveRequest.status === "PENDING"
                  ? "รออนุมัติ"
                  : shift.leaveRequest.status === "REJECTED"
                  ? "ไม่อนุมัติ"
                  : "-"}
              </span>
            ) : (
              "-"
            )}
          </p>
        </div>
            
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ปิด</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
