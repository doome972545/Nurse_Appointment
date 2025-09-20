import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { store, type RootState } from "@/store";
import { decryptData, logout } from "@/slice/AuthSlice";
import { jwtDecode } from "jwt-decode";

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({
  children,
  requireAuth = false,
  allowedRoles = [],
}) => {
  // เพิ่มการ debug ที่ชัดเจนมากขึ้น
  //   console.log("🔍 AuthMiddleware: Component rendered");

  const location = useLocation();
  const encryptedUser = useSelector((state: RootState) => state.auth.user);

  //   console.log("📍 Current path:", location.pathname);
  //   console.log("🔐 RequireAuth:", requireAuth);
  //   console.log(
  //     "📦 EncryptedUser from store:",
  //     encryptedUser ? "exists" : "null"
  //   );
  //   console.log("📦 EncryptedUser value:", encryptedUser);

  // Decrypt user data
  let user = null;
  try {
    user = encryptedUser ? decryptData(encryptedUser) : null;
    // console.log(
    //   "👤 Decrypted user:",
    //   user ? `${user.name} (${user.role})` : "null"
    // );
  } catch (error) {
    console.error("❌ Error decrypting user:", error);
    user = null;
  }

  const isAuthenticated = !!user;
  //   console.log("✅ IsAuthenticated:", isAuthenticated);
  //   console.log("🎭 Allowed roles:", allowedRoles);

  // ถ้าเป็นหน้า login และ user ล็อกอินแล้ว ให้ redirect ไปหน้าหลัก
  if (location.pathname === "/login" && isAuthenticated) {
    if (user?.role === "HEAD_NURSE") {
      return <Navigate to="/" replace />;
    }
    if (user?.role === "NURSE") {
      return <Navigate to="/duty_schedule" replace />;
    }
  }
  if (location.pathname === "/register" && isAuthenticated) {
    if (user?.role === "HEAD_NURSE") {
      return <Navigate to="/" replace />;
    }
    if (user?.role === "NURSE") {
      return <Navigate to="/duty_schedule" replace />;
    }
  }

  // ถ้าเป็นหน้า login และไม่ต้อง authentication ให้แสดงหน้า login ปกติ
  if (location.pathname === "/login" && !requireAuth) {
    // console.log("🖥️ Showing login page (no auth required)");
    return <>{children}</>;
  }
  const token = user?.token;
  if (token) {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        store.dispatch(logout());
        return <Navigate to="/login" replace />;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      store.dispatch(logout());
      return <Navigate to="/login" replace />;
    }
  }
  // ถ้าต้องการ authentication แต่ยังไม่ได้ล็อกอิน
  if (requireAuth && !isAuthenticated) {
    // console.log("🔄 Redirecting unauthenticated user to login");
    return <Navigate to="/login" replace />;
  }

  // ตรวจสอบ role permissions (เฉพาะเมื่อ authenticated แล้ว)
  if (requireAuth && isAuthenticated && allowedRoles.length > 0 && user) {
    const hasPermission = allowedRoles.includes(user.role);
    // console.log(
    //   "🔒 Role check - User role:",
    //   user.role,
    //   "Has permission:",
    //   hasPermission
    // );

    if (!hasPermission) {
      //   console.log("🚫 Access denied - redirecting to home");
      if (user.role === "NURSE") {
        return <Navigate to="/duty_schedule" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  //   console.log("✨ Rendering protected content");
  return <>{children}</>;
};

export default AuthMiddleware;
