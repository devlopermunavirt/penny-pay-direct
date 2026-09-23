import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, type KycStatus, type OrderStatus } from "@/lib/pennypay/types";

const orderTone: Record<OrderStatus, string> = {
  created: "bg-accent text-accent-foreground",
  payment_submitted: "bg-accent text-accent-foreground",
  payment_verification: "bg-[#FDF6E7] text-warning",
  usdt_processing: "bg-[#FDF6E7] text-warning",
  usdt_sent: "bg-[#EAF6F0] text-success",
  completed: "bg-[#EAF6F0] text-success",
  cancelled: "bg-[#FBEDED] text-destructive",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium",
        orderTone[status],
        className,
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}

const kycTone: Record<KycStatus, { label: string; className: string }> = {
  not_started: { label: "KYC Required", className: "bg-muted text-muted-foreground" },
  pending: { label: "KYC Pending", className: "bg-[#FDF6E7] text-warning" },
  verified: { label: "KYC Verified", className: "bg-[#EAF6F0] text-success" },
  rejected: { label: "KYC Rejected", className: "bg-[#FBEDED] text-destructive" },
};

export function KycBadge({ status, className }: { status: KycStatus; className?: string }) {
  const tone = kycTone[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-[12px] font-medium",
        tone.className,
        className,
      )}
    >
      {tone.label}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
