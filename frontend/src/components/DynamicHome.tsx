import { useSelector } from "react-redux";
import { decryptData } from "@/slice/AuthSlice";
import Home from "@/views/Home";
import HomeNurse from "@/views/HomeNurse";
import type { RootState } from "@/store";
import Shift from "@/views/Shift/Shift";

const DynamicHome = () => {
  const encryptedUser = useSelector((state: RootState) => state.auth.user);
  const user = encryptedUser ? decryptData(encryptedUser) : null;

  if (!user) return null;
  // แสดง component ตาม role
  switch (user.role) {
    case "HEAD_NURSE":
      return <Shift />;
    case "NURSE":
      return <HomeNurse />;
    default:
      return <Home />; // default fallback
  }
};

export default DynamicHome;
