import * as React from "react";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { th } from "date-fns/locale";

export function CalendarCheck() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [shifts, _setShifts] = React.useState<
    {
      id: number;
      date: string;
      start_time: string;
      end_time: string;
    }[]
  >([]);
  const [_dayEvents, setDayEvents] = React.useState<
    { id: number; date: Date; start_time: string; end_time: string }[]
  >([]);
  const [_numMonths, setNumMonths] = React.useState(3);
  const [_isOpen, setIsOpen] = React.useState(false);
  //   const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  //   const Reload = useSelector((state: RootState) => state.app.reload);
  //   const dispatch = useDispatch();
  React.useEffect(() => {
    const updateNumMonths = () => {
      setNumMonths(window.innerWidth >= 768 ? 2 : 1);
    };
    updateNumMonths();
    window.addEventListener("resize", updateNumMonths);
    return () => window.removeEventListener("resize", updateNumMonths);
  }, []);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    setDate(selectedDate);
    setIsOpen(true);

    const events = shifts
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

  return (
    <div>
      <Calendar
        mode="single"
        locale={th}
        defaultMonth={date}
        numberOfMonths={1}
        selected={date}
        onSelect={handleSelect}
        className="rounded-lg border shadow-sm w-full"
        components={{
          DayButton: (props) => {
            const dayDate = props.day.date;
            const isEventDay = shifts.some(
              (s) => new Date(s.date).toDateString() === dayDate.toDateString()
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
  );
}
