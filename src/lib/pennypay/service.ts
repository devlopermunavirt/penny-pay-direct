import { BUY_RATE, DEMO_OTP } from "./config";
import type { Network, Order, OrderEvent, OrderStatus } from "./types";
import { ORDER_FLOW, ORDER_STATUS_LABEL } from "./types";

/**
 * Mock service layer. Every function mirrors a future Django REST endpoint
 * (see ENDPOINTS in config.ts) so swapping in fetch() calls is a one-file change.
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function requestOtp(mobile: string) {
  await delay(700);
  if (!/^\d{10}$/.test(mobile)) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }
  return { sent: true, expiresInSeconds: 30 };
}

export async function verifyOtp(code: string) {
  await delay(800);
  if (code !== DEMO_OTP) {
    throw new Error("That code isn't correct. Please try again.");
  }
  return { verified: true };
}

export async function getBuyRate() {
  await delay(200);
  return { rate: BUY_RATE, currency: "INR", asset: "USDT" };
}

export function buildTimeline(status: OrderStatus, createdAt: string): OrderEvent[] {
  const currentIndex = ORDER_FLOW.indexOf(status);
  const base = new Date(createdAt).getTime();
  return ORDER_FLOW.map((step, index) => ({
    status: step,
    label: ORDER_STATUS_LABEL[step],
    at: index <= currentIndex ? new Date(base + index * 12 * 60 * 1000).toISOString() : null,
  }));
}

let orderCounter = 10293;

export function nextOrderId() {
  const id = `PP-${orderCounter}`;
  orderCounter += 1;
  return id;
}

export async function createOrder(input: {
  inrAmount: number;
  usdtAmount: number;
  rate: number;
  walletAddress: string;
  network: Network;
}): Promise<Order> {
  await delay(600);
  const now = new Date().toISOString();
  return {
    id: nextOrderId(),
    type: "buy",
    status: "created",
    inrAmount: input.inrAmount,
    usdtAmount: input.usdtAmount,
    rate: input.rate,
    walletAddress: input.walletAddress,
    network: input.network,
    createdAt: now,
    updatedAt: now,
    timeline: buildTimeline("created", now),
  };
}

export async function submitReceipt(orderId: string, fileName: string) {
  await delay(900);
  return { orderId, receiptName: fileName, status: "payment_submitted" as OrderStatus };
}

export function mockTxid() {
  return "0x7f3ac9b21e4d8a5c06be1f9d27c4835ab0d61e7f94c2a8b35d1c70ef2a94b6d18";
}
