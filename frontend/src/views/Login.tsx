import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/api/auth";
import { useDispatch } from "react-redux";
import { login } from "@/slice/AuthSlice";

const Login = () => {
  const [email, setEmail] = useState("nurse@gmail.com");
  const [password, setPassword] = useState("pass123");

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
      <div className="h-screen flex justify-center items-center bg-background">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
