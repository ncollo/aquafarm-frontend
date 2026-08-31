/**
 * API Service — Aquafarm Fisheries
 * ──────────────────────────────────────
 * Full Integration with Express & Prisma Backend + Auth JWT Interceptor
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiResponse<T> = { data: T; success: boolean; message?: string };

async function simulateDelay(ms = 600): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Authenticated Fetch Wrapper
 * - Automatically injects JWT Bearer token from localStorage
 * - Intercepts 401 Unauthorized responses to trigger session invalidation
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("aquafarm-token");
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    console.warn("[API] 401 Unauthorized received. Dispathing auth:expired event.");
    window.dispatchEvent(new CustomEvent("auth:expired"));
  }

  return response;
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
  console.log("[API] Order placed:", payload);
  const orderId = `ORD-${Date.now()}`;
  return {
    success: true,
    data: { orderId, mpesaPrompt: payload.paymentMethod === "mpesa" },
    message: `Order ${orderId} placed successfully! ${payload.paymentMethod === "mpesa" ? "Check your phone for M-Pesa prompt." : ""}`,
  };
}

// ─── Dashboard Products & Inventory API ───────────────────────────────────────

export async function fetchProducts(): Promise<any[]> {
  try {
    const response = await authFetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching products:", error);
    return [];
  }
}

export async function createLiveProduct(formData: FormData): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/products`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create product");
    }
    const result = await response.json();
    logAuditEvent("Created Product", { name: formData.get("name"), category: formData.get("category") });
    return result;
  } catch (error) {
    console.error("[API] Error creating product:", error);
    throw error;
  }
}

export async function uploadBulkImportDocument(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("document", file);

    const response = await authFetch(`${API_BASE}/imports/bulk`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to process document");
    }
    const result = await response.json();
    logAuditEvent("Uploaded Bulk Import Document", { filename: file.name, size: file.size });
    return result;
  } catch (error) {
    console.error("[API] Error processing bulk import:", error);
    throw error;
  }
}

export async function updateLiveProduct(id: string, formData: FormData): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update product");
    }
    const result = await response.json();
    logAuditEvent("Updated Product", { productId: id, name: formData.get("name") });
    return result;
  } catch (error) {
    console.error("[API] Error updating product:", error);
    throw error;
  }
}

export async function deleteLiveProduct(id: string): Promise<void> {
  try {
    const response = await authFetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete product");
    }
    logAuditEvent("Deleted Product", { productId: id });
  } catch (error) {
    console.error("[API] Error deleting product:", error);
    throw error;
  }
}

// ─── Fish Batches & Stock API ─────────────────────────────────────────────────

export async function fetchFishBatches(): Promise<any[]> {
  try {
    const response = await authFetch(`${API_BASE}/stock/batches`);
    if (!response.ok) throw new Error("Failed to fetch fish batches");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching batches:", error);
    return [];
  }
}

export async function createFishBatch(payload: any): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/stock/batches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create batch");
    }
    const result = await response.json();
    logAuditEvent("Created Fish Batch", { batchCode: payload.batchCode, species: payload.species });
    return result;
  } catch (error) {
    console.error("[API] Error creating batch:", error);
    throw error;
  }
}

export async function deleteFishBatch(id: string): Promise<void> {
  try {
    const response = await authFetch(`${API_BASE}/stock/batches/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete batch");
    }
    logAuditEvent("Deleted Fish Batch", { batchId: id });
  } catch (error) {
    console.error("[API] Error deleting batch:", error);
    throw error;
  }
}

// ─── Sales Records API ────────────────────────────────────────────────────────

export async function fetchSalesRecords(): Promise<any[]> {
  try {
    const response = await authFetch(`${API_BASE}/sales`);
    if (!response.ok) throw new Error("Failed to fetch sales records");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching sales:", error);
    return [];
  }
}

export async function createSaleRecord(payload: any): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create sale");
    }
    const result = await response.json();
    logAuditEvent("Recorded New Sale", { orderNumber: result.orderNumber, amount: result.totalAmount, customer: payload.customerName });
    return result;
  } catch (error) {
    console.error("[API] Error creating sale:", error);
    throw error;
  }
}

export async function updateSaleRecord(id: string, payload: any): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/sales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update sale");
    }
    const result = await response.json();
    logAuditEvent("Updated Sale Status", { orderNumber: id, updates: payload });
    return result;
  } catch (error) {
    console.error("[API] Error updating sale:", error);
    throw error;
  }
}

export async function deleteSaleRecord(id: string): Promise<void> {
  try {
    const response = await authFetch(`${API_BASE}/sales/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete sale");
    }
    logAuditEvent("Deleted Sale (Restored Stock)", { orderNumber: id });
  } catch (error) {
    console.error("[API] Error deleting sale:", error);
    throw error;
  }
}

// ─── Phase 12: M-Pesa Payment Integration API ─────────────────────────────────

export async function initiateMpesaPayment(orderId: string, phoneNumber: string): Promise<{ checkoutRequestId: string; message: string; orderNumber: string }> {
  try {
    const response = await authFetch(`${API_BASE}/payments/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, phoneNumber }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to initiate M-Pesa STK Push");
    }

    const data = await response.json();
    logAuditEvent("Initiated M-Pesa STK Push", { orderId, phoneNumber, checkoutRequestId: data.checkoutRequestId });
    return data;
  } catch (error) {
    console.error("[API] Error initiating M-Pesa payment:", error);
    throw error;
  }
}

export async function checkPaymentStatus(checkoutRequestId: string): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/payments/status/${checkoutRequestId}`);
    if (!response.ok) throw new Error("Payment status check failed");
    return await response.json();
  } catch (error) {
    console.error("[API] Error checking payment status:", error);
    throw error;
  }
}

// ─── Phase 13: Dynamic Alerts & Audit Logging API ─────────────────────────────

export async function fetchAlerts(): Promise<any[]> {
  try {
    const response = await authFetch(`${API_BASE}/alerts`);
    if (!response.ok) throw new Error("Failed to fetch active alerts");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching alerts:", error);
    return [];
  }
}

export async function markAlertRead(id: string): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/alerts/${id}/read`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to mark alert as read");
    return await response.json();
  } catch (error) {
    console.error("[API] Error marking alert as read:", error);
    throw error;
  }
}

export async function triggerAlertScan(): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/alerts/scan`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to trigger alert scan");
    return await response.json();
  } catch (error) {
    console.error("[API] Error triggering alert scan:", error);
    throw error;
  }
}

export async function fetchAuditLogs(): Promise<any[]> {
  try {
    const response = await authFetch(`${API_BASE}/audit-logs`);
    if (!response.ok) throw new Error("Failed to fetch audit logs");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching audit logs:", error);
    return [];
  }
}

export async function logAuditEvent(action: string, details?: any): Promise<void> {
  try {
    const token = localStorage.getItem("aquafarm-token");
    if (!token) return; // Skip if unauthenticated

    await authFetch(`${API_BASE}/audit-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, details }),
    });
  } catch (err) {
    // Non-blocking: audit failure should not break user flow
    console.warn("[API] Failed to record audit log:", err);
  }
}

// ─── Suppliers CRM API ────────────────────────────────────────────────────────

export async function fetchSuppliers(): Promise<any[]> {
  try {
    const response = await authFetch(`${API_BASE}/suppliers`);
    if (!response.ok) throw new Error("Failed to fetch suppliers");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching suppliers:", error);
    return [];
  }
}

export async function createSupplier(payload: any): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/suppliers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create supplier");
    }
    const result = await response.json();
    logAuditEvent("Created Supplier", { name: payload.name, category: payload.category });
    return result;
  } catch (error) {
    console.error("[API] Error creating supplier:", error);
    throw error;
  }
}

export async function updateSupplier(id: string, payload: any): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/suppliers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update supplier");
    }
    const result = await response.json();
    logAuditEvent("Updated Supplier", { supplierId: id, name: payload.name });
    return result;
  } catch (error) {
    console.error("[API] Error updating supplier:", error);
    throw error;
  }
}

export async function deleteSupplier(id: string): Promise<void> {
  try {
    const response = await authFetch(`${API_BASE}/suppliers/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Failed to delete supplier");
    }
    logAuditEvent("Deleted Supplier", { supplierId: id });
  } catch (error) {
    console.error("[API] Error deleting supplier:", error);
    throw error;
  }
}

// ─── Analytics API ────────────────────────────────────────────────────────────

export async function fetchOverviewAnalytics(): Promise<any> {
  try {
    const response = await authFetch(`${API_BASE}/analytics/overview`);
    if (!response.ok) throw new Error("Failed to fetch analytics");
    return await response.json();
  } catch (error) {
    console.error("[API] Error fetching overview analytics:", error);
    return null;
  }
}

// ─── Reports & PDF Generation API ────────────────────────────────────────────

export async function downloadReportPdf(endpoint: string, defaultFilename = "aquafarm-report.pdf"): Promise<void> {
  try {
    const response = await authFetch(`${API_BASE}/reports/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to download report (${response.statusText})`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    logAuditEvent("Downloaded PDF Report", { report: endpoint });
  } catch (error) {
    console.error("[API] Error downloading PDF report:", error);
    throw error;
  }
}