import MainMenuComponent from "@/components/main-menu";
import { ReactNode } from "react";
import { Toaster } from "sonner";

interface AdminLayoutProps {
  children: ReactNode[];
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div>
      <MainMenuComponent />
      {children}
      <Toaster />
    </div>
  );
};

export default AdminLayout;
