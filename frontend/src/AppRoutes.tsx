import { Route, Routes } from "react-router-dom";
import { routes } from "./router";
import type { AppRoute } from "./type/types";
import AuthMiddleware from "./middleware/AuthLoginMiddleware";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import { decryptData } from "./slice/AuthSlice";

const AppRoutes = () => {
  //   console.log("🚀 AppRoutes: Rendering routes");
  //   console.log(
  //     "📋 Available routes:",
  //     routes.map((r) => ({ path: r.path, requireAuth: r.meta?.requireAuth }))
  //   );
  const encryptedUser = useSelector((state: RootState) => state.auth.user);
  const user = encryptedUser ? decryptData(encryptedUser) : null;

  // ถ้า user ยัง null ให้ใช้ fallback role ""
  const userRole = user?.role ?? "";
  const routesToRender = routes(userRole); // เรียกฟังก์ชัน routes(userRole)

  const renderRoute = (route: AppRoute, index: number) => {
    const Component = route.component;
    const requireAuth = route.meta?.requireAuth ?? false;
    const allowedRoles = Array.isArray(route.meta?.role)
      ? route.meta.role
      : route.meta?.role
      ? [route.meta.role]
      : [];

    // console.log(`🔧 Rendering route ${route.path}:`, {
    //   requireAuth,
    //   allowedRoles,
    //   hasChildren: !!route.children,
    // });

    // ตรวจสอบเพิ่มเติมสำหรับ login route
    if (route.path === "/login") {
      //   console.log("🔑 Processing login route with middleware");
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <AuthMiddleware
              requireAuth={requireAuth}
              allowedRoles={allowedRoles}
            >
              <Component />
            </AuthMiddleware>
          }
        />
      );
    }

    if (route.children) {
      return (
        <Route
          key={index}
          path={route.path}
          element={
            <AuthMiddleware
              requireAuth={requireAuth}
              allowedRoles={allowedRoles}
            >
              <Component />
            </AuthMiddleware>
          }
        >
          {route.children.map((child, cidx) => {
            const ChildComp = child.component;
            const childRequireAuth = child.meta?.requireAuth ?? requireAuth;
            const childAllowedRoles = Array.isArray(child.meta?.role)
              ? child.meta.role
              : child.meta?.role
              ? [child.meta.role]
              : [];

            // console.log(`🔧 Rendering child route ${child.path}:`, {
            //   requireAuth: childRequireAuth,
            //   allowedRoles: childAllowedRoles,
            // });

            return (
              <Route
                key={cidx}
                path={child.path}
                element={
                  <AuthMiddleware
                    requireAuth={childRequireAuth}
                    allowedRoles={childAllowedRoles}
                  >
                    <ChildComp />
                  </AuthMiddleware>
                }
              />
            );
          })}
        </Route>
      );
    }

    return (
      <Route
        key={index}
        path={route.path}
        element={
          <AuthMiddleware requireAuth={requireAuth} allowedRoles={allowedRoles}>
            <Component />
          </AuthMiddleware>
        }
      />
    );
  };

  return (
    <Routes>
      {routesToRender.map((route, index) => renderRoute(route, index))}
    </Routes>
  );
};

export default AppRoutes;
