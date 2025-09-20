import React from "react";

type LoadingProps = {
  open?: boolean; // เปิด/ปิดการใช้งาน
  fullscreen?: boolean; // true = ครอบทั้งหน้าจอ, false = ครอบ parent div
  text?: string; // ข้อความแสดงขณะโหลด
};

const Loading: React.FC<LoadingProps> = ({
  open = false,
  fullscreen = false,
  text,
}) => {
  if (!open) return null; // ปิด = ไม่ render อะไรเลย

  return (
    <div
      className={`flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-[999]
        ${fullscreen ? "fixed inset-0" : "absolute inset-0"}`}
    >
      <div className="flex items-center gap-2">
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-8 h-8 border-4 border-primary rounded-full animate-spin"
        />
        {text && <p className="ml-2">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
