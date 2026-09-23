import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/pennypay/auth-layout";
import { MobileField } from "@/components/pennypay/mobile-field";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { requestOtp } from "@/lib/pennypay/service";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — PENNY PAY" },
      { name: "description", content: "Create your PENNY PAY account with your mobile number to start buying USDT." },
      { property: "og:title", content: "Create account — PENNY PAY" },
      { property: "og:description", content: "Create your PENNY PAY account in under a minute." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),
});

type FormValues = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const { setPendingMobile } = usePennyPay();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { mobile: "" } });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await requestOtp(values.mobile);
      setPendingMobile(values.mobile);
      navigate({ to: "/verify" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <AuthLayout
      title="Create your PENNY PAY account"
      subtitle="We verify every account with your mobile number."
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(onSubmit)(e); }} className="space-y-5">
        <MobileField
          label="Mobile Number"
          error={form.formState.errors.mobile?.message ?? error}
          registration={form.register("mobile")}
        />

        <Button type="submit" className="h-11 w-full text-[14px] font-semibold" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
        </Button>

        <p className="text-center text-[13px] leading-relaxed text-muted-foreground">
          By continuing, you agree to the applicable Terms &amp; Conditions and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}
