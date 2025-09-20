// layout/MainLayout.tsx
import { Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const MainLayout = () => {
  const loading = useSelector((state: RootState) => state.app.loading);

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Loading open={loading} fullscreen />
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <ModeToggle />

          {/* <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* ส่วนนี้ Outlet จะ render component ของแต่ละ route */}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
