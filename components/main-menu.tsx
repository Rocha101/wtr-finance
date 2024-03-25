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
import { ModeToggle } from "./mode-toggle";

type ItemsT = {
  label: string;
  action?: () => void;
  disabled?: boolean;
  children?: {
    label: string;
    action: () => void;
    disabled?: boolean;
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
      children: [
        {
          label: "Orçamentos",
          action: () => router.push("/admin/budgets"),
        },
        {
          label: "Categorias",
          action: () => router.push("/admin/categories"),
        },
      ],
    },
    {
      label: "Recorrentes",
      action: () => router.push("/admin/recurrents"),
      disabled: true,
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
                <MenubarTrigger disabled={item?.disabled}>
                  {item.label}
                </MenubarTrigger>
                <MenubarContent>
                  {item.children.map((child, index) => (
                    <MenubarItem
                      key={index}
                      onClick={child.action}
                      disabled={child?.disabled}
                    >
                      {child.label}
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </>
            ) : (
              <MenubarTrigger onClick={item?.action} disabled={item?.disabled}>
                {item.label}
              </MenubarTrigger>
            )}
          </MenubarMenu>
        );
      })}
      <div className="flex items-center gap-3 absolute right-1">
        <ModeToggle />
        <Button variant="link" size="sm" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </Menubar>
  );
};

export default MainMenuComponent;
