import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock, FileCheck2, Loader2, Lock, ShieldCheck, XCircle } from "lucide-react";
import { motion } from "motion/react";

import { AuthLayout } from "@/components/pennypay/auth-layout";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";

export const Route = createFileRoute("/kyc")({
  head: () => ({
    meta: [
      { title: "Identity verification — PENNY PAY" },
      { name: "description", content: "Complete your one-time PENNY PAY identity verification to start buying USDT." },
      { property: "og:title", content: "Identity verification — PENNY PAY" },
      { property: "og:description", content: "One-time identity verification for your PENNY PAY account." },
    ],
  }),
  component: KycPage,
});

function KycPage() {
  const navigate = useNavigate();
  const { hydrated, isAuthenticated, customer, setKycStatus } = usePennyPay();
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) navigate({ to: "/login", replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated || !customer) return <div className="min-h-screen bg-surface" />;

  const status = customer.kycStatus;

  const startVerification = () => {
    setWorking(true);
    setKycStatus("pending");
    setTimeout(() => {
      setKycStatus("verified");
      setWorking(false);
    }, 2500);
  };

  if (status === "pending") {
    return (
      <AuthLayout title="Verification in progress" subtitle="We're reviewing your details.">
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-[10px] bg-surface p-4">
            <Clock className="h-5 w-5 text-warning" />
            <p className="text-[14px] text-muted-foreground">
              Most verifications are completed within a few minutes.
            </p>
          </div>
          <Button variant="outline" className="h-11 w-full" onClick={() => navigate({ to: "/dashboard" })}>
            Back to Dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (status === "verified") {
    return (
      <AuthLayout title="Identity verified" subtitle="Your account is ready.">
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 rounded-[10px] bg-[#EAF6F0] p-4"
          >
            <CheckCircle2 className="h-5 w-5 text-success" />
            <p className="text-[14px] font-medium text-success">You can now buy USDT.</p>
          </motion.div>
          <Button className="h-11 w-full font-semibold" onClick={() => navigate({ to: "/dashboard" })}>
            Continue to Dashboard
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (status === "rejected") {
    return (
      <AuthLayout title="Couldn't complete verification" subtitle="Please review the reason and try again.">
        <div className="space-y-6">
          <div className="flex gap-3 rounded-[10px] bg-[#FBEDED] p-4">
            <XCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p className="text-[14px] text-destructive">
              {customer.kycRejectionReason ?? "The document image was unclear and could not be read."}
            </p>
          </div>
          <Button className="h-11 w-full font-semibold" onClick={startVerification}>
            Retry Verification
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your identity"
      subtitle="A one-time check keeps your account and transfers secure."
    >
      <div className="space-y-6">
        <ul className="space-y-4">
          {[
            { icon: ShieldCheck, title: "Secure verification", body: "Your documents are encrypted end to end." },
            { icon: FileCheck2, title: "One-time verification", body: "Complete it once — all future orders are instant." },
            { icon: Lock, title: "Protected information", body: "We never share your details with third parties." },
          ].map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent">
                <item.icon className="h-[18px] w-[18px] text-accent-foreground" />
              </span>
              <div>
                <p className="text-[14px] font-medium">{item.title}</p>
                <p className="text-[13px] text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <Button className="h-11 w-full font-semibold" onClick={startVerification} disabled={working}>
          {working ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Verification"}
        </Button>

        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="w-full text-center text-[13px] font-medium text-muted-foreground hover:text-foreground"
        >
          I'll do this later
        </button>
      </div>
    </AuthLayout>
  );
}
