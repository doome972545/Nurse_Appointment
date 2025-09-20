import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogDetail } from "./DialogDetail";
import { Button } from "@/components/ui/button";
import { DialogRequest } from "./DialogRequest";

export type ShiftData = {
  id: number;
  shiftAssignment_id: number;
  user_id: string;
  shift: {
    id: number;
    date: Date; // string จาก backend
    start_time: string;
    end_time: string;
  };
  leaveRequest?: {
    id: number;
    shiftAssignment_id: number;
    nurse_id: string;
    reason?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    approve_by?: string | null;
    approve?: { name: string } | null;
  } | null;
};

export const columns: ColumnDef<ShiftData>[] = [
  {
    accessorKey: "shift",
    header: () => (
      <div className="px-4 py-2 text-left font-bold text-primary">วันที่</div>
    ),
    cell: ({ row }) => {
      const shift = row.getValue("shift") as {
        id: number;
        date: Date;
        start_time: string;
        end_time: string;
      };

      return (
        <div className="px-4 py-2">
          {format(shift.date, "dd MMM yyyy", { locale: th })}
        </div>
      );
    },
  },
  {
    accessorKey: "start_time",
    header: () => (
      <div className="px-4 py-2 text-left font-bold">เวลาเข้าทำงาน</div>
    ),
    cell: ({ row }) => {
      const shift = row.getValue("shift") as {
        id: number;
        date: Date;
        start_time: string;
        end_time: string;
      };
      return <div className="px-4 py-2">{shift.start_time} น.</div>;
    },
  },
  {
    accessorKey: "end_time",
    header: () => (
      <div className="px-4 py-2 text-left font-bold">เวลาเลิกงาน</div>
    ),
    cell: ({ row }) => {
      const shift = row.getValue("shift") as {
        id: number;
        date: Date;
        start_time: string;
        end_time: string;
      };
      return <div className="px-4 py-2">{shift.end_time} น.</div>;
    },
  },
  {
    accessorKey: "leaveRequest",
    header: "การขอลา",
    cell: ({ row }) => {
      const leave = row.original.leaveRequest;

      if (!leave) return <span className="text-gray-400">ไม่มี</span>;

      let variant: "default" | "destructive" | "secondary" | "outline" =
        "default";
      let customClass = "";
      let customStatus = "";

      switch (leave.status) {
        case "APPROVED":
          variant = "default"; // ใช้สีเขียวของ Badge
          customClass = "text-green-800 bg-green-100 border-green-300";
          customStatus = "อนุมัติ";
          break;
        case "PENDING":
          variant = "outline"; // ใช้ outline เป็นสีเหลืองแทน
          customClass = "text-yellow-800 bg-yellow-100 border-yellow-300";
          customStatus = "รออนุมัติ";
          break;
        case "REJECTED":
          variant = "destructive"; // สีแดง
          customStatus = "ไม่อนุมัติ";
          break;
      }

      return (
        <Badge variant={variant} className={customClass}>
          {customStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => (
      <div className="px-4 py-2 text-right font-bold text-muted-foreground">
        จัดการ
      </div>
    ),
    cell: ({ row }) => {
      const leave = row.original.leaveRequest;

      return (
        <div className="flex justify-end px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="px-3 py-1 text-sm bg-primary rounded">
                ตัวเลือก
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>การทำงาน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogDetail shift={row.original} />
              {leave?.status !== "APPROVED" &&
              leave?.status !== "PENDING" &&
              leave?.status !== "REJECTED" ? (
                <DialogRequest shift={row.original} />
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
