import { useEffect } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Receipt,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { usePennyPay } from "@/lib/pennypay/store";
import { Pill } from "@/components/pennypay/status-badge";

const menu = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Buy USDT", to: "/buy", icon: ArrowDownToLine },
  { label: "Sell USDT", to: "/dashboard", icon: ArrowUpRight, soon: true },
  { label: "Orders", to: "/orders", icon: Receipt },
] as const;

const account = [
  { label: "Profile", to: "/profile", icon: User },
  { label: "Support", to: "/profile", icon: LifeBuoy },
] as const;

const mobileNav = [
  { label: "Home", to: "/dashboard", icon: LayoutDashboard },
  { label: "Buy", to: "/buy", icon: ArrowDownToLine },
  { label: "Orders", to: "/orders", icon: Receipt },
  { label: "Profile", to: "/profile", icon: User },
] as const;

function useActive() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => (to === "/dashboard" ? pathname === to : pathname.startsWith(to));
}

export function AppShell({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const navigate = useNavigate();
  const { hydrated, isAuthenticated, signOut, notifications } = usePennyPay();
  const isActive = useActive();
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (hydrated && !isAuthenticated) navigate({ to: "/login", replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated || !isAuthenticated) {
    return <div className="min-h-screen bg-surface" />;
  }

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-border bg-sidebar px-4 py-6 lg:flex">
        <div className="flex items-center gap-2.5 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
            P
          </span>
          <span className="text-[15px] font-semibold tracking-tight">PENNY PAY</span>
        </div>

        <nav className="mt-8 flex flex-1 flex-col">
          <p className="px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
          <ul className="mt-2 space-y-1">
            {menu.map((item) => (
              <li key={item.label}>
                {item.soon ? (
                  <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-muted-foreground">
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                    <Pill className="ml-auto">Soon</Pill>
                  </span>
                ) : (
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                      isActive(item.to)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-foreground hover:bg-surface",
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-8 px-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Account
          </p>
          <ul className="mt-2 space-y-1">
            {account.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition-colors",
                    isActive(item.to)
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-foreground hover:bg-surface",
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-foreground transition-colors hover:bg-surface"
              >
                <LogOut className="h-[18px] w-[18px]" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
          <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
            <div className="min-w-0">
              <h1 className="truncate text-[22px] font-semibold tracking-tight lg:text-[28px]">{title}</h1>
              {description ? (
                <p className="mt-1 truncate text-[14px] text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              {action}
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Bell className="h-[18px] w-[18px]" />
                {unread > 0 ? (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                ) : null}
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[960px] flex-1 px-5 pb-28 pt-6 lg:px-8 lg:pb-16">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background lg:hidden">
        <ul className="grid grid-cols-4">
          {mobileNav.map((item) => (
            <li key={item.label}>
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive(item.to) ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-[20px] w-[20px]" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
