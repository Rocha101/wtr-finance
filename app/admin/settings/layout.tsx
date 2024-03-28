import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode[];
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const links = [
    {
      label: "Geral",
      href: "/admin/settings",
    },
    {
      label: "Segurança",
      href: "/admin/settings/security",
    },
    {
      label: "Integracoes",
      href: "/admin/settings/integrations",
    },
    {
      label: "Suporte",
      href: "/admin/settings/support",
    },
    {
      label: "Avancado",
      href: "/admin/settings/advanced",
    },
  ];

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-6xl gap-2 pl-3">
        <h1 className="text-2xl font-semibold">Configuracoes</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          {links.map((link, index) => (
            <Link key={index} href={link.href} passHref>
              <Button
                variant="link"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
};

export default SettingsLayout;
