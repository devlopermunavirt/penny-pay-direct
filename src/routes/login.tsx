import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { AuthLayout } from "@/components/pennypay/auth-layout";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { requestOtp } from "@/lib/pennypay/service";
import { MobileField } from "@/components/pennypay/mobile-field";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PENNY PAY" },
      { name: "description", content: "Sign in to PENNY PAY with your mobile number and SMS verification code." },
      { property: "og:title", content: "Sign in — PENNY PAY" },
      { property: "og:description", content: "Sign in to PENNY PAY with your mobile number." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  mobile: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit mobile number."),
});

type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const navigate = useNavigate();
  const { setPendingMobile } = usePennyPay();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { mobile: "" },
  });

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
      title="Welcome back"
      subtitle="Enter your mobile number to continue."
      footer={
        <>
          New to PENNY PAY?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create an account
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
          {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
        </Button>

        <p className="text-center text-[13px] text-muted-foreground">
          You'll receive a verification code by SMS.
        </p>
      </form>
    </AuthLayout>
  );
}
