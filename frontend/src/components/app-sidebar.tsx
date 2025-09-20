// AppSidebar.tsx
import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { VersionSwitcher } from "@/components/version-switcher";
import { routes } from "@/router";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { decryptData } from "@/slice/AuthSlice";
import { NavUser } from "./nav-user";
import { CalendarCheck } from "@/views/CheckShiftSchedule/_components/CalendarCheck";

// Mock role ของ user ปัจจุบัน

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const encryptedUser = useSelector((state: RootState) => state.auth.user);
  const user = encryptedUser ? decryptData(encryptedUser) : null;

  const data = {
    user: {
      name: user?.name ?? "ไม่ระบุ",
      email: user?.email ?? "no-email@example.com",
      avatar: "/avatar/shadcn.jpg",
    },
  };
  const sidebarRoutes = routes(user?.role ?? ""); // <-- แก้ตรงนี้

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]}
          defaultVersion="1.0.1"
        />
        {/* <SearchForm /> */}
      </SidebarHeader>

      <SidebarContent>
        {user?.role === "NURSE" && <CalendarCheck />}
        {sidebarRoutes
          .filter((r) => r.children) // เฉพาะ route ที่มี children
          .map((groupRoute) => (
            <SidebarGroup key={groupRoute.name}>
              <SidebarGroupLabel>{groupRoute.name}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupRoute
                    .children!.filter((child) => {
                      const roles = child.meta?.role;
                      if (!roles) return false;
                      if (Array.isArray(roles)) {
                        return roles.includes(user?.role || "");
                      }
                      return roles === user?.role;
                    })
                    .map((child) => (
                      <SidebarMenuItem key={child.name}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={child.path}
                            className={({ isActive }) =>
                              isActive ? "font-bold text-blue-600" : undefined
                            }
                          >
                            {child.name}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
