import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, LifeBuoy, LogOut, Mail, Shield, Smartphone } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { KycBadge } from "@/components/pennypay/status-badge";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { SUPPORT_EMAIL } from "@/lib/pennypay/config";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PENNY PAY" },
      { name: "description", content: "Manage your PENNY PAY account details, verification status and support." },
      { property: "og:title", content: "Profile — PENNY PAY" },
      { property: "og:description", content: "Your PENNY PAY account and security settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { customer, signOut } = usePennyPay();

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <AppShell title="Profile" description="Your account and support options.">
      <div className="max-w-[640px] space-y-5">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[16px] font-semibold text-accent-foreground">
              {(customer?.name ?? "P").slice(0, 1)}
            </span>
            <div>
              <p className="text-[18px] font-semibold">{customer?.name}</p>
              <p className="tabular mt-0.5 text-[14px] text-muted-foreground">+91 {customer?.mobile}</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-[14px] text-muted-foreground">Verification</span>
            <div className="flex items-center gap-3">
              <KycBadge status={customer?.kycStatus ?? "not_started"} />
              {customer?.kycStatus !== "verified" ? (
                <Link to="/kyc" className="text-[13px] font-medium text-primary hover:underline">
                  Verify
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card">
          <p className="px-5 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Personal information
          </p>
          <dl className="mt-1 divide-y divide-border">
            <div className="flex items-center gap-3 px-5 py-3.5">
              <Smartphone className="h-[18px] w-[18px] text-muted-foreground" />
              <dt className="flex-1 text-[14px] text-muted-foreground">Mobile number</dt>
              <dd className="tabular text-[14px] font-medium">+91 {customer?.mobile}</dd>
            </div>
            <div className="flex items-center gap-3 px-5 py-3.5">
              <Mail className="h-[18px] w-[18px] text-muted-foreground" />
              <dt className="flex-1 text-[14px] text-muted-foreground">Email</dt>
              <dd className="text-[14px] font-medium">{customer?.email ?? "Not added"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card">
          <p className="px-5 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Security &amp; support
          </p>
          <ul className="mt-1 divide-y divide-border">
            <li className="flex items-center gap-3 px-5 py-3.5">
              <Shield className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="flex-1 text-[14px]">Login is protected by SMS verification</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li className="flex items-center gap-3 px-5 py-3.5">
              <LifeBuoy className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="flex-1 text-[14px]">Help centre</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[13px] font-medium text-primary hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </li>
          </ul>
        </section>

        <Button variant="outline" className="h-11 w-full text-destructive sm:w-auto sm:px-8" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </AppShell>
  );
}
