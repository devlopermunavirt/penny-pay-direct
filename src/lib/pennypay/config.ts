/**
 * Static configuration for the PENNY PAY customer app.
 * Values here are served by the mock service layer today and will come from
 * the Django REST API (/api/v1/...) once the backend is connected.
 */
export const BUY_RATE = 103.0;

export const DEMO_OTP = "123456";

export const MIN_BUY_INR = 500;
export const MAX_BUY_INR = 500000;

export const BANK_ACCOUNT = {
  beneficiary: "PENNYBLACK LABS PRIVATE LIMITED",
  accountNumber: "50200078451236",
  ifsc: "HDFC0000123",
  bank: "HDFC Bank",
  branch: "Bengaluru — Koramangala",
};

export const SUPPORT_EMAIL = "support@pennypay.in";

export const API_BASE = "/api/v1";

/** Endpoint map kept in one place so the future REST integration is a swap. */
export const ENDPOINTS = {
  requestOtp: `${API_BASE}/auth/otp/request/`,
  verifyOtp: `${API_BASE}/auth/otp/verify/`,
  profile: `${API_BASE}/customers/me/`,
  kyc: `${API_BASE}/kyc/`,
  rate: `${API_BASE}/rates/buy/`,
  orders: `${API_BASE}/orders/`,
  order: (id: string) => `${API_BASE}/orders/${id}/`,
  receipt: (id: string) => `${API_BASE}/orders/${id}/receipt/`,
  notifications: `${API_BASE}/notifications/`,
} as const;
