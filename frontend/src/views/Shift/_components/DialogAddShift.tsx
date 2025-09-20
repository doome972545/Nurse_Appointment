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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { addShift } from "@/api/shift";

interface DialogDemoProps {
  defaultDate?: Date;
}
export const DialogAddShift = React.forwardRef<HTMLDivElement, DialogDemoProps>(
  ({ defaultDate }, ref) => {
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [open, setOpen] = React.useState(false);
    function formatThaiDateWithMonthWord(dateInput: string | Date): string {
      const date =
        typeof dateInput === "string" ? new Date(dateInput) : dateInput;

      const formatted = date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const [day, month, year] = formatted.split(" ");
      return `${day} เดือน ${month} ${year}`;
    }

    function toLocalDateString(date: Date): string {
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JS เดือนเริ่ม 0
      const day = date.getDate();

      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    }
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!defaultDate || !startTime || !endTime) {
        alert("กรุณาระบุวันที่, เวลาเริ่ม, เวลาเลิก");
        return;
      }

      try {
        const dateStr = toLocalDateString(defaultDate);
        await addShift(dateStr, startTime, endTime);
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <form onSubmit={handleSubmit}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-foreground text-white">
              เพิ่มเวร
            </Button>
          </DialogTrigger>
          <DialogContent ref={ref} className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เพิ่มเวร</DialogTitle>
              <DialogDescription>
                ระบุเวลาที่ต้องเข้าเวรแต่ละวัน
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="date">วันที่</Label>
                <h3>
                  {defaultDate ? formatThaiDateWithMonthWord(defaultDate) : "-"}
                </h3>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="start_time">เวลาเริ่ม</Label>
                <Input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="end_time">เวลาเลิก</Label>
                <Input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    );
  }
);

DialogAddShift.displayName = "DialogAddShift";
