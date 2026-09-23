import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { BuySteps } from "@/components/pennypay/buy-steps";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { createOrder } from "@/lib/pennypay/service";
import { formatINR, formatUSDT, shortAddress } from "@/lib/pennypay/format";

export const Route = createFileRoute("/buy/review")({
  head: () => ({
    meta: [
      { title: "Review your order — PENNY PAY" },
      { name: "description", content: "Review the amount, locked rate, recipient wallet and network before confirming." },
      { property: "og:title", content: "Review your order — PENNY PAY" },
      { property: "og:description", content: "Confirm your USDT order details before payment." },
    ],
  }),
  component: ReviewPage,
});

function ReviewPage() {
  const navigate = useNavigate();
  const { draft, hydrated, attachDraftOrder } = usePennyPay();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && (!draft.inrAmount || !draft.walletAddress)) navigate({ to: "/buy", replace: true });
  }, [hydrated, draft.inrAmount, draft.walletAddress, navigate]);

  const confirm = async () => {
    setSubmitting(true);
    const order = await createOrder({
      inrAmount: draft.inrAmount,
      usdtAmount: draft.usdtAmount,
      rate: draft.rate,
      walletAddress: draft.walletAddress,
      network: draft.network,
    });
    attachDraftOrder(order);
    setSubmitting(false);
    navigate({ to: "/buy/payment" });
  };

  const rows = [
    { label: "You pay", value: `₹${formatINR(draft.inrAmount)}`, strong: true },
    { label: "You receive", value: `${formatUSDT(draft.usdtAmount)} USDT`, strong: true },
    { label: "Buy rate (locked)", value: `₹${formatINR(draft.rate)} per USDT` },
    { label: "Recipient wallet", value: shortAddress(draft.walletAddress), mono: true },
    { label: "Network", value: draft.network },
    { label: "Payment method", value: "Bank transfer (IMPS / NEFT / RTGS)" },
  ];

  return (
    <AppShell title="Review order" description="Check the details before you confirm.">
      <BuySteps current={2} />

      <div className="max-w-[640px] space-y-5">
        <section className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-[18px] font-semibold">Order summary</h2>
            <Link to="/buy" className="text-[13px] font-medium text-primary hover:underline">
              Edit
            </Link>
          </div>
          <dl className="divide-y divide-border border-t border-border">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <dt className="text-[14px] text-muted-foreground">{row.label}</dt>
                <dd
                  className={
                    row.strong
                      ? "tabular text-[16px] font-semibold"
                      : row.mono
                        ? "font-mono text-[13px] font-medium"
                        : "tabular text-[14px] font-medium"
                  }
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Your rate is locked at ₹{formatINR(draft.rate)} per USDT for this order. Payment instructions appear on the
          next step.
        </p>

        <Button className="h-11 w-full font-semibold sm:w-auto sm:px-8" disabled={submitting} onClick={() => void confirm()}>
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Confirm &amp; Continue <ArrowRight className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </AppShell>
  );
}
