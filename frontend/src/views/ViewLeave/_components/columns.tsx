import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { approveRequestLeave } from "@/api/leave-request";
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
  approve: {
    id: string;
    name: string;
    email: string;
    role: "HEAD_NURSE";
  };
  shiftAssignment: {
    shift: {
      id: number;
      date: string; // ใช้ string เพราะมาจาก API
      start_time: string;
      end_time: string;
    };
  };
};

async function actionRequest(id: number, type: string) {
  try {
    await approveRequestLeave(id, type);
  } catch (error) {
    console.log(error);
  }
}

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
    cell: ({ row }) => row.original.approve?.name ?? "-",
  },
  {
    accessorKey: "status",
    header: "สถานะ",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "destructive" | "outline" = "default";
      let customClass = "";
      let customStatus = "";

      switch (status) {
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
      const id = row.original.id;
      const approve = row.original.approve;
      return (
        <>
          {approve ? (
            ""
          ) : (
            <div className="flex justify-end ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-0 px-1">ตัวเลือก</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>การการอนุมัติลา</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => actionRequest(id, "approve")}
                      className="bg-green-100 text-black border border-green-600 hover:bg-green-600 hover:text-white"
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      onClick={() => actionRequest(id, "reject")}
                      className=" bg-red-100 text-black border border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      ปฏิเสธ
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </>
      );
    },
  },
];
