import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/pennypay/format";
import { ORDER_FLOW, ORDER_STATUS_LABEL, type Order } from "@/lib/pennypay/types";

export function OrderTimeline({ order }: { order: Order }) {
  const currentIndex = ORDER_FLOW.indexOf(order.status);

  return (
    <ol className="relative space-y-6 pl-8">
      <span className="absolute left-[11px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {ORDER_FLOW.map((step, index) => {
        const done = index < currentIndex || order.status === "completed";
        const active = index === currentIndex && order.status !== "completed";
        return (
          <li key={step} className="relative">
            <span
              className={cn(
                "absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full border",
                done && "border-success bg-success text-success-foreground",
                active && "border-primary bg-primary text-primary-foreground",
                !done && !active && "border-border bg-background",
              )}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" />
              ) : active ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="h-3.5 w-3.5" />
                </motion.span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
              )}
            </span>
            <p
              className={cn(
                "text-[14px] font-medium",
                !done && !active && "text-muted-foreground",
                active && "text-primary",
              )}
            >
              {ORDER_STATUS_LABEL[step]}
            </p>
            <p className="tabular mt-0.5 text-[12px] text-muted-foreground">
              {order.timeline[index]?.at ? formatDateTime(order.timeline[index]!.at) : "Pending"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
