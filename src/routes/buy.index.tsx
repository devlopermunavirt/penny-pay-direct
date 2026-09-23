import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { BuySteps } from "@/components/pennypay/buy-steps";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { formatINR, formatUSDT } from "@/lib/pennypay/format";
import { MAX_BUY_INR, MIN_BUY_INR } from "@/lib/pennypay/config";

export const Route = createFileRoute("/buy/")({
  head: () => ({
    meta: [
      { title: "Buy USDT — PENNY PAY" },
      { name: "description", content: "Enter an amount in INR or USDT and buy USDT directly from PENNY PAY." },
      { property: "og:title", content: "Buy USDT — PENNY PAY" },
      { property: "og:description", content: "Buy USDT at a locked rate with a simple bank transfer." },
    ],
  }),
  component: BuyAmountPage,
});

function BuyAmountPage() {
  const navigate = useNavigate();
  const { rate, draft, setDraftAmounts, customer } = usePennyPay();
  const [inr, setInr] = useState(draft.inrAmount ? String(draft.inrAmount) : "");
  const [usdt, setUsdt] = useState(draft.usdtAmount ? draft.usdtAmount.toFixed(2) : "");

  const inrValue = Number(inr.replace(/[^\d.]/g, "")) || 0;
  const usdtValue = Number(usdt.replace(/[^\d.]/g, "")) || 0;

  const onInr = (value: string) => {
    setInr(value);
    const amount = Number(value.replace(/[^\d.]/g, "")) || 0;
    setUsdt(amount ? (amount / rate).toFixed(2) : "");
  };

  const onUsdt = (value: string) => {
    setUsdt(value);
    const amount = Number(value.replace(/[^\d.]/g, "")) || 0;
    setInr(amount ? (amount * rate).toFixed(0) : "");
  };

  const tooLow = inrValue > 0 && inrValue < MIN_BUY_INR;
  const tooHigh = inrValue > MAX_BUY_INR;
  const kycBlocked = customer?.kycStatus !== "verified";
  const valid = inrValue >= MIN_BUY_INR && !tooHigh;

  const proceed = () => {
    setDraftAmounts(Math.round(inrValue), usdtValue);
    navigate({ to: "/buy/recipient" });
  };

  return (
    <AppShell title="Buy USDT" description="Enter the amount you want to buy.">
      <BuySteps current={0} />

      {kycBlocked ? (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-accent px-5 py-4">
          <p className="text-[14px] font-medium text-accent-foreground">
            Complete identity verification before placing an order.
          </p>
          <Button asChild size="sm" className="h-9">
            <Link to="/kyc">Verify now</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="inr" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                You pay
              </label>
              <div className="mt-2 flex h-14 items-center rounded-[10px] border border-border px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <span className="mr-2 text-[18px] font-semibold text-muted-foreground">₹</span>
                <input
                  id="inr"
                  inputMode="decimal"
                  placeholder="0"
                  value={inr}
                  onChange={(e) => onInr(e.target.value)}
                  className="tabular w-full bg-transparent text-[24px] font-semibold outline-none"
                />
                <span className="text-[13px] font-medium text-muted-foreground">INR</span>
              </div>
            </div>

            <div>
              <label htmlFor="usdt" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                You receive
              </label>
              <div className="mt-2 flex h-14 items-center rounded-[10px] border border-border px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
                <input
                  id="usdt"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={usdt}
                  onChange={(e) => onUsdt(e.target.value)}
                  className="tabular w-full bg-transparent text-[24px] font-semibold outline-none"
                />
                <span className="text-[13px] font-medium text-muted-foreground">USDT</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[5000, 10000, 25000, 50000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => onInr(String(amount))}
                  className="tabular rounded-[10px] border border-border px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  ₹{formatINR(amount, 0)}
                </button>
              ))}
            </div>

            {tooLow ? (
              <p className="text-[13px] font-medium text-destructive">
                Minimum order is ₹{formatINR(MIN_BUY_INR, 0)}.
              </p>
            ) : null}
            {tooHigh ? (
              <p className="text-[13px] font-medium text-destructive">
                Maximum order is ₹{formatINR(MAX_BUY_INR, 0)}. Contact support for larger orders.
              </p>
            ) : null}

            <Button className="h-11 w-full font-semibold" disabled={!valid || kycBlocked} onClick={proceed}>
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Current Buy Rate
          </p>
          <p className="tabular mt-2 text-[32px] font-bold leading-none tracking-tight text-primary">
            ₹{formatINR(rate)}
          </p>
          <p className="mt-2 text-[14px] text-muted-foreground">per USDT</p>

          <dl className="mt-6 space-y-3 border-t border-border pt-4 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">You pay</dt>
              <dd className="tabular font-medium">₹{formatINR(inrValue)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">You receive</dt>
              <dd className="tabular font-medium">{formatUSDT(usdtValue)} USDT</dd>
            </div>
          </dl>
          <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
            The rate is locked when your order is created and stays fixed until the order completes.
          </p>
        </aside>
      </div>
    </AppShell>
  );
}
