import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, DollarSign, Package, Truck, Star, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { fetchSalesRecords, createSaleRecord, fetchProducts } from "../../services/api";

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
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);

  const [formData, setFormData] = useState({
    customerName: "",
    orderType: "RETAIL",
    productId: "",
    quantity: ""
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [salesData, productsData] = await Promise.all([
        fetchSalesRecords(),
        fetchProducts()
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
  }, []);

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      
      const selectedProduct = products.find(p => p.id === formData.productId);
      if (!selectedProduct) throw new Error("Please select a valid product.");

      const payload = {
        customerName: formData.customerName,
        orderType: formData.orderType,
        items: [{
          productId: selectedProduct.id,
          quantity: parseFloat(formData.quantity),
          price: selectedProduct.price
        }]
      };

      await createSaleRecord(payload);
      
      setFeedback({ type: "success", message: "Sale recorded! Inventory deducted." });
      setTimeout(() => {
        setIsModalOpen(false);
        loadData();
        setFormData({ customerName: "", orderType: "RETAIL", productId: "", quantity: "" });
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to record sale" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSales = sales.filter(s => 
    s.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  const totalRevenue = sales.reduce((sum, sale) => {
    
    const num = parseInt(sale.amount.replace(/[^0-9]/g, ''), 10) || 0;
    return sum + num;
  }, 0);

  const pendingOrders = sales.filter(s => s.status === "PENDING").length;

  const customerFreq = sales.reduce((acc, sale) => {
    acc[sale.customer] = (acc[sale.customer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCustomer = Object.keys(customerFreq).sort((a, b) => customerFreq[b] - customerFreq[a])[0] || "None yet";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Sales Management</h2>
          <p className={`text-sm ${textMuted}`}>Live transactional database</p>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setFeedback(null); }}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Record New Sale
        </button>
      </div>

      {/* Dynamic KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-teal-500 to-teal-700" },
          { label: "Total Orders", value: `${sales.length} orders`, icon: Package, color: "from-blue-500 to-blue-700" },
          { label: "Pending Delivery", value: `${pendingOrders} orders`, icon: Truck, color: "from-amber-500 to-amber-700" },
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

      {/* Chart Component (Kept exactly as you styled it) */}
      <React.Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading chart...</p></div>}>
        <DashboardSalesChart isDark={isDark} cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} />
      </React.Suspense>

      {/* Dynamic Data Table */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${cardBg} ${cardBorder}`}>
        <div className={`p-4 border-b flex items-center gap-3 ${cardBorder}`}>
          <Search size={15} className={textMuted} />
          <input
            type="text"
            placeholder="Search by invoice, customer, or species..."
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
                {["Invoice ID", "Date", "Customer", "Type", "Item Sold", "Qty", "Amount", "Status", "Action"].map((h) => (
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
                    <td className={`px-4 py-3 text-xs font-mono ${textMuted}`}>{s.id}</td>
                    <td className={`px-4 py-3 text-xs ${textSub}`}>{s.date}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${textPrimary} max-w-[140px] truncate`}>{s.customer}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{s.type}</span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{s.species}</td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{s.qty}</td>
                    <td className="px-4 py-3 text-sm font-bold text-teal-500">{s.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}><Edit size={13} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create Sale Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>Record New Sale</h3>
              <button onClick={() => setIsModalOpen(false)} className={textMuted}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateSale} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              <div className="space-y-3">
                <input required type="text" placeholder="Customer Name" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                
                <select required value={formData.orderType} onChange={e => setFormData({...formData, orderType: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
                  <option value="RETAIL">Retail (Walk-in)</option>
                  <option value="WHOLESALE">Wholesale</option>
                  <option value="HOTEL">Hotel / Restaurant</option>
                  <option value="CORPORATE">Corporate</option>
                  <option value="FARMER">Farmer (Fingerlings)</option>
                </select>

                <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Select Product to Sell</label>
                  <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm mb-3 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="" disabled>-- Choose an item --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (In Stock: {p.stock} {p.unit}) - KES {p.price}</option>
                    ))}
                  </select>

                  <input required type="number" step="0.1" max={products.find(p => p.id === formData.productId)?.stock || 9999} placeholder="Quantity" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Cancel</button>
                <button type="submit" disabled={isSubmitting || !formData.productId} className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Process Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}