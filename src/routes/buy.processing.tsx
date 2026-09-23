import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { OrderTimeline } from "@/components/pennypay/order-timeline";
import { StatusBadge } from "@/components/pennypay/status-badge";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatINR, formatUSDT } from "@/lib/pennypay/format";

export const Route = createFileRoute("/buy/processing")({
  head: () => ({
    meta: [
      { title: "Order processing — PENNY PAY" },
      { name: "description", content: "Track your PENNY PAY order while we verify payment and send your USDT." },
      { property: "og:title", content: "Order processing — PENNY PAY" },
      { property: "og:description", content: "Live status of your USDT order with PENNY PAY." },
    ],
  }),
  component: ProcessingPage,
});

function ProcessingPage() {
  const navigate = useNavigate();
  const { draft, hydrated, getOrder, advanceOrder } = usePennyPay();
  const order = draft.orderId ? getOrder(draft.orderId) : undefined;

  useEffect(() => {
    if (hydrated && !draft.orderId) navigate({ to: "/buy", replace: true });
  }, [hydrated, draft.orderId, navigate]);

  useEffect(() => {
    if (!order) return;
    const next = {
      payment_submitted: "payment_verification",
      payment_verification: "usdt_processing",
      usdt_processing: "usdt_sent",
      usdt_sent: "completed",
    } as const;
    const step = next[order.status as keyof typeof next];
    if (!step) return;
    const timer = setTimeout(() => advanceOrder(order.id, step), 3500);
    return () => clearTimeout(timer);
  }, [order, advanceOrder]);

  useEffect(() => {
    if (order?.status === "completed") {
      const timer = setTimeout(() => navigate({ to: "/buy/completed" }), 900);
      return () => clearTimeout(timer);
    }
    return;
  }, [order?.status, navigate]);

  if (!order) return <AppShell title="Order processing">{null}</AppShell>;

  return (
    <AppShell title="Order processing" description={`Order ${order.id}`}>
      <div className="max-w-[640px] space-y-5">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="tabular text-[13px] font-medium text-muted-foreground">{order.id}</p>
              <p className="tabular mt-1 text-[32px] font-bold leading-none tracking-tight">
                {formatUSDT(order.usdtAmount)} <span className="text-[18px] font-semibold">USDT</span>
              </p>
              <p className="tabular mt-2 text-[14px] text-muted-foreground">₹{formatINR(order.inrAmount)} paid</p>
            </div>
            <StatusBadge status={order.status} />
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-[18px] font-semibold">Order timeline</h2>
          <OrderTimeline order={order} />
        </section>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground">
            Most orders are completed within 6 hours. We'll notify you at each step.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="h-11">
            <Link to="/orders/$id" params={{ id: order.id }}>
              View Order
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
