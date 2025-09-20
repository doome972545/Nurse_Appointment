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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { leaveRequest } from "@/api/leave-request";
import { useDispatch } from "react-redux";
import { isReload } from "@/slice/AppSlice";

type DialogDetailProps = {
  shift: ShiftData;
};

export function DialogRequest({ shift }: DialogDetailProps) {
  const [reason, setReason] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason.trim()) return; // ป้องกันส่งถ้า reason ว่าง
    try {
      await leaveRequest(reason, shift.id);
      dispatch(isReload(false));
      setReason(""); // รีเซ็ตฟอร์ม
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          ขอลาหยุด
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แบบฟอร์มขอลาหยุด</DialogTitle>
          <DialogDescription>กรุณาบอกเหตุผลในการขอลาหยุด</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Label>เหตุผล</Label>
          <Input
            placeholder="เหตุผล..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">ปิด</Button>
            </DialogClose>
            <Button type="submit" disabled={!reason.trim()}>
              ยืนยันการขอลาหยุด
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
