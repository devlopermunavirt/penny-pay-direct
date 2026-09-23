import type { UseFormRegisterReturn } from "react-hook-form";

import { cn } from "@/lib/utils";

export function MobileField({
  label,
  error,
  registration,
}: {
  label: string;
  error?: string | null;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor="mobile" className="block text-[12px] font-medium text-muted-foreground">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center rounded-[10px] border border-border bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
          error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/15",
        )}
      >
        <span className="flex h-11 items-center border-r border-border px-3 text-[14px] font-medium text-muted-foreground">
          +91
        </span>
        <input
          id="mobile"
          inputMode="numeric"
          autoComplete="tel-national"
          maxLength={10}
          placeholder="98765 43210"
          className="tabular h-11 w-full bg-transparent px-3 text-[15px] font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground/70"
          {...registration}
        />
      </div>
      {error ? <p className="text-[12px] font-medium text-destructive">{error}</p> : null}
    </div>
  );
}
