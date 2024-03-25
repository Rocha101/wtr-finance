"use client";

import MainMenuComponent from "@/components/main-menu";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode[];
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="h-screen ">
      <MainMenuComponent />
      <div className="pt-3">{children}</div>
    </div>
  );
};

export default AdminLayout;
