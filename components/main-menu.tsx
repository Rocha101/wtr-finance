"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "./ui/button";

const MainMenuComponent = () => {
  const router = useRouter();
  const items = [
    {
      label: "Home",
      action: () => router.push("/admin"),
    },
    {
      label: "Transações",
      children: [
        {
          label: "Nova Despesa",
          action: () => router.push("/admin/transactions/new?type=expense"),
        },
        {
          label: "Novo Entrada",
          action: () => router.push("/admin/transactions/new?type=revenue"),
        },
      ],
    },
  ];

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
      <Button asChild variant="link" size="sm" className="absolute right-1">
        <LogoutLink>Sair</LogoutLink>
      </Button>
    </Menubar>
  );
};

export default MainMenuComponent;
