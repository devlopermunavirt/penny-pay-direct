import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { BUY_RATE } from "./config";
import { buildTimeline, mockTxid } from "./service";
import type {
  AppNotification,
  BuyDraft,
  Customer,
  KycStatus,
  Network,
  Order,
  OrderStatus,
} from "./types";

const STORAGE_KEY = "pennypay.v2.state";

interface PennyPayState {
  customer: Customer | null;
  pendingMobile: string | null;
  orders: Order[];
  notifications: AppNotification[];
  draft: BuyDraft;
}

const emptyDraft: BuyDraft = {
  inrAmount: 0,
  usdtAmount: 0,
  rate: BUY_RATE,
  walletAddress: "",
  network: "TRC20",
};

const initialState: PennyPayState = {
  customer: null,
  pendingMobile: null,
  orders: [],
  notifications: [],
  draft: emptyDraft,
};

interface PennyPayContextValue extends PennyPayState {
  hydrated: boolean;
  rate: number;
  isAuthenticated: boolean;
  setPendingMobile: (mobile: string) => void;
  completeAuth: (mobile: string) => void;
  setKycStatus: (status: KycStatus, reason?: string) => void;
  updateProfile: (patch: Partial<Pick<Customer, "name" | "email">>) => void;
  signOut: () => void;
  setDraftAmounts: (inrAmount: number, usdtAmount: number) => void;
  setDraftRecipient: (walletAddress: string, network: Network) => void;
  setDraftReceipt: (fileName: string) => void;
  attachDraftOrder: (order: Order) => void;
  resetDraft: () => void;
  advanceOrder: (orderId: string, status: OrderStatus) => void;
  markNotificationsRead: () => void;
  getOrder: (orderId: string) => Order | undefined;
}

const PennyPayContext = createContext<PennyPayContextValue | null>(null);

function notify(title: string, body: string, orderId?: string): AppNotification {
  return {
    id: `ntf-${Math.random().toString(36).slice(2, 10)}`,
    title,
    body,
    orderId,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function PennyPayProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PennyPayState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as PennyPayState) });
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const setPendingMobile = useCallback((mobile: string) => {
    setState((s) => ({ ...s, pendingMobile: mobile }));
  }, []);

  const completeAuth = useCallback((mobile: string) => {
    setState((s) => ({
      ...s,
      pendingMobile: null,
      customer: s.customer?.mobile === mobile
        ? s.customer
        : {
            id: "cust_8241",
            name: "Munavir T",
            mobile,
            kycStatus: "not_started",
            createdAt: new Date().toISOString(),
          },
    }));
  }, []);

  const setKycStatus = useCallback((status: KycStatus, reason?: string) => {
    setState((s) =>
      s.customer
        ? {
            ...s,
            customer: { ...s.customer, kycStatus: status, kycRejectionReason: reason },
            notifications:
              status === "verified"
                ? [notify("Identity verified", "Your account is ready to buy USDT."), ...s.notifications]
                : s.notifications,
          }
        : s,
    );
  }, []);

  const updateProfile = useCallback((patch: Partial<Pick<Customer, "name" | "email">>) => {
    setState((s) => (s.customer ? { ...s, customer: { ...s.customer, ...patch } } : s));
  }, []);

  const signOut = useCallback(() => {
    setState((s) => ({ ...initialState, orders: s.orders, notifications: s.notifications }));
  }, []);

  const setDraftAmounts = useCallback((inrAmount: number, usdtAmount: number) => {
    setState((s) => ({ ...s, draft: { ...s.draft, inrAmount, usdtAmount, rate: BUY_RATE } }));
  }, []);

  const setDraftRecipient = useCallback((walletAddress: string, network: Network) => {
    setState((s) => ({ ...s, draft: { ...s.draft, walletAddress, network } }));
  }, []);

  const setDraftReceipt = useCallback((fileName: string) => {
    setState((s) => ({ ...s, draft: { ...s.draft, receiptName: fileName } }));
  }, []);

  const attachDraftOrder = useCallback((order: Order) => {
    setState((s) => ({
      ...s,
      draft: { ...s.draft, orderId: order.id },
      orders: [order, ...s.orders.filter((o) => o.id !== order.id)],
      notifications: [
        notify("Order created", `Order ${order.id} was created. Complete the payment to continue.`, order.id),
        ...s.notifications,
      ],
    }));
  }, []);

  const resetDraft = useCallback(() => {
    setState((s) => ({ ...s, draft: emptyDraft }));
  }, []);

  const advanceOrder = useCallback((orderId: string, status: OrderStatus) => {
    setState((s) => {
      const orders = s.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              txid: status === "usdt_sent" || status === "completed" ? order.txid ?? mockTxid() : order.txid,
              receiptName: order.receiptName ?? s.draft.receiptName,
              updatedAt: new Date().toISOString(),
              timeline: buildTimeline(status, order.createdAt),
            }
          : order,
      );
      const messages: Partial<Record<OrderStatus, string>> = {
        payment_submitted: "We received your payment receipt and started verification.",
        usdt_processing: "Payment verified. Your USDT transfer is being processed.",
        usdt_sent: "Your USDT has been sent to your wallet.",
        completed: "Order completed successfully.",
      };
      const body = messages[status];
      return {
        ...s,
        orders,
        notifications: body
          ? [notify(`Order ${orderId}`, body, orderId), ...s.notifications]
          : s.notifications,
      };
    });
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const getOrder = useCallback(
    (orderId: string) => state.orders.find((order) => order.id === orderId),
    [state.orders],
  );

  const value = useMemo<PennyPayContextValue>(
    () => ({
      ...state,
      hydrated,
      rate: BUY_RATE,
      isAuthenticated: Boolean(state.customer),
      setPendingMobile,
      completeAuth,
      setKycStatus,
      updateProfile,
      signOut,
      setDraftAmounts,
      setDraftRecipient,
      setDraftReceipt,
      attachDraftOrder,
      resetDraft,
      advanceOrder,
      markNotificationsRead,
      getOrder,
    }),
    [
      state,
      hydrated,
      setPendingMobile,
      completeAuth,
      setKycStatus,
      updateProfile,
      signOut,
      setDraftAmounts,
      setDraftRecipient,
      setDraftReceipt,
      attachDraftOrder,
      resetDraft,
      advanceOrder,
      markNotificationsRead,
      getOrder,
    ],
  );

  return <PennyPayContext.Provider value={value}>{children}</PennyPayContext.Provider>;
}

export function usePennyPay() {
  const ctx = useContext(PennyPayContext);
  if (!ctx) throw new Error("usePennyPay must be used inside PennyPayProvider");
  return ctx;
}
