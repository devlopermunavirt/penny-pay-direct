import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatDateTime } from "@/lib/pennypay/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — PENNY PAY" },
      { name: "description", content: "Order status updates and account alerts from PENNY PAY." },
      { property: "og:title", content: "Notifications — PENNY PAY" },
      { property: "og:description", content: "Stay updated on every step of your USDT orders." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, markNotificationsRead } = usePennyPay();

  useEffect(() => {
    const timer = setTimeout(markNotificationsRead, 800);
    return () => clearTimeout(timer);
  }, [markNotificationsRead]);

  return (
    <AppShell title="Notifications" description="Updates about your orders and account.">
      {notifications.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-5 py-12 text-center">
          <Bell className="mx-auto h-7 w-7 text-muted-foreground" />
          <p className="mt-3 text-[15px] font-medium">You're all caught up</p>
          <p className="mt-1 text-[14px] text-muted-foreground">Order updates will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notifications.map((item) => {
            const body = (
              <div
                className={cn(
                  "rounded-xl border bg-card px-5 py-4 transition-colors",
                  item.read ? "border-border" : "border-primary/30 bg-accent/40",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-[14px] font-semibold">{item.title}</p>
                  <span className="tabular shrink-0 text-[12px] text-muted-foreground">
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-[14px] text-muted-foreground">{item.body}</p>
              </div>
            );
            return (
              <li key={item.id}>
                {item.orderId ? (
                  <Link to="/orders/$id" params={{ id: item.orderId }}>
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
