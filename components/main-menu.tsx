"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@clerk/nextjs";

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
      label: "Visão Geral",
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
      label: "Categorias",
      action: () => router.push("/admin/categories"),
    },
    {
      label: "Recorrentes",
      action: () => router.push("/admin/recurrents"),
      disabled: true,
    },
  ];

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
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </Menubar>
  );
};

export default MainMenuComponent;
