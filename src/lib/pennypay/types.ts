export type KycStatus = "not_started" | "pending" | "verified" | "rejected";

export type OrderStatus =
  | "created"
  | "payment_submitted"
  | "payment_verification"
  | "usdt_processing"
  | "usdt_sent"
  | "completed"
  | "cancelled";

export type Network = "TRC20" | "ERC20" | "BEP20";

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string | undefined;
  kycStatus: KycStatus;
  kycRejectionReason?: string | undefined;
  createdAt: string;
}

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  at: string | null;
}

export interface Order {
  id: string;
  type: "buy" | "sell";
  status: OrderStatus;
  inrAmount: number;
  usdtAmount: number;
  rate: number;
  network: Network;
  walletAddress: string;
  receiptName?: string | undefined;
  txid?: string | undefined;
  createdAt: string;
  updatedAt: string;
  timeline: OrderEvent[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  orderId?: string | undefined;
  read: boolean;
  createdAt: string;
}

export interface BuyDraft {
  inrAmount: number;
  usdtAmount: number;
  rate: number;
  walletAddress: string;
  network: Network;
  receiptName?: string | undefined;
  orderId?: string | undefined;
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  created: "Order Created",
  payment_submitted: "Payment Submitted",
  payment_verification: "Payment Verification",
  usdt_processing: "USDT Processing",
  usdt_sent: "USDT Sent",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const ORDER_FLOW: OrderStatus[] = [
  "created",
  "payment_submitted",
  "payment_verification",
  "usdt_processing",
  "usdt_sent",
  "completed",
];
