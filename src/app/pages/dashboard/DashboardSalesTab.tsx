import React, { useState, useEffect, useRef } from "react";
import {
  Plus, Search, Filter, Edit, DollarSign, Package, Truck, Star,
  X, CheckCircle2, AlertCircle, RefreshCw, Trash2, Smartphone, ShieldAlert,
  Clock, ArrowRight, Check
} from "lucide-react";
import {
  fetchSalesRecords, createSaleRecord, fetchProducts,
  updateSaleRecord, deleteSaleRecord, initiateMpesaPayment,
  checkPaymentStatus, logAuditEvent
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const DashboardSalesChart = React.lazy(() => import("./DashboardSalesChart"));

interface DashboardSalesTabProps {
  isDark: boolean;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  textSub: string;
  divideColor: string;
  tableHover: string;
}

export default function DashboardSalesTab({
  isDark, cardBg, cardBorder, textPrimary, textMuted, textSub, divideColor, tableHover
}: DashboardSalesTabProps) {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole(["ADMIN", "admin"]);

  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [activeModal, setActiveModal] = useState<"none" | "create" | "edit" | "delete" | "mpesa_status">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeSaleId, setActiveSaleId] = useState<string | null>(null);

  // Form State
  const [createFormData, setCreateFormData] = useState({
    customerName: "",
    orderType: "RETAIL",
    productId: "",
    quantity: "",
    paymentMethod: "MPESA" as "CASH" | "MPESA",
    phoneNumber: "",
  });

  const [editFormData, setEditFormData] = useState({
    customerName: "",
    status: "COMPLETED",
  });

  // M-Pesa Polling State
  const [mpesaState, setMpesaState] = useState<{
    checkoutRequestId: string | null;
    orderNumber: string | null;
    amount: number;
    phone: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    mpesaReceipt?: string;
    pollSeconds: number;
  }>({
    checkoutRequestId: null,
    orderNumber: null,
    amount: 0,
    phone: "",
    status: "PENDING",
    pollSeconds: 45,
  });

  const pollingRef = useRef<any>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [salesData, productsData] = await Promise.all([
        fetchSalesRecords(),
        fetchProducts(),
      ]);
      setSales(salesData);
      setProducts(productsData.filter((p: any) => p.stock > 0));
    } catch (error) {
      console.error("Failed to load sales data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Poll M-Pesa transaction status
  const startMpesaPolling = (checkoutRequestId: string, orderNumber: string, amount: number, phone: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);

    setMpesaState({
      checkoutRequestId,
      orderNumber,
      amount,
      phone,
      status: "PENDING",
      pollSeconds: 45,
    });
    setActiveModal("mpesa_status");

    let secondsLeft = 45;

    pollingRef.current = setInterval(async () => {
      secondsLeft -= 2;
      setMpesaState((prev) => ({ ...prev, pollSeconds: Math.max(0, secondsLeft) }));

      try {
        const result = await checkPaymentStatus(checkoutRequestId);
        if (result && result.status === "SUCCESS") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setMpesaState((prev) => ({
            ...prev,
            status: "SUCCESS",
            mpesaReceipt: result.mpesaReceipt || "CONFIRMED",
          }));
          loadData();
        } else if (result && result.status === "FAILED") {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setMpesaState((prev) => ({ ...prev, status: "FAILED" }));
        }
      } catch (err) {
        console.warn("Polling status query:", err);
      }

      if (secondsLeft <= 0) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        setMpesaState((prev) => (prev.status === "PENDING" ? { ...prev, status: "FAILED" } : prev));
      }
    }, 2000);
  };

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const selectedProduct = products.find((p) => p.id === createFormData.productId);
      if (!selectedProduct) throw new Error("Please select a valid product.");

      const qty = parseFloat(createFormData.quantity);
      if (isNaN(qty) || qty <= 0) throw new Error("Please enter a valid quantity.");

      const totalAmount = qty * selectedProduct.price;

      const payload = {
        customerName: createFormData.customerName || "Walk-in Customer",
        orderType: createFormData.orderType,
        items: [
          {
            productId: selectedProduct.id,
            quantity: qty,
            price: selectedProduct.price,
          },
        ],
      };

      const newSale = await createSaleRecord(payload);

      if (createFormData.paymentMethod === "MPESA") {
        const phone = createFormData.phoneNumber.trim();
        if (!phone) throw new Error("Please provide a phone number for M-Pesa STK Push.");

        // Initiate Daraja STK push
        const stkRes = await initiateMpesaPayment(newSale.orderNumber || newSale.id, phone);
        setIsSubmitting(false);
        setActiveModal("none");
        startMpesaPolling(stkRes.checkoutRequestId, newSale.orderNumber, totalAmount, phone);
      } else {
        setFeedback({ type: "success", message: `Sale #${newSale.orderNumber} recorded successfully with Cash!` });
        setTimeout(() => {
          setActiveModal("none");
          loadData();
          setCreateFormData({
            customerName: "",
            orderType: "RETAIL",
            productId: "",
            quantity: "",
            paymentMethod: "MPESA",
            phoneNumber: "",
          });
        }, 1200);
      }
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to process sale." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerRowMpesa = async (sale: any) => {
    const phone = prompt(`Enter customer Safaricom Phone Number for order ${sale.id}:`, "0712345678");
    if (!phone) return;

    try {
      setIsLoading(true);
      const stkRes = await initiateMpesaPayment(sale.id, phone);
      const numericAmount = parseInt(sale.amount.replace(/[^0-9]/g, ""), 10) || 0;
      startMpesaPolling(stkRes.checkoutRequestId, sale.id, numericAmount, phone);
    } catch (err: any) {
      alert(err.message || "Failed to initiate M-Pesa push");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSaleId) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await updateSaleRecord(activeSaleId, editFormData);
      setFeedback({ type: "success", message: "Sale updated successfully!" });
      setTimeout(() => {
        setActiveModal("none");
        loadData();
      }, 1200);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to update sale" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSale = async () => {
    if (!activeSaleId) return;
    if (!isAdmin) {
      alert("Access Denied: Only ADMINs can delete transaction records.");
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteSaleRecord(activeSaleId);
      setActiveModal("none");
      loadData();
    } catch (error: any) {
      alert(error.message || "Failed to delete sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (sale: any) => {
    setActiveSaleId(sale.id);
    setEditFormData({ customerName: sale.customer, status: sale.status });
    setActiveModal("edit");
  };

  const openDeleteModal = (id: string) => {
    if (!isAdmin) {
      alert("Permission Restricted: Only Administrators can permanently remove sales transactions.");
      return;
    }
    setActiveSaleId(id);
    setActiveModal("delete");
  };

  const filteredSales = sales.filter(
    (s) =>
      s.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sales.reduce(
    (sum, sale) => sum + (parseInt(String(sale.amount).replace(/[^0-9]/g, ""), 10) || 0),
    0
  );
  const pendingOrders = sales.filter((s) => s.status === "PENDING").length;
  const customerFreq = sales.reduce((acc, sale) => {
    acc[sale.customer] = (acc[sale.customer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCustomer = Object.keys(customerFreq).sort((a, b) => customerFreq[b] - customerFreq[a])[0] || "None yet";

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`font-bold text-xl ${textPrimary}`}>Sales Management & POS</h2>
            <span className="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <Smartphone size={12} /> M-Pesa Integrated
            </span>
          </div>
          <p className={`text-sm ${textMuted}`}>Live transactions, Daraja STK Push & inventory reconciliation</p>
        </div>
        <button
          onClick={() => {
            setActiveModal("create");
            setFeedback(null);
          }}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-sm"
        >
          <Plus size={15} /> Record New Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-teal-500 to-teal-700" },
          { label: "Total Orders", value: `${sales.length} orders`, icon: Package, color: "from-blue-500 to-blue-700" },
          { label: "Pending Verification", value: `${pendingOrders} orders`, icon: Truck, color: "from-amber-500 to-amber-700" },
          { label: "Top Customer", value: topCustomer, icon: Star, color: "from-green-500 to-green-700" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`bg-gradient-to-br ${k.color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}>
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full" />
              <Icon size={18} className="text-white/80 mb-3" />
              <p className="text-white/70 text-xs font-medium">{k.label}</p>
              <p className="text-white font-bold text-lg mt-0.5 truncate">{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <React.Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading chart...</p></div>}>
        <DashboardSalesChart isDark={isDark} cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} />
      </React.Suspense>

      {/* Sales Table */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${cardBg} ${cardBorder}`}>
        <div className={`p-4 border-b flex items-center gap-3 ${cardBorder}`}>
          <Search size={15} className={textMuted} />
          <input
            type="text"
            placeholder="Search by invoice ID, customer name, or fish species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 text-sm focus:outline-none bg-transparent ${textPrimary} placeholder:${textMuted}`}
          />
          <button onClick={loadData} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}>
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                {["Invoice ID", "Date", "Customer", "Type", "Item Sold", "Qty", "Amount", "Status", "Actions"].map((h) => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${textMuted}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divideColor}`}>
              {isLoading ? (
                <tr><td colSpan={9} className={`text-center py-8 ${textMuted} text-sm`}>Loading live transactions...</td></tr>
              ) : filteredSales.length === 0 ? (
                <tr><td colSpan={9} className={`text-center py-8 ${textMuted} text-sm`}>No sales recorded yet.</td></tr>
              ) : (
                filteredSales.map((s, i) => (
                  <tr key={i} className={`transition-colors ${tableHover}`}>
                    <td className={`px-4 py-3 text-xs font-mono font-medium ${isDark ? "text-teal-400" : "text-teal-700"}`}>{s.id}</td>
                    <td className={`px-4 py-3 text-xs ${textSub}`}>{s.date}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${textPrimary} max-w-[140px] truncate`}>{s.customer}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{s.type}</span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{s.species}</td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{s.qty}</td>
                    <td className="px-4 py-3 text-sm font-bold text-teal-500">{s.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${
                        s.status === "COMPLETED" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        s.status === "CANCELLED" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse"
                      }`}>
                        {s.status === "COMPLETED" && <Check size={10} />}
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {s.status === "PENDING" && (
                          <button
                            title="Trigger M-Pesa STK Push"
                            onClick={() => handleTriggerRowMpesa(s)}
                            className="p-1.5 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 transition-colors"
                          >
                            <Smartphone size={13} />
                          </button>
                        )}
                        <button
                          title="Edit Details"
                          onClick={() => openEditModal(s)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
                        >
                          <Edit size={13} />
                        </button>
                        {isAdmin && (
                          <button
                            title="Delete Sale (Admin Only)"
                            onClick={() => openDeleteModal(s.id)}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      {activeModal === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <div>
                <h3 className={`font-bold text-lg ${textPrimary}`}>Record Live Sale</h3>
                <p className={`text-xs ${textMuted}`}>Point of Sale transaction with instant STK Push</p>
              </div>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateSale} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Customer Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mama Oliech Restaurant"
                    value={createFormData.customerName}
                    onChange={(e) => setCreateFormData({ ...createFormData, customerName: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Customer Type</label>
                  <select
                    required
                    value={createFormData.orderType}
                    onChange={(e) => setCreateFormData({ ...createFormData, orderType: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="RETAIL">Retail (Walk-in)</option>
                    <option value="WHOLESALE">Wholesale</option>
                    <option value="HOTEL">Hotel / Restaurant</option>
                    <option value="CORPORATE">Corporate</option>
                    <option value="FARMER">Farmer (Fingerlings)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Select Item to Sell</label>
                  <select
                    required
                    value={createFormData.productId}
                    onChange={(e) => setCreateFormData({ ...createFormData, productId: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm mb-3 ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="" disabled>-- Choose an available inventory item --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.stock} {p.unit}) - KES {p.price}
                      </option>
                    ))}
                  </select>

                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Quantity</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={products.find((p) => p.id === createFormData.productId)?.stock || 9999}
                    placeholder="Enter quantity"
                    value={createFormData.quantity}
                    onChange={(e) => setCreateFormData({ ...createFormData, quantity: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <label className={`block text-xs font-semibold mb-2 ${textSub}`}>Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCreateFormData({ ...createFormData, paymentMethod: "MPESA" })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        createFormData.paymentMethod === "MPESA"
                          ? "bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20"
                          : isDark ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Smartphone size={14} /> M-Pesa STK Push
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateFormData({ ...createFormData, paymentMethod: "CASH" })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        createFormData.paymentMethod === "CASH"
                          ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                          : isDark ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <DollarSign size={14} /> Cash (Immediate)
                    </button>
                  </div>
                </div>

                {/* M-Pesa Phone Input */}
                {createFormData.paymentMethod === "MPESA" && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 space-y-1.5">
                    <label className="block text-xs font-semibold text-green-600 dark:text-green-400">
                      Customer Safaricom Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 0712345678 or 254712345678"
                      value={createFormData.phoneNumber}
                      onChange={(e) => setCreateFormData({ ...createFormData, phoneNumber: e.target.value })}
                      className={`w-full p-2 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    />
                    <p className="text-[11px] text-green-600/80 dark:text-green-400/80">
                      STK Push prompt will be dispatched directly to the customer's phone.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !createFormData.productId}
                  className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-70 shadow-sm"
                >
                  {isSubmitting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : createFormData.paymentMethod === "MPESA" ? (
                    <>
                      <Smartphone size={14} /> Send STK Push
                    </>
                  ) : (
                    "Process Cash Sale"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* M-Pesa Live Polling Modal */}
      {activeModal === "mpesa_status" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${cardBg} ${cardBorder} border p-6 text-center`}>
            {mpesaState.status === "PENDING" && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 mx-auto flex items-center justify-center relative">
                  <Smartphone size={28} className="animate-bounce" />
                  <div className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-25" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${textPrimary}`}>STK Push Dispatched!</h3>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Prompting <span className="font-semibold text-green-500">{mpesaState.phone}</span> for KES {mpesaState.amount.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs space-y-1">
                  <p className={textSub}>Order: <span className="font-mono font-bold text-teal-400">{mpesaState.orderNumber}</span></p>
                  <p className={`font-medium ${textMuted}`}>Waiting for customer PIN entry...</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-green-500 h-full transition-all duration-1000"
                      style={{ width: `${(mpesaState.pollSeconds / 45) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center gap-1.5 text-xs text-amber-500">
                  <Clock size={13} /> Timeout in {mpesaState.pollSeconds}s
                </div>
                <button
                  onClick={() => {
                    if (pollingRef.current) clearInterval(pollingRef.current);
                    setActiveModal("none");
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-semibold ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                >
                  Dismiss / Check Later in Table
                </button>
              </div>
            )}

            {mpesaState.status === "SUCCESS" && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg text-green-600 dark:text-green-400`}>Payment Confirmed!</h3>
                  <p className={`text-xs ${textSub} mt-1`}>
                    Order <span className="font-mono font-bold">{mpesaState.orderNumber}</span> is now <span className="text-green-500 font-bold">COMPLETED</span>.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs">
                  <p className="text-green-700 dark:text-green-300 font-medium">Safaricom Receipt</p>
                  <p className="font-mono font-bold text-green-600 text-sm mt-0.5">{mpesaState.mpesaReceipt}</p>
                </div>
                <button
                  onClick={() => setActiveModal("none")}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {mpesaState.status === "FAILED" && (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 mx-auto flex items-center justify-center">
                  <AlertCircle size={36} />
                </div>
                <div>
                  <h3 className={`font-bold text-lg text-red-600 dark:text-red-400`}>Payment Failed or Cancelled</h3>
                  <p className={`text-xs ${textMuted} mt-1`}>
                    Customer cancelled the request or the STK push timed out.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveModal("none")}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold ${isDark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (mpesaState.orderNumber && mpesaState.phone) {
                        startMpesaPolling(mpesaState.checkoutRequestId || "", mpesaState.orderNumber, mpesaState.amount, mpesaState.phone);
                      }
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    Retry Push
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Sale Modal */}
      {activeModal === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>Edit Sale Details</h3>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateSale} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Customer Name</label>
                  <input
                    required
                    type="text"
                    value={editFormData.customerName}
                    onChange={(e) => setEditFormData({ ...editFormData, customerName: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Transaction Status</label>
                  <select
                    required
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="DISPATCHED">Dispatched</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal("none")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Sale Modal (Admin only) */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border p-5 text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Delete Transaction?</h3>
            <p className={`text-sm ${textSub} mb-6`}>
              Are you sure? The deducted inventory will be returned to the stock automatically and recorded in the audit log.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveModal("none")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSale}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center min-w-[100px]"
              >
                {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : "Delete Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}