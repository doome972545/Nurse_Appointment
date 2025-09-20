import * as React from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { th } from "date-fns/locale";
import { getAllShift } from "@/api/shift";
import { DialogAddShift } from "./DialogAddShift";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { isReload } from "@/slice/AppSlice";
import { DialogAddNurse } from "./DialogAddNurse";

// Main Calendar Component
export function Calendar02() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [shifts, setShifts] = React.useState<
    {
      id: number;
      date: string;
      start_time: string;
      end_time: string;
    }[]
  >([]);
  const [dayEvents, setDayEvents] = React.useState<
    { id: number; date: Date; start_time: string; end_time: string }[]
  >([]);
  const [numMonths, setNumMonths] = React.useState(3);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const Reload = useSelector((state: RootState) => state.app.reload);
  const dispatch = useDispatch();

  const calendarRef = React.useRef<HTMLDivElement>(null);
  const sidebarRef = React.useRef<HTMLDivElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const selectTriggerRef = React.useRef<HTMLButtonElement>(null);

  // ดึงข้อมูล shift จาก API
  const fetchShifts = async () => {
    try {
      const res = await getAllShift();
      setShifts(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchShifts();
    dispatch(isReload(false));
  }, [Reload]);

  React.useEffect(() => {
    fetchShifts();
    const updateNumMonths = () => {
      setNumMonths(window.innerWidth >= 768 ? 3 : 1);
    };
    updateNumMonths();
    window.addEventListener("resize", updateNumMonths);
    return () => window.removeEventListener("resize", updateNumMonths);
  }, []);
  const updateDayEvents = (
    selectedDate: Date | undefined,
    shiftsData = shifts
  ) => {
    if (!selectedDate) return;

    const events = shiftsData
      .filter(
        (s) => new Date(s.date).toDateString() === selectedDate.toDateString()
      )
      .map((s) => ({
        id: s.id,
        date: new Date(s.date),
        start_time: s.start_time,
        end_time: s.end_time,
      }));

    setDayEvents(events);
  };

  // handle เลือกวัน
  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    setIsOpen(true);
    updateDayEvents(selectedDate);
  };
  // reload shifts + อัพเดต events ถ้ามีวันที่เลือกอยู่
  React.useEffect(() => {
    if (Reload && date) {
      fetchShifts().then((data) => {
        const events = data
          .filter(
            (s: { date: string | number | Date }) =>
              new Date(s.date).toDateString() === date.toDateString()
          )
          .map(
            (s: {
              id: any;
              date: string | number | Date;
              start_time: any;
              end_time: any;
            }) => ({
              id: s.id,
              date: new Date(s.date),
              start_time: s.start_time,
              end_time: s.end_time,
            })
          );

        setDayEvents(events); // ✅ อัพเดต dayEvents ใหม่
        dispatch(isReload(false));
      });
    }
  }, [Reload, date, dispatch]);

  React.useEffect(() => {
    if (!isOpen) {
      setDate(undefined);
    }
  }, [isOpen]);

  // ปรับปรุง handleClickOutside เพื่อแก้ไขปัญหา Select
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;

      // หาก dialog เปิดอยู่ ไม่ให้ปิด sidebar
      if (isDialogOpen) return;

      // รายการ selectors ที่ควรยกเว้น (Select content และ related elements)
      const excludeSelectors = [
        '[role="listbox"]',
        "[data-radix-select-content]",
        "[data-radix-select-item]",
        "[data-radix-select-trigger]",
        "[data-radix-popper-content-wrapper]",
        "[data-radix-select-viewport]",
        ".select-content",
        ".select-item",
      ];

      // ตรวจสอบว่า target อยู่ใน element ที่ควรยกเว้นหรือไม่
      const isExcluded = excludeSelectors.some((selector) =>
        target.closest(selector)
      );

      if (
        calendarRef.current &&
        sidebarRef.current &&
        !calendarRef.current.contains(target as Node) &&
        !sidebarRef.current.contains(target as Node) &&
        !(dialogRef.current && dialogRef.current.contains(target as Node)) &&
        !selectTriggerRef.current?.contains(target as Node) &&
        !isExcluded
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDialogOpen]);

  return (
    <div className="relative flex gap-4">
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-sm font-medium mb-2">
          วันที่เลือก:{" "}
          {date
            ? date.toLocaleDateString("th-TH", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "ยังไม่ได้เลือก"}
        </div>

        <Calendar
          locale={th}
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={numMonths}
          className="rounded-lg border shadow-sm w-full"
          components={{
            DayButton: (props) => {
              const dayDate = props.day.date;
              const isEventDay = shifts.some(
                (s) =>
                  new Date(s.date).toDateString() === dayDate.toDateString()
              );

              return (
                <CalendarDayButton
                  {...props}
                  className={`${
                    isEventDay ? "bg-muted-foreground text-muted" : ""
                  } ${props.className}`}
                >
                  {dayDate.getDate()}
                </CalendarDayButton>
              );
            },
          }}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg z-50 p-4 overflow-y-auto 
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isOpen && (
          <div
            ref={sidebarRef}
            className="fixed right-0 top-0 h-full w-80 border-l shadow-lg z-50 p-4 overflow-y-auto"
          >
            {/* ปุ่มปิด */}
            <button
              onClick={() => setIsOpen(false)}
              className="mb-4 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              ปิด
            </button>

            {date && (
              <>
                <h2 className="font-bold mb-2">
                  {date.toLocaleDateString("th-TH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
                <DialogAddShift ref={dialogRef} defaultDate={date} />
                {dayEvents.length > 0 ? (
                  <div>
                    {dayEvents.map((e, i) => {
                      return (
                        <div key={i} className="mt-5">
                          <div className="bg-muted  shadow-lg p-2 rounded-md">
                            เข้าเวร: {e.start_time} ออกเวร: {e.end_time}
                            <DialogAddNurse
                              shift={e}
                              ref={dialogRef}
                              onOpenChange={setIsDialogOpen}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500">ไม่มีข้อมูล</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
