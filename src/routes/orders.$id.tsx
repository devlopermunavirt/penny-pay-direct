import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, LifeBuoy } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { OrderTimeline } from "@/components/pennypay/order-timeline";
import { StatusBadge } from "@/components/pennypay/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatDateTime, formatINR, formatUSDT } from "@/lib/pennypay/format";

export const Route = createFileRoute("/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order details — PENNY PAY" },
      { name: "description", content: "Full details, timeline and payment receipt for your PENNY PAY order." },
      { property: "og:title", content: "Order details — PENNY PAY" },
      { property: "og:description", content: "Track the status of a single PENNY PAY USDT order." },
    ],
  }),
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { id } = Route.useParams();
  const { getOrder } = usePennyPay();
  const order = getOrder(id);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!order) {
    return (
      <AppShell title="Order not found">
        <div className="rounded-xl border border-border bg-card px-5 py-12 text-center">
          <p className="text-[15px] font-medium">We couldn't find order {id}</p>
          <Link to="/orders" className="mt-3 inline-block text-[14px] font-medium text-primary hover:underline">
            Back to orders
          </Link>
        </div>
      </AppShell>
    );
  }

  const rows = [
    { label: "Amount paid", value: `₹${formatINR(order.inrAmount)}` },
    { label: "USDT received", value: `${formatUSDT(order.usdtAmount)} USDT` },
    { label: "Buy rate", value: `₹${formatINR(order.rate)} per USDT` },
    { label: "Network", value: order.network },
    { label: "Recipient wallet", value: order.walletAddress, mono: true },
    { label: "Created", value: formatDateTime(order.createdAt) },
    ...(order.txid ? [{ label: "TXID", value: order.txid, mono: true }] : []),
  ];

  return (
    <AppShell
      title={order.id}
      description="Order details"
      action={<StatusBadge status={order.status} />}
    >
      <div className="grid max-w-[900px] gap-5 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-xl border border-border bg-card">
          <div className="px-5 py-4">
            <h2 className="text-[18px] font-semibold">Details</h2>
          </div>
          <dl className="divide-y divide-border border-t border-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <dt className="text-[14px] text-muted-foreground">{row.label}</dt>
                <dd
                  className={
                    row.mono
                      ? "break-all text-right font-mono text-[12px] font-medium"
                      : "tabular text-right text-[14px] font-medium"
                  }
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {order.receiptName ? (
            <div className="flex items-center gap-3 border-t border-border px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Payment receipt
                </p>
                <p className="truncate text-[14px] font-medium">{order.receiptName}</p>
              </div>
            </div>
          ) : null}
        </section>

        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-[18px] font-semibold">Timeline</h2>
            <OrderTimeline order={order} />
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2.5">
              <LifeBuoy className="h-[18px] w-[18px] text-muted-foreground" />
              <p className="text-[14px] font-medium">Need help with this order?</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-4 h-10 w-full">
                  Contact support
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Support — {order.id}</DialogTitle>
                  <DialogDescription>
                    Describe the issue and our team will reply on your registered mobile number.
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what happened..."
                  className="min-h-[120px]"
                />
                <DialogFooter>
                  <Button disabled={!message.trim() || sent} onClick={() => setSent(true)}>
                    {sent ? "Request sent" : "Send request"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
