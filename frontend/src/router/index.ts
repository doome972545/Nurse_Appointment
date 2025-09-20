import MainLayout from "@/layout/MainLayout";
import Login from "@/views/Login";
import type { AppRoute } from "@/type/types";
import DynamicHome from "@/components/DynamicHome";
import CheckShiftSchedule from "@/views/CheckShiftSchedule/CheckShiftSchedule";
import ViewLeave from "@/views/ViewLeave/ViewLeave";

export const routes = (_userRole: string): AppRoute[] => [
  {
    path: "/",
    name: "Main",
    component: MainLayout,
    meta: { requireAuth: true },
    children: [
      {
        path: "/",
        name: "จัดการเวรพยาบาล",
        component: DynamicHome,
        meta: {
          role: ["HEAD_NURSE"], // อนุญาตทั้ง 2 role
          isShow: true,
          requireAuth: true,
        },
      },

      {
        path: "/duty_schedule",
        name: "ตารางเวร",
        component: CheckShiftSchedule,
        meta: {
          role: ["NURSE"],
          isShow: true,
          requireAuth: true,
        },
      },
      {
        path: "/view/leave",
        name: "รายการขอลาหยุด",
        component: ViewLeave,
        meta: {
          role: ["HEAD_NURSE"],
          isShow: true,
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requireAuth: false },
  },
];
