import { getAllNurse } from "@/api/auth";
import { addNurseToShift, getNurseInShift } from "@/api/shift";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React from "react";

export const DialogAddNurse = React.forwardRef<
  HTMLDivElement,
  {
    onOpenChange?: (open: boolean) => void;
    shift: { id: number; date: Date; start_time: string; end_time: string };
  }
>((props, ref) => {
  const [selectedNurses, setSelectedNurses] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // ข้อมูลพยาบาล - ใช้ useMemo เพื่อป้องกันการสร้างใหม่ทุกครั้ง
  const [nurseOptions, setNurseOptions] = React.useState<
    { id: string; label: string }[]
  >([]);
  const fetchAllNurseOptions = async () => {
    try {
      // 1. ดึงพยาบาลทั้งหมด
      const allNurses = await getAllNurse();
      // 2. ดึงพยาบาลที่อยู่ในเวรนี้
      const nursesInShift = await getNurseInShift(props.shift.id);

      const nurseIdsInShift = nursesInShift.map((n: any) => n.user.id);
      // 3. filter พยาบาลที่ยังไม่อยู่ในเวร
      const options = allNurses
        .filter((n: any) => !nurseIdsInShift.includes(n.id))
        .map((n: any) => ({
          id: n.id,
          label: n.name,
        }));

      setNurseOptions(options);
    } catch (err) {
      console.error(err);
    }
  };

  //   const fetchAllNurseOptions = async () => {
  //     try {
  //       // 1. ดึงพยาบาลทั้งหมด
  //       const allNurses = await getAllNurse();

  //       // 2. ดึงพยาบาลที่อยู่ในเวรนี้ (รวมเวลาปัจจุบันของเวร)
  //       const nursesInShift = await getNurseInShift(props.shift.id);
  //       // 3. filter พยาบาลที่ไม่อยู่ในเวรทับเวลาปัจจุบัน
  //       const options = allNurses
  //         .filter((n: any) => {
  //           const nurseShifts = nursesInShift.filter(
  //             (ns: any) => ns.user.id === n.id
  //           );

  //           // ถ้า nurse ไม่มีเวรทับเวลา → return true
  //           for (const ns of nurseShifts) {
  //             const shiftStart = new Date(`1970-01-01T${ns.shift.start_time}:00`);
  //             const shiftEnd = new Date(`1970-01-01T${ns.shift.end_time}:00`);

  //             const newShiftStart = new Date(
  //               `1970-01-01T${props.shift.start_time}:00`
  //             );
  //             const newShiftEnd = new Date(
  //               `1970-01-01T${props.shift.end_time}:00`
  //             );

  //             // เช็คเวลาทับ
  //             const overlap =
  //               newShiftStart < shiftEnd && newShiftEnd > shiftStart;

  //             if (overlap) return false; // ทับเวลาพยาบาลนี้แล้ว
  //           }

  //           return true;
  //         })
  //         .map((n: any) => ({
  //           id: n.id,
  //           label: n.name,
  //         }));

  //       setNurseOptions(options);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  const fetchAllNurse = async () => {
    try {
      const res = await getAllNurse();
      const options = res.map((nurse: any) => ({
        id: nurse.id,
        label: nurse.name, // หรือจะแสดง email ด้วยก็ได้ เช่น `${nurse.name} (${nurse.email})`
      }));
      setNurseOptions(options);
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchAllNurseOptions();
  }, [props.shift.id]);
  React.useEffect(() => {
    fetchAllNurse();
  }, []);
  const handleSubmit = React.useCallback(async () => {
    try {
      //   console.log("Selected nurses:", selectedNurses);
      //   console.log("shift:", props.shift);

      if (selectedNurses.length === 0) {
        alert("กรุณาเลือกพยาบาล");
        return;
      }

      // เรียก API
      const addAssignNurse = await addNurseToShift(
        props.shift.id,
        selectedNurses
      );

      console.log("Assign result:", addAssignNurse);

      // reset หรือปิด dialog
      setSelectedNurses([]);
      setOpen(false);
      props.onOpenChange?.(false);
    } catch (error) {
      console.error("Add nurse to shift error:", error);
    }
  }, [selectedNurses, props.shift, props.onOpenChange]);

  const handleReset = React.useCallback(() => {
    setSelectedNurses([]);
  }, []);

  // ฟังก์ชันลบพยาบาลที่เลือก
  const removeSelectedNurse = (nurseValue: string) => {
    setSelectedNurses((prev) => prev.filter((n) => n !== nurseValue));
  };

  // ได้รับข้อมูลพยาบาลที่เลือกแล้ว
  const selectedNurseData = nurseOptions.filter((nurse) =>
    selectedNurses.includes(nurse.id)
  );

  // กรองรายชื่อตามคำค้นหา
  const filteredNurses = nurseOptions.filter((nurse) => {
    const matchesSearch = nurse.label
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const notSelected = !selectedNurses.includes(nurse.id);
    return matchesSearch && notSelected;
  });

  return (
    <div className="p-4">
      <Dialog onOpenChange={props.onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline">เพิ่มพยาบาล</Button>
        </DialogTrigger>
        <DialogContent
          ref={ref}
          className="sm:max-w-[500px]"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>เพิ่มพยาบาลเข้าเวร</DialogTitle>
            <DialogDescription>
              กรุณาเลือกพยาบาลเพื่อเข้าทำงานตามเวรแต่ละเวลา
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                เลือกพยาบาล (เลือกได้หลายคน)
              </Label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    ค้นหาและเลือกพยาบาล
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="ค้นหารายชื่อพยาบาล..."
                      className="h-9"
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>ไม่พบรายชื่อพยาบาล</CommandEmpty>
                      <CommandGroup>
                        {filteredNurses.map((nurse) => (
                          <CommandItem
                            key={nurse.id}
                            value={nurse.id}
                            onSelect={() => {
                              setSelectedNurses((prev) => [...prev, nurse.id]);
                              setSearchQuery(""); // ล้างคำค้นหาหลังเลือก
                              setOpen(false);
                            }}
                          >
                            <Check className={`mr-2 h-4 w-4 opacity-0`} />
                            {nurse.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* แสดงพยาบาลที่เลือก */}
            {selectedNurses.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">พยาบาลที่เลือก:</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedNurseData.map((nurse) => (
                    <div
                      key={nurse.id}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{nurse.label}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedNurse(nurse.id)}
                        className="hover:bg-blue-200 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* แสดงข้อมูลที่เลือก */}
            {selectedNurses.length > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">สรุปข้อมูลที่เลือก:</h4>
                {selectedNurses.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-1">
                    จำนวนพยาบาล: {selectedNurses.length} คน
                  </p>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleReset}>
                ล้างข้อมูล
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  ยกเลิก
                </Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={selectedNurses.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                บันทึก
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

DialogAddNurse.displayName = "DialogAddNurse";
