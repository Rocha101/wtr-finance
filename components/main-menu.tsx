"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Cookies from "js-cookie";

type ItemsT = {
  label: string;
  action?: () => void;
  children?: {
    label: string;
    action: () => void;
  }[];
}[];

const MainMenuComponent = () => {
  const router = useRouter();
  const items: ItemsT = [
    {
      label: "Home",
      action: () => router.push("/admin"),
    },
    {
      label: "Transações",
      action: () => router.push("/admin/transactions"),
    },
    {
      label: "Metas",
      action: () => router.push("/admin/goals"),
    },
    {
      label: "Orçamentos",
      action: () => router.push("/admin/budgets"),
    },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("userId");
    router.push("/sign-in");
  };

  return (
    <Menubar className="rounded-none">
      {items.map((item, index) => {
        return (
          <MenubarMenu key={index}>
            {item.children ? (
              <>
                <MenubarTrigger>{item.label}</MenubarTrigger>
                <MenubarContent>
                  {item.children.map((child, index) => (
                    <MenubarItem key={index} onClick={child.action}>
                      {child.label}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </>
            ) : (
              <MenubarTrigger onClick={item?.action}>
                {item.label}
              </MenubarTrigger>
            )}
          </MenubarMenu>
        );
      })}
      <Button
        variant="link"
        size="sm"
        className="absolute right-1"
        onClick={handleLogout}
      >
        Sair
      </Button>
    </Menubar>
  );
};

export default MainMenuComponent;
