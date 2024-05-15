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
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GrMenu } from "react-icons/gr";
import { Button } from "./ui/button";

type ItemsT = {
  label: string;
  href: string;
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
      href: "/admin",
    },
    {
      label: "Transações",
      href: "/admin/transactions",
    },
    {
      label: "Metas",
      href: "/admin/goals",
    },
    {
      label: "Categorias",
      href: "/admin/categories",
    },
    /*  {
      label: "Recorrentes",
      disabled: true,
      href: "/admin/recurrents",
    },
    {
      label: "Configurações",
      href: "/admin/settings",
      disabled: true,
    }, */
  ];

  return (
    <header className="w-full sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
      <nav className="w-full hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        {items.map((item, index) => {
          if (item.disabled) {
            return (
              <Button
                key={index}
                variant="link"
                disabled={item.disabled}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Button>
            );
          }
          return (
            <Link key={index} href={item.href} passHref>
              <Button
                variant="link"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <GrMenu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-6 text-lg font-medium items-start">
            {items.map((item, index) => {
              return (
                <Link key={index} href={item.href} passHref>
                  <Button
                    variant="link"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
};

export default MainMenuComponent;
