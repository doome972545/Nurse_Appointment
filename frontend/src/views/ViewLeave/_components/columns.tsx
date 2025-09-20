import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
export type LeaveRequestData = {
  id: number;
  shiftAssignment_id: number;
  nurse_id: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approve_by: string | null;
  nurse: {
    id: string;
    name: string;
    email: string;
    role: "NURSE" | "HEAD_NURSE";
  };
  approve: any | null;
  shiftAssignment: {
    shift: {
      id: number;
      date: string; // ใช้ string เพราะมาจาก API
      start_time: string;
      end_time: string;
    };
  };
};
export const columnsViewLeave: ColumnDef<LeaveRequestData>[] = [
  {
    accessorKey: "nurse.name",
    header: "ชื่อพยาบาล",
    cell: ({ row }) => row.original.nurse.name,
  },
  {
    accessorKey: "nurse.email",
    header: "Email",
    cell: ({ row }) => row.original.nurse.email,
  },
  {
    accessorKey: "shiftAssignment.shift.date",
    header: "วันที่เข้าเวร",
    cell: ({ row }) =>
      new Date(row.original.shiftAssignment.shift.date).toLocaleDateString(
        "th-TH",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      ),
  },
  {
    accessorKey: "shiftAssignment.shift",
    header: "เวลาเข้า-ออก",
    cell: ({ row }) =>
      `${row.original.shiftAssignment.shift.start_time} - ${row.original.shiftAssignment.shift.end_time}`,
  },
  {
    accessorKey: "reason",
    header: "เหตุผล",
  },
  {
    accessorKey: "approve_by",
    header: "ผู้อนุมัติ",
    cell: ({ row }) => row.original.approve_by ?? "-",
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "destructive" | "outline" = "default";
      let text = "";

      switch (status) {
        case "APPROVED":
          variant = "default";
          text = "อนุมัติ";
          break;
        case "PENDING":
          variant = "outline";
          text = "รออนุมัติ";
          break;
        case "REJECTED":
          variant = "destructive";
          text = "ไม่อนุมัติ";
          break;
      }

      return <Badge variant={variant}>{text}</Badge>;
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => console.log("Action", row.original.id)}
        >
          ขอลา
        </button>
      );
    },
  },
];
