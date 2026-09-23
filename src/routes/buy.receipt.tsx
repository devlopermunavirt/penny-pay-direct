import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";

import { AppShell } from "@/components/pennypay/app-shell";
import { BuySteps } from "@/components/pennypay/buy-steps";
import { Button } from "@/components/ui/button";
import { usePennyPay } from "@/lib/pennypay/store";
import { submitReceipt } from "@/lib/pennypay/service";
import { formatINR } from "@/lib/pennypay/format";

export const Route = createFileRoute("/buy/receipt")({
  head: () => ({
    meta: [
      { title: "Upload payment receipt — PENNY PAY" },
      { name: "description", content: "Upload your bank transfer receipt so PENNY PAY can verify your payment." },
      { property: "og:title", content: "Upload payment receipt — PENNY PAY" },
      { property: "og:description", content: "Submit proof of payment for your USDT order." },
    ],
  }),
  component: ReceiptPage,
});

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "application/pdf"];

function ReceiptPage() {
  const navigate = useNavigate();
  const { draft, hydrated, setDraftReceipt, advanceOrder } = usePennyPay();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && !draft.orderId) navigate({ to: "/buy", replace: true });
  }, [hydrated, draft.orderId, navigate]);

  const accept = (incoming: File | undefined) => {
    if (!incoming) return;
    if (!ACCEPTED.includes(incoming.type)) {
      setError("Upload a JPG, PNG or PDF file.");
      return;
    }
    if (incoming.size > MAX_SIZE) {
      setError("File must be 10MB or smaller.");
      return;
    }
    setError(null);
    setFile(incoming);
    setPreview(incoming.type === "application/pdf" ? null : URL.createObjectURL(incoming));
  };

  const submit = async () => {
    if (!file || !draft.orderId) return;
    setSubmitting(true);
    await submitReceipt(draft.orderId, file.name);
    setDraftReceipt(file.name);
    advanceOrder(draft.orderId, "payment_submitted");
    setSubmitting(false);
    navigate({ to: "/buy/processing" });
  };

  return (
    <AppShell title="Upload payment receipt" description={`Order ${draft.orderId ?? ""}`}>
      <BuySteps current={4} />

      <div className="max-w-[640px] space-y-5">
        <section className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-muted-foreground">Amount paid</p>
            <p className="tabular text-[18px] font-semibold">₹{formatINR(draft.inrAmount)}</p>
          </div>
        </section>

        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              accept(e.dataTransfer.files[0]);
            }}
            className={
              dragging
                ? "rounded-xl border-2 border-dashed border-primary bg-accent px-6 py-12 text-center"
                : "rounded-xl border-2 border-dashed border-border bg-card px-6 py-12 text-center"
            }
          >
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-[15px] font-medium">Drag and drop your receipt here</p>
            <p className="mt-1 text-[13px] text-muted-foreground">JPG, PNG or PDF — up to 10MB</p>
            <Button variant="outline" className="mt-4 h-10" onClick={() => inputRef.current?.click()}>
              Choose file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(e) => accept(e.target.files?.[0])}
            />
          </div>
        ) : (
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="Receipt preview" className="h-16 w-16 rounded-[10px] object-cover" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-[10px] bg-surface">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{file.name}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Button variant="ghost" className="mt-3 h-9 text-[13px]" onClick={() => inputRef.current?.click()}>
              Replace file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              onChange={(e) => accept(e.target.files?.[0])}
            />
          </section>
        )}

        {error ? <p className="text-[13px] font-medium text-destructive">{error}</p> : null}

        <Button
          className="h-11 w-full font-semibold sm:w-auto sm:px-8"
          disabled={!file || submitting}
          onClick={() => void submit()}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Payment"}
        </Button>
      </div>
    </AppShell>
  );
}
