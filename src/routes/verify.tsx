import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

import { AuthLayout } from "@/components/pennypay/auth-layout";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { usePennyPay } from "@/lib/pennypay/store";
import { requestOtp, verifyOtp } from "@/lib/pennypay/service";
import { maskMobile } from "@/lib/pennypay/format";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify your number — PENNY PAY" },
      { name: "description", content: "Enter the 6-digit SMS code to verify your PENNY PAY mobile number." },
      { property: "og:title", content: "Verify your number — PENNY PAY" },
      { property: "og:description", content: "Confirm your mobile number with the SMS verification code." },
    ],
  }),
  component: VerifyPage,
});

type Status = "idle" | "loading" | "success" | "error" | "expired";

function VerifyPage() {
  const navigate = useNavigate();
  const { hydrated, pendingMobile, customer, completeAuth } = usePennyPay();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (hydrated && !pendingMobile) navigate({ to: "/login", replace: true });
  }, [hydrated, pendingMobile, navigate]);

  useEffect(() => {
    if (seconds <= 0) {
      setStatus((s) => (s === "idle" ? "expired" : s));
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const submit = async (value: string) => {
    setStatus("loading");
    setMessage(null);
    try {
      await verifyOtp(value);
      setStatus("success");
      const mobile = pendingMobile ?? "";
      completeAuth(mobile);
      setTimeout(() => {
        navigate({ to: customer?.kycStatus === "verified" ? "/dashboard" : "/kyc", replace: true });
      }, 700);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Verification failed.");
      setCode("");
    }
  };

  const resend = async () => {
    if (!pendingMobile) return;
    await requestOtp(pendingMobile);
    setSeconds(30);
    setStatus("idle");
    setMessage("A new code has been sent.");
  };

  return (
    <AuthLayout
      title="Verify your number"
      subtitle={`We've sent a 6-digit verification code to ${maskMobile(pendingMobile ?? "")}`}
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={(value) => {
              setCode(value);
              if (status === "error" || status === "expired") setStatus("idle");
              if (value.length === 6) void submit(value);
            }}
            disabled={status === "loading" || status === "success"}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="tabular h-12 w-11 rounded-[10px] border border-border text-[18px] font-semibold"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {status === "success" ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-[13px] font-medium text-success"
          >
            <CheckCircle2 className="h-4 w-4" /> Number verified
          </motion.p>
        ) : null}

        {status === "error" && message ? (
          <p className="flex items-center justify-center gap-2 text-[13px] font-medium text-destructive">
            <ShieldAlert className="h-4 w-4" /> {message}
          </p>
        ) : null}

        {status === "expired" ? (
          <p className="text-center text-[13px] font-medium text-warning">
            This code has expired. Request a new one.
          </p>
        ) : null}

        <Button
          className="h-11 w-full text-[14px] font-semibold"
          disabled={code.length !== 6 || status === "loading" || status === "success"}
          onClick={() => void submit(code)}
        >
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
        </Button>

        <div className="flex items-center justify-between text-[13px]">
          {seconds > 0 ? (
            <span className="tabular text-muted-foreground">
              Resend in 00:{String(seconds).padStart(2, "0")}
            </span>
          ) : (
            <button type="button" onClick={() => void resend()} className="font-medium text-primary hover:underline">
              Resend code
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Change mobile number
          </button>
        </div>

        <div className="rounded-[10px] bg-surface p-3 text-center text-[12px] text-muted-foreground">
          Never share your OTP with anyone. PENNY PAY will never ask for it.
        </div>
      </div>
    </AuthLayout>
  );
}
