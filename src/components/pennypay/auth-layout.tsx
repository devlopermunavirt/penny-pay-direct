import type { ReactNode } from "react";
import { motion } from "motion/react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-[13px] font-bold text-primary-foreground">
              P
            </span>
            <span className="text-[15px] font-semibold tracking-tight">PENNY PAY</span>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(23,23,23,0.04)] sm:p-8">
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{subtitle}</p>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>

          {footer ? <div className="mt-5 text-center text-[13px] text-muted-foreground">{footer}</div> : null}
        </motion.div>
      </div>
    </div>
  );
}
