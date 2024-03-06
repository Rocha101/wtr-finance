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
    {
      label: "Sair",
      logout: true,
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
              <MenubarTrigger onClick={item?.action} asChild={item.logout}>
                {item.logout ? <LogoutLink>Sign out</LogoutLink> : item.label}
              </MenubarTrigger>
            )}
          </MenubarMenu>
        );
      })}
    </Menubar>
  );
};

export default MainMenuComponent;
