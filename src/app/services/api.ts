/**
 * Mock API Service — Aquafarm Fisheries
 * ──────────────────────────────────────
 * Simulates an Express.js backend with realistic latency.
 * In production, replace each function's body with a real fetch() call to your API.
 *
 * Base URL would be: https://api.aquafarmfisheries.co.ke/v1
 */

const BASE_URL = "https://api.aquafarmfisheries.co.ke/v1"; // production endpoint placeholder

type ApiResponse<T> = { data: T; success: boolean; message?: string };

async function simulateDelay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactForm(
  payload: ContactPayload
): Promise<ApiResponse<{ ticketId: string }>> {
  await simulateDelay(800);
  // In production: return fetch(`${BASE_URL}/contact`, { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json());
  console.log("[API] Contact form submitted:", payload);
  return {
    success: true,
    data: { ticketId: `TKT-${Date.now()}` },
    message: "Your message has been received. We will get back to you within 24 hours.",
  };
}

// ─── Visit Booking ────────────────────────────────────────────────────────────
export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  date: string;
  groupType: "school" | "individual" | "cooperative" | "corporate";
  groupSize: number;
  notes?: string;
}

export async function submitVisitBooking(
  payload: BookingPayload
): Promise<ApiResponse<{ bookingRef: string }>> {
  await simulateDelay(900);
  // In production: return fetch(`${BASE_URL}/bookings`, { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json());
  console.log("[API] Visit booking submitted:", payload);
  const ref = `BK-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;
  return {
    success: true,
    data: { bookingRef: ref },
    message: `Booking confirmed! Your reference number is ${ref}. We will send a confirmation email shortly.`,
  };
}

// ─── Store / Cart ─────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  name: string;
  qty: number;
  priceKes: number;
}

export interface OrderPayload {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress?: string;
  items: CartItem[];
  totalKes: number;
  paymentMethod: "mpesa" | "card" | "cash";
}

export async function placeOrder(
  payload: OrderPayload
): Promise<ApiResponse<{ orderId: string; mpesaPrompt?: boolean }>> {
  await simulateDelay(1100);
  // In production: return fetch(`${BASE_URL}/orders`, { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json());
  console.log("[API] Order placed:", payload);
  const orderId = `ORD-${Date.now()}`;
  return {
    success: true,
    data: { orderId, mpesaPrompt: payload.paymentMethod === "mpesa" },
    message: `Order ${orderId} placed successfully! ${payload.paymentMethod === "mpesa" ? "Check your phone for M-Pesa prompt." : ""}`,
  };
}

// ─── Dashboard Data ───────────────────────────────────────────────────────────
export async function getDashboardStats(): Promise<
  ApiResponse<{
    totalRevenueMonth: number;
    fishSoldKg: number;
    activePonds: number;
    pendingOrders: number;
    revenueGrowth: number;
    salesGrowth: number;
  }>
> {
  await simulateDelay(500);
  // In production: return fetch(`${BASE_URL}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
  return {
    success: true,
    data: {
      totalRevenueMonth: 540000,
      fishSoldKg: 1680,
      activePonds: 31,
      pendingOrders: 7,
      revenueGrowth: 12.4,
      salesGrowth: 8.2,
    },
  };
}

export async function getFishStock(): Promise<ApiResponse<any[]>> {
  await simulateDelay(500);
  // In production: return fetch(`${BASE_URL}/stock`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
  return {
    success: true,
    data: [
      { id: "TS-001", species: "Nile Tilapia", pondCount: 12, totalKg: 8400, avgWeight: "450g", status: "Excellent", healthStatus: "Healthy", daysToHarvest: 18 },
      { id: "CS-001", species: "African Catfish", pondCount: 8, totalKg: 5600, avgWeight: "720g", status: "Good", healthStatus: "Healthy", daysToHarvest: 25 },
      { id: "RT-001", species: "Rainbow Trout", pondCount: 4, totalKg: 2100, avgWeight: "580g", status: "Monitor", healthStatus: "Under Watch", daysToHarvest: 35 },
    ],
  };
}

export async function getSalesRecords(): Promise<ApiResponse<any[]>> {
  await simulateDelay(600);
  // In production: return fetch(`${BASE_URL}/sales`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
  return { success: true, data: [] };
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
export async function subscribeNewsletter(
  email: string
): Promise<ApiResponse<null>> {
  await simulateDelay(700);
  // In production: return fetch(`${BASE_URL}/newsletter/subscribe`, { method: 'POST', body: JSON.stringify({ email }) }).then(r => r.json());
  console.log("[API] Newsletter subscription:", email);
  return { success: true, data: null, message: "Successfully subscribed to the newsletter!" };
}

// ─── Job Application ──────────────────────────────────────────────────────────
export interface JobApplicationPayload {
  name: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  cvUrl?: string;
}

export async function submitJobApplication(
  payload: JobApplicationPayload
): Promise<ApiResponse<{ applicationId: string }>> {
  await simulateDelay(1000);
  // In production: return fetch(`${BASE_URL}/careers/apply`, { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json());
  console.log("[API] Job application:", payload);
  return {
    success: true,
    data: { applicationId: `APP-${Date.now()}` },
    message: "Application received! We will review and contact you within 5 business days.",
  };
}
