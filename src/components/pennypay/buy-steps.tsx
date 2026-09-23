import { cn } from "@/lib/utils";

const steps = ["Amount", "Recipient", "Review", "Payment", "Receipt"] as const;

export function BuySteps({ current }: { current: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-1 flex-col gap-2">
            <span
              className={cn(
                "h-1 rounded-full transition-colors",
                index <= current ? "bg-primary" : "bg-border",
              )}
            />
            <span
              className={cn(
                "hidden text-[11px] font-medium uppercase tracking-wide sm:block",
                index <= current ? "text-primary" : "text-muted-foreground",
              )}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[12px] font-medium text-muted-foreground sm:hidden">
        Step {current + 1} of {steps.length} — {steps[current]}
      </p>
    </div>
  );
}
