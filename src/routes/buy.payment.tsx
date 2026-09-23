import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Info } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { BuySteps } from "@/components/pennypay/buy-steps";
import { CopyField } from "@/components/pennypay/copy-field";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { BANK_ACCOUNT } from "@/lib/pennypay/config";
import { formatINR } from "@/lib/pennypay/format";

export const Route = createFileRoute("/buy/payment")({
  head: () => ({
    meta: [
      { title: "Payment instructions — PENNY PAY" },
      { name: "description", content: "Transfer the exact order amount to the PENNY PAY bank account to continue." },
      { property: "og:title", content: "Payment instructions — PENNY PAY" },
      { property: "og:description", content: "Bank transfer details for your PENNY PAY USDT order." },
    ],
  }),
  component: PaymentPage,
});

function PaymentPage() {
  const navigate = useNavigate();
  const { draft, hydrated } = usePennyPay();

  useEffect(() => {
    if (hydrated && !draft.orderId) navigate({ to: "/buy", replace: true });
  }, [hydrated, draft.orderId, navigate]);

  return (
    <AppShell title="Payment instructions" description={`Order ${draft.orderId ?? ""}`}>
      <BuySteps current={3} />

      <div className="max-w-[640px] space-y-5">
        <section className="rounded-xl border border-border bg-card p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Amount to pay</p>
          <p className="tabular mt-2 text-[36px] font-bold leading-none tracking-tight">
            ₹{formatINR(draft.inrAmount)}
          </p>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Transfer this exact amount from a bank account in your own name.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card px-5 py-1">
          <div className="divide-y divide-border">
            <CopyField label="Beneficiary" value={BANK_ACCOUNT.beneficiary} />
            <CopyField label="Account number" value={BANK_ACCOUNT.accountNumber} mono />
            <CopyField label="IFSC" value={BANK_ACCOUNT.ifsc} mono />
            <CopyField label="Bank" value={`${BANK_ACCOUNT.bank} — ${BANK_ACCOUNT.branch}`} />
            <CopyField label="Payment reference" value={draft.orderId ?? ""} mono />
          </div>
        </section>

        <div className="flex gap-3 rounded-xl border border-border bg-accent p-4">
          <Info className="h-5 w-5 shrink-0 text-accent-foreground" />
          <p className="text-[13px] leading-relaxed text-accent-foreground">
            Add your order ID as the payment reference. Payments from third-party accounts cannot be accepted.
          </p>
        </div>

        <Button
          className="h-11 w-full font-semibold sm:w-auto sm:px-8"
          onClick={() => navigate({ to: "/buy/receipt" })}
        >
          I've Made the Payment <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </AppShell>
  );
}
