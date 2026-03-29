import { NavLink, useLocation } from "react-router-dom";
import { Package, Wrench, FileText, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Painel", icon: LayoutDashboard },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/servicos", label: "Serviços", icon: Wrench },
  { to: "/orcamentos", label: "Orçamentos", icon: FileText },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <FileText className="h-6 w-6 text-sidebar-primary" />
          <span className="font-display text-lg font-bold text-sidebar-foreground">
            OrcamentoFly
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
