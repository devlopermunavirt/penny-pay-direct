import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { BuySteps } from "@/components/pennypay/buy-steps";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePennyPay } from "@/lib/pennypay/store";
import type { Network } from "@/lib/pennypay/types";
import { formatUSDT } from "@/lib/pennypay/format";

export const Route = createFileRoute("/buy/recipient")({
  head: () => ({
    meta: [
      { title: "Recipient wallet — PENNY PAY" },
      { name: "description", content: "Add the USDT wallet address and network where your purchase should be sent." },
      { property: "og:title", content: "Recipient wallet — PENNY PAY" },
      { property: "og:description", content: "Choose the wallet address and network for your USDT transfer." },
    ],
  }),
  component: RecipientPage,
});

const networks: { value: Network; label: string; note: string }[] = [
  { value: "TRC20", label: "TRC20", note: "Tron — lowest network fee" },
  { value: "ERC20", label: "ERC20", note: "Ethereum — higher network fee" },
  { value: "BEP20", label: "BEP20", note: "BNB Smart Chain" },
];

function RecipientPage() {
  const navigate = useNavigate();
  const { draft, setDraftRecipient, hydrated } = usePennyPay();
  const [address, setAddress] = useState(draft.walletAddress);
  const [network, setNetwork] = useState<Network>(draft.network);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (hydrated && !draft.inrAmount) navigate({ to: "/buy", replace: true });
  }, [hydrated, draft.inrAmount, navigate]);

  const trimmed = address.trim();
  const validAddress = trimmed.length >= 26 && !/\s/.test(trimmed);

  const proceed = () => {
    setDraftRecipient(trimmed, network);
    navigate({ to: "/buy/review" });
  };

  return (
    <AppShell title="Recipient details" description={`Where should we send ${formatUSDT(draft.usdtAmount)} USDT?`}>
      <BuySteps current={1} />

      <div className="max-w-[640px] space-y-5">
        <section className="rounded-xl border border-border bg-card p-6">
          <label htmlFor="wallet" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            USDT Wallet Address
          </label>
          <input
            id="wallet"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x... or T..."
            spellCheck={false}
            className="mt-2 h-12 w-full rounded-[10px] border border-border px-3 font-mono text-[14px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          {trimmed && !validAddress ? (
            <p className="mt-2 text-[13px] font-medium text-destructive">
              That address doesn't look valid. Please check and re-enter it.
            </p>
          ) : null}

          <p className="mt-6 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Network</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {networks.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setNetwork(item.value)}
                className={
                  network === item.value
                    ? "rounded-[10px] border border-primary bg-accent px-3 py-3 text-left"
                    : "rounded-[10px] border border-border px-3 py-3 text-left transition-colors hover:border-primary/40"
                }
              >
                <span className="block text-[14px] font-semibold">{item.label}</span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">{item.note}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-3 rounded-xl border border-border bg-[#FDF6E7] p-4">
          <TriangleAlert className="h-5 w-5 shrink-0 text-warning" />
          <p className="text-[13px] leading-relaxed text-warning">
            Transfers are irreversible. Make sure the address and network match your wallet — funds sent to a wrong
            address or network cannot be recovered.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
          <span className="text-[14px] leading-relaxed">
            I confirm the wallet address and network are correct.
          </span>
        </label>

        <Button
          className="h-11 w-full font-semibold sm:w-auto sm:px-8"
          disabled={!validAddress || !confirmed}
          onClick={proceed}
        >
          Continue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </AppShell>
  );
}
