import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { StatusBadge } from "@/components/pennypay/status-badge";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatDate, formatINR, formatUSDT } from "@/lib/pennypay/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Orders — PENNY PAY" },
      { name: "description", content: "Search and track every USDT order you've placed with PENNY PAY." },
      { property: "og:title", content: "Orders — PENNY PAY" },
      { property: "og:description", content: "Your full PENNY PAY order history and statuses." },
    ],
  }),
  component: OrdersPage,
});

const filters = ["all", "buy", "sell"] as const;

function OrdersPage() {
  const { orders } = usePennyPay();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const visible = orders.filter(
    (order) =>
      (filter === "all" || order.type === filter) &&
      order.id.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <AppShell title="Orders" description="Every order you've placed with PENNY PAY.">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 min-w-[220px] flex-1 items-center rounded-[10px] border border-border bg-card px-3 focus-within:border-primary">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID"
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "h-11 rounded-[10px] border px-4 text-[14px] font-medium capitalize transition-colors",
                  filter === item
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-5 py-12 text-center">
            <p className="text-[15px] font-medium">No orders found</p>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {orders.length === 0 ? "Buy USDT to create your first order." : "Try a different search or filter."}
            </p>
            <Link to="/buy" className="mt-4 inline-block text-[14px] font-medium text-primary hover:underline">
              Buy USDT
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((order) => (
              <li key={order.id}>
                <Link
                  to="/orders/$id"
                  params={{ id: order.id }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-primary/40"
                >
                  <div>
                    <p className="tabular text-[14px] font-medium">{order.id}</p>
                    <p className="mt-0.5 text-[13px] capitalize text-muted-foreground">
                      {order.type} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="tabular text-[14px] font-semibold">{formatUSDT(order.usdtAmount)} USDT</p>
                      <p className="tabular mt-0.5 text-[13px] text-muted-foreground">
                        ₹{formatINR(order.inrAmount)}
                      </p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
