import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/api/auth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/slice/AuthSlice";
import Loading from "@/components/Loading";
import type { RootState } from "@/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loading = useSelector((state: RootState) => state.app.loading);
  const navigate = useNavigate(); // <-- hook สำหรับเปลี่ยนหน้า

  const dispatch = useDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      // Dispatch login action ไปยัง Redux store
      dispatch(
        login({
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          token: data.token,
        })
      );
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div>
      <Loading open={loading} fullscreen />
      <div className="h-screen flex flex-col gap-3 justify-center items-center bg-background">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 min-w-[24rem]">
          <div className="flex justify-center mb-4">
            <h1 className="text-2xl font-semibold">เข้าสู่ระบบ</h1>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <div className="flex flex-col gap-1">
              <Label>Email</Label>
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="mt-2">
              ลงชื่อเข้าใช้
            </Button>
          </form>
          <div className="flex justify-end">
            <Button variant="link" onClick={() => navigate("/register")}>
              ลงทะเบียน
            </Button>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 min-w-[24rem]">
          <h2 className="font-semibold">Admin: admin@gmail.com</h2>
          <h2 className="font-semibold">Nurse1: nurse1@gmail.com</h2>
          <h2 className="font-semibold">Nurse2: nurse2@gmail.com</h2>
          <h2 className="font-semibold">Nurse3: nurse3@gmail.com</h2>

          <h5 className="text-sm">Password: pass123</h5>
        </div>
      </div>
    </div>
  );
};

export default Login;
