import { useEffect, useState } from "react";
import { columns, type ShiftData } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { getShiftNurse } from "@/api/shift";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function CheckShiftSchedule() {
  const [data, setData] = useState<ShiftData[]>([]);
  const [loading, setLoading] = useState(true);

  const Reload = useSelector((state: RootState) => state.app.reload);
  async function fetchData() {
    try {
      const data: ShiftData[] = await getShiftNurse();
      setData(
        data.map((d) => ({
          ...d,
          shift: {
            ...d.shift,
            date: new Date(d.shift.date), // แปลงเป็น Date
          },
        }))
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!Reload) {
      fetchData();
    }
  }, [Reload]);

  if (loading) {
    return <p className="text-center py-10">กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
