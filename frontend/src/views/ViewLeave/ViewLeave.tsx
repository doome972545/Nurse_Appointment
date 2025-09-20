"use client";

import { useEffect, useState } from "react";
import { columnsViewLeave, type LeaveRequestData } from "./_components/columns";
import { DataTable } from "./_components/dataTableViewLeave";
import { getAllLeaveRequest } from "@/api/leave-request";

export default function ViewLeave() {
  const [data, setData] = useState<LeaveRequestData[]>([]);

  //   async function getData(): Promise<LeaveRequestData[]> {
  //     // Fetch data from your API here.
  //     return [
  //       {
  //         id: 7,
  //         shiftAssignment_id: 15,
  //         nurse_id: "3c40029f-9ecc-4811-b7f1-f1d70f071005",
  //         reason: "ป่วย",
  //         status: "PENDING",
  //         approve_by: null,
  //         nurse: {
  //           id: "3c40029f-9ecc-4811-b7f1-f1d70f071005",
  //           name: "พยาบาล สมหญิง สมบูรณ์",
  //           email: "nurse@gmail.com",
  //           role: "NURSE",
  //         },
  //         approve: null,
  //         shiftAssignment: {
  //           shift: {
  //             id: 15,
  //             date: "2025-10-25T00:00:00.000Z",
  //             start_time: "08:00",
  //             end_time: "16:00",
  //           },
  //         },
  //       },
  //       {
  //         id: 11,
  //         shiftAssignment_id: 18,
  //         nurse_id: "57cd6bd3-2dae-4a6a-a4df-10bd20a58b0d",
  //         reason: "ป่วย",
  //         status: "APPROVED",
  //         approve_by: null,
  //         nurse: {
  //           id: "57cd6bd3-2dae-4a6a-a4df-10bd20a58b0d",
  //           name: "พยาบาล สุชาดา รักเรียน",
  //           email: "nurse5@gmail.com",
  //           role: "NURSE",
  //         },
  //         approve: null,
  //         shiftAssignment: {
  //           shift: {
  //             id: 18,
  //             date: "2025-10-25T00:00:00.000Z",
  //             start_time: "22:00",
  //             end_time: "06:00",
  //           },
  //         },
  //       },
  //       {
  //         id: 12,
  //         shiftAssignment_id: 17,
  //         nurse_id: "57cd6bd3-2dae-4a6a-a4df-10bd20a58b0d",
  //         reason: "ป่วย",
  //         status: "PENDING",
  //         approve_by: null,
  //         nurse: {
  //           id: "57cd6bd3-2dae-4a6a-a4df-10bd20a58b0d",
  //           name: "พยาบาล สุชาดา รักเรียน",
  //           email: "nurse5@gmail.com",
  //           role: "NURSE",
  //         },
  //         approve: null,
  //         shiftAssignment: {
  //           shift: {
  //             id: 16,
  //             date: "2025-10-25T00:00:00.000Z",
  //             start_time: "15:00",
  //             end_time: "23:00",
  //           },
  //         },
  //       },
  //       {
  //         id: 13,
  //         shiftAssignment_id: 20,
  //         nurse_id: "3c40029f-9ecc-4811-b7f1-f1d70f071005",
  //         reason: "ไป ตจว.",
  //         status: "PENDING",
  //         approve_by: null,
  //         nurse: {
  //           id: "3c40029f-9ecc-4811-b7f1-f1d70f071005",
  //           name: "พยาบาล สมหญิง สมบูรณ์",
  //           email: "nurse@gmail.com",
  //           role: "NURSE",
  //         },
  //         approve: null,
  //         shiftAssignment: {
  //           shift: {
  //             id: 14,
  //             date: "2025-09-26T00:00:00.000Z",
  //             start_time: "15:00",
  //             end_time: "23:00",
  //           },
  //         },
  //       },
  //       {
  //         id: 14,
  //         shiftAssignment_id: 19,
  //         nurse_id: "3c40029f-9ecc-4811-b7f1-f1d70f071005",
  //         reason: "ไม่สบายตัว",
  //         status: "PENDING",
  //         approve_by: null,
  //         nurse: {
  //           id: "3c40029f-9ecc-4811-b7f1-f1d70f071005",
  //           name: "พยาบาล สมหญิง สมบูรณ์",
  //           email: "nurse@gmail.com",
  //           role: "NURSE",
  //         },
  //         approve: null,
  //         shiftAssignment: {
  //           shift: {
  //             id: 13,
  //             date: "2025-09-26T00:00:00.000Z",
  //             start_time: "08:00",
  //             end_time: "16:00",
  //           },
  //         },
  //       },
  //     ];
  //   }
  async function fetchAllLeaveRequest() {
    try {
      const fecthAll = await getAllLeaveRequest();
      setData(fecthAll);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAllLeaveRequest();
    // getData().then(setData);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columnsViewLeave} data={data} />
    </div>
  );
}
