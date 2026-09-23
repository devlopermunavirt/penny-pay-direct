import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

import { AppShell } from "@/components/pennypay/app-shell";
import { KycBadge, Pill, StatusBadge } from "@/components/pennypay/status-badge";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatDate, formatINR, formatUSDT } from "@/lib/pennypay/format";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PENNY PAY" },
      { name: "description", content: "Your PENNY PAY dashboard: current buy rate, quick calculator and recent orders." },
      { property: "og:title", content: "Dashboard — PENNY PAY" },
      { property: "og:description", content: "Check the current USDT buy rate and track your recent orders." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { customer, orders, rate } = usePennyPay();
  const [inr, setInr] = useState("10300");

  const inrValue = Number(inr.replace(/[^\d.]/g, "")) || 0;
  const usdtValue = inrValue / rate;

  return (
    <AppShell title={`Hello, ${customer?.name ?? "there"}`} description="Here's your account at a glance.">
      <div className="space-y-5">
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Account</p>
            <p className="tabular mt-1 text-[15px] font-medium">+91 {customer?.mobile}</p>
          </div>
          <div className="flex items-center gap-3">
            <KycBadge status={customer?.kycStatus ?? "not_started"} />
            {customer?.kycStatus !== "verified" ? (
              <Link to="/kyc" className="text-[13px] font-medium text-primary hover:underline">
                Complete KYC
              </Link>
            ) : null}
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Current Buy Rate
            </p>
            <p className="tabular mt-2 text-[40px] font-bold leading-none tracking-tight text-primary">
              ₹{formatINR(rate)}
            </p>
            <p className="mt-2 text-[14px] text-muted-foreground">per USDT</p>

            <div className="mt-6 rounded-[10px] bg-surface p-4">
              <label htmlFor="calc" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Quick calculator
              </label>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-11 flex-1 items-center rounded-[10px] border border-border bg-card px-3">
                  <span className="mr-2 text-[14px] font-medium text-muted-foreground">₹</span>
                  <input
                    id="calc"
                    inputMode="decimal"
                    value={inr}
                    onChange={(e) => setInr(e.target.value)}
                    className="tabular w-full bg-transparent text-[15px] font-semibold outline-none"
                  />
                </div>
                <span className="text-[13px] text-muted-foreground">=</span>
                <div className="flex h-11 flex-1 items-center justify-between rounded-[10px] border border-border bg-card px-3">
                  <span className="tabular text-[15px] font-semibold">{formatUSDT(usdtValue)}</span>
                  <span className="text-[12px] font-medium text-muted-foreground">USDT</span>
                </div>
              </div>
            </div>

            <Button asChild className="mt-5 h-11 w-full font-semibold">
              <Link to="/buy">
                Buy USDT <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-[12px] text-muted-foreground">
              Rate will be locked when your order is created.
            </p>
          </motion.section>

          <div className="space-y-5">
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-surface">
                    <ArrowUpRight className="h-[18px] w-[18px] text-muted-foreground" />
                  </span>
                  <p className="text-[18px] font-semibold">Sell USDT</p>
                </div>
                <Pill>Coming Soon</Pill>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                Sell USDT directly to PENNY PAY. Available in a future release.
              </p>
              <Button variant="outline" disabled className="mt-5 h-11 w-full">
                Coming Soon
              </Button>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-[18px] w-[18px] text-success" />
                <p className="text-[14px] font-medium">Direct service, no marketplace</p>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                You always deal directly with PENNY PAY. No counterparties, no order books.
              </p>
            </section>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-[18px] font-semibold">Recent Orders</h2>
            <Link to="/orders" className="text-[13px] font-medium text-primary hover:underline">
              View All
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="border-t border-border px-5 py-8 text-center text-[14px] text-muted-foreground">
              No orders yet. Your first USDT purchase will appear here.
            </p>
          ) : (
            <ul className="divide-y divide-border border-t border-border">
              {orders.slice(0, 4).map((order) => (
                <li key={order.id}>
                  <Link
                    to="/orders/$id"
                    params={{ id: order.id }}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface"
                  >
                    <div>
                      <p className="tabular text-[14px] font-medium">{order.id}</p>
                      <p className="mt-0.5 text-[13px] text-muted-foreground">{formatDate(order.createdAt)}</p>
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
        </section>
      </div>
    </AppShell>
  );
}
