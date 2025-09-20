// middleware/LoginRedirectMiddleware.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "@/slice/AuthSlice";
import type { RootState } from "@/store";

const LoginRedirectMiddleware: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const encryptedUser = useSelector((state: RootState) => state.auth.user);
  const user = encryptedUser ? decryptData(encryptedUser) : null;
  console.log(user);
  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default LoginRedirectMiddleware;
