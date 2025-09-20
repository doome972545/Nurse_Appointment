import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
import type { RootState } from "@/store";
import { registerUser } from "@/api/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state: RootState) => state.app.loading);
  const navigate = useNavigate(); // <-- hook สำหรับเปลี่ยนหน้า

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(name + " " + lastName, email, password);
      navigate("/login");
    } catch (error: any) {
      console.error("Register error:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-background">
      <Loading open={loading} fullscreen />
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 min-w-[24rem]">
        <div className="flex justify-center mb-4">
          <h1 className="text-2xl font-semibold">สมัครสมาชิก</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1">
              <Label>ชื่อ</Label>
              <Input
                placeholder="ชื่อ"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>นามสกุล</Label>
              <Input
                placeholder="นามสกุล"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="อีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="mt-2">
            สมัครสมาชิก
          </Button>
        </form>
        <div className="flex justify-end">
          <Button variant="link" onClick={() => navigate("/login")}>
            ลงชื่อเข้าใช้
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
