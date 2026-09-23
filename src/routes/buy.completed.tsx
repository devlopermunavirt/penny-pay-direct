import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

import { AppShell } from "@/components/pennypay/app-shell";
import { CopyField } from "@/components/pennypay/copy-field";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatINR, formatUSDT, shortAddress } from "@/lib/pennypay/format";

export const Route = createFileRoute("/buy/completed")({
  head: () => ({
    meta: [
      { title: "Order completed — PENNY PAY" },
      { name: "description", content: "Your USDT has been sent. View the transaction hash and order details." },
      { property: "og:title", content: "Order completed — PENNY PAY" },
      { property: "og:description", content: "Your PENNY PAY USDT order is complete." },
    ],
  }),
  component: CompletedPage,
});

function CompletedPage() {
  const navigate = useNavigate();
  const { draft, hydrated, getOrder, resetDraft } = usePennyPay();
  const order = draft.orderId ? getOrder(draft.orderId) : undefined;

  useEffect(() => {
    if (hydrated && !order) navigate({ to: "/orders", replace: true });
  }, [hydrated, order, navigate]);

  if (!order) return <AppShell title="Order completed">{null}</AppShell>;

  return (
    <AppShell title="Order completed" description={`Order ${order.id}`}>
      <div className="max-w-[640px] space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 text-center"
        >
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6F0]">
            <CheckCircle2 className="h-6 w-6 text-success" />
          </span>
          <h2 className="mt-4 text-[22px] font-semibold">Order Completed</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">Your USDT has been sent.</p>
          <p className="tabular mt-5 text-[36px] font-bold leading-none tracking-tight">
            {formatUSDT(order.usdtAmount)} <span className="text-[18px] font-semibold">USDT</span>
          </p>
          <p className="tabular mt-2 text-[14px] text-muted-foreground">Paid ₹{formatINR(order.inrAmount)}</p>
        </motion.section>

        <section className="rounded-xl border border-border bg-card px-5 py-1">
          <div className="divide-y divide-border">
            <CopyField label="Transaction hash (TXID)" value={order.txid ?? ""} mono />
            <CopyField label="Recipient wallet" value={shortAddress(order.walletAddress)} mono />
            <CopyField label="Network" value={order.network} />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="h-11 font-semibold">
            <Link to="/orders/$id" params={{ id: order.id }}>
              View Order
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11" onClick={() => resetDraft()}>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
