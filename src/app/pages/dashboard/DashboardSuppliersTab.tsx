import React, { useState, useEffect } from "react";
import {
  Plus, Search, Edit, Trash2, Truck, DollarSign, Star,
  X, CheckCircle2, AlertCircle, RefreshCw, Phone, ShieldCheck, Tag
} from "lucide-react";
import {
  fetchSuppliers, createSupplier, updateSupplier, deleteSupplier
} from "../../services/api";

interface DashboardSuppliersTabProps {
  isDark: boolean;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  textSub: string;
  divideColor: string;
  tableHover: string;
}

export default function DashboardSuppliersTab({
  isDark, cardBg, cardBorder, textPrimary, textMuted, textSub, divideColor, tableHover
}: DashboardSuppliersTabProps) {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const [activeModal, setActiveModal] = useState<"none" | "create" | "edit" | "delete">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [activeSupplier, setActiveSupplier] = useState<any | null>(null);

  const [createFormData, setCreateFormData] = useState({
    name: "",
    category: "Fish Feed",
    contactPhone: "",
    outstandingDebt: "0",
    rating: "5"
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    category: "Fish Feed",
    contactPhone: "",
    outstandingDebt: "0",
    rating: "5"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error("Failed to load suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await createSupplier(createFormData);
      setFeedback({ type: "success", message: "Supplier registered successfully!" });
      setTimeout(() => {
        setActiveModal("none");
        loadData();
        setCreateFormData({ name: "", category: "Fish Feed", contactPhone: "", outstandingDebt: "0", rating: "5" });
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to create supplier" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSupplier) return;
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await updateSupplier(activeSupplier.id, editFormData);
      setFeedback({ type: "success", message: "Supplier updated successfully!" });
      setTimeout(() => {
        setActiveModal("none");
        loadData();
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to update supplier" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!activeSupplier) return;
    setIsSubmitting(true);
    try {
      await deleteSupplier(activeSupplier.id);
      setActiveModal("none");
      loadData();
    } catch (error) {
      console.error("Failed to delete supplier:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (supplier: any) => {
    setActiveSupplier(supplier);
    setEditFormData({
      name: supplier.name,
      category: supplier.category,
      contactPhone: supplier.contactPhone || supplier.contact,
      outstandingDebt: String(supplier.outstandingDebt ?? 0),
      rating: String(supplier.rating ?? 5)
    });
    setActiveModal("edit");
  };

  const openDeleteModal = (supplier: any) => {
    setActiveSupplier(supplier);
    setActiveModal("delete");
  };

  const categories = ["All", ...Array.from(new Set(suppliers.map(s => s.category).filter(Boolean)))];

  const filteredSuppliers = suppliers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.contact && s.contact.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalOutstanding = suppliers.reduce((acc, s) => acc + (Number(s.outstandingDebt) || 0), 0);
  const avgRating = suppliers.length > 0
    ? (suppliers.reduce((acc, s) => acc + (Number(s.rating) || 5), 0) / suppliers.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-6 relative">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Supplier Management (CRM)</h2>
          <p className={`text-sm ${textMuted}`}>Vendor network, supply categories & debt monitoring</p>
        </div>
        <button
          onClick={() => { setActiveModal("create"); setFeedback(null); }}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors shadow-md"
        >
          <Plus size={15} /> Add Supplier
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Vendors", value: `${suppliers.length} active`, icon: Truck, color: "from-teal-500 to-teal-700" },
          { label: "Total Outstanding", value: `KES ${totalOutstanding.toLocaleString()}`, icon: DollarSign, color: totalOutstanding > 0 ? "from-amber-500 to-amber-700" : "from-emerald-500 to-emerald-700" },
          { label: "Top Category", value: suppliers[0]?.category || "Fish Feed", icon: Tag, color: "from-blue-500 to-blue-700" },
          { label: "Avg Vendor Rating", value: `${avgRating} / 5.0`, icon: Star, color: "from-purple-500 to-purple-700" },
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

      {/* ── Search & Category Filter ── */}
      <div className={`p-4 rounded-2xl shadow-sm border ${cardBg} ${cardBorder} flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between`}>
        <div className="flex items-center gap-3 flex-1">
          <Search size={16} className={textMuted} />
          <input
            type="text"
            placeholder="Search suppliers by name, category, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm bg-transparent focus:outline-none ${textPrimary} placeholder:${textMuted}`}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-teal-700 text-white shadow"
                  : isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={loadData}
            title="Refresh Suppliers"
            className={`p-2 rounded-xl border transition-colors ${isDark ? "border-gray-700 text-gray-400 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-100"}`}
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* ── Supplier Grid ── */}
      {isLoading ? (
        <div className={`rounded-2xl p-12 text-center border ${cardBg} ${cardBorder}`}>
          <RefreshCw size={24} className="animate-spin text-teal-500 mx-auto mb-2" />
          <p className={`text-sm ${textMuted}`}>Loading verified suppliers...</p>
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center border ${cardBg} ${cardBorder}`}>
          <Truck size={32} className="text-gray-400 mx-auto mb-2" />
          <p className={`font-semibold ${textPrimary}`}>No suppliers found</p>
          <p className={`text-xs ${textMuted} mt-1`}>Add a new supplier or adjust search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              className={`rounded-2xl p-5 shadow-sm border transition-all duration-200 hover:shadow-md ${cardBg} ${cardBorder} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 pr-2">
                    <h4 className={`font-bold text-base truncate ${textPrimary}`}>{sup.name}</h4>
                    <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full mt-1 font-medium ${isDark ? "bg-teal-900/40 text-teal-400" : "bg-teal-50 text-teal-700"}`}>
                      {sup.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(sup)}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
                      title="Edit Supplier"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(sup)}
                      className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
                      title="Delete Supplier"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={13}
                      className={idx < (sup.rating || 5) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"}
                    />
                  ))}
                  <span className={`text-[11px] font-semibold ml-1 ${textSub}`}>{sup.rating || 5}.0</span>
                </div>

                <div className={`space-y-2 text-xs pt-3 border-t ${cardBorder}`}>
                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 ${textMuted}`}><Phone size={12} /> Contact</span>
                    <span className={`font-mono font-medium ${textPrimary}`}>{sup.contact || sup.contactPhone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`flex items-center gap-1.5 ${textMuted}`}><ShieldCheck size={12} /> Status</span>
                    <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${sup.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {sup.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={textMuted}>Outstanding Debt</span>
                    <span className={`font-semibold ${sup.outstandingDebt && sup.outstandingDebt > 0 ? "text-red-500" : "text-green-500"}`}>
                      KES {Number(sup.outstandingDebt || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create Modal ── */}
      {activeModal === "create" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>Register New Supplier</h3>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateSupplier} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Supplier / Business Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., AquaFeed Kenya Ltd"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Supply Category</label>
                  <select
                    required
                    value={createFormData.category}
                    onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="Fish Feed">Fish Feed</option>
                    <option value="Fingerling Feed">Fingerling Feed</option>
                    <option value="Equipment">Equipment & Aerators</option>
                    <option value="Solar Energy">Solar Energy</option>
                    <option value="Veterinary">Veterinary & Health</option>
                    <option value="Packaging">Packaging & Logistics</option>
                    <option value="General">General Supplies</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Contact Phone Number</label>
                  <input
                    required
                    type="text"
                    placeholder="+254 700 000 000"
                    value={createFormData.contactPhone}
                    onChange={(e) => setCreateFormData({ ...createFormData, contactPhone: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Outstanding Debt (KES)</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      placeholder="0"
                      value={createFormData.outstandingDebt}
                      onChange={(e) => setCreateFormData({ ...createFormData, outstandingDebt: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Quality Rating (1–5)</label>
                    <select
                      value={createFormData.rating}
                      onChange={(e) => setCreateFormData({ ...createFormData, rating: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
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
                  className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md"
                >
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {activeModal === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>Edit Supplier Details</h3>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateSupplier} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Supplier Name</label>
                  <input
                    required
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Category</label>
                  <select
                    required
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  >
                    <option value="Fish Feed">Fish Feed</option>
                    <option value="Fingerling Feed">Fingerling Feed</option>
                    <option value="Equipment">Equipment & Aerators</option>
                    <option value="Solar Energy">Solar Energy</option>
                    <option value="Veterinary">Veterinary & Health</option>
                    <option value="Packaging">Packaging & Logistics</option>
                    <option value="General">General Supplies</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Contact Phone</label>
                  <input
                    required
                    type="text"
                    value={editFormData.contactPhone}
                    onChange={(e) => setEditFormData({ ...editFormData, contactPhone: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Outstanding Debt (KES)</label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.outstandingDebt}
                      onChange={(e) => setEditFormData({ ...editFormData, outstandingDebt: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${textSub}`}>Quality Rating</label>
                    <select
                      value={editFormData.rating}
                      onChange={(e) => setEditFormData({ ...editFormData, rating: e.target.value })}
                      className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300"}`}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Fair</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md"
                >
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Update Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border p-5 text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Delete Supplier?</h3>
            <p className={`text-sm ${textSub} mb-6`}>
              Are you sure you want to remove <strong>{activeSupplier?.name}</strong>? This vendor will be deactivated from active purchasing.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveModal("none")}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSupplier}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center min-w-[110px]"
              >
                {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : "Delete Vendor"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
