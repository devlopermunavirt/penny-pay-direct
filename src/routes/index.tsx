import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { usePennyPay } from "@/lib/pennypay/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PENNY PAY — Buy USDT securely" },
      {
        name: "description",
        content: "PENNY PAY customer app. Buy USDT directly at a locked rate with simple bank payment.",
      },
      { property: "og:title", content: "PENNY PAY — Buy USDT securely" },
      {
        property: "og:description",
        content: "Sign in to buy USDT directly from PENNY PAY at a locked rate.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const { hydrated, isAuthenticated } = usePennyPay();

  useEffect(() => {
    if (!hydrated) return;
    navigate({ to: isAuthenticated ? "/dashboard" : "/login", replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  return <div className="min-h-screen bg-surface" />;
}
