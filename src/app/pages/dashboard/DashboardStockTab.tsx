import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, RefreshCw, Calendar, Fish, X, CheckCircle2, AlertCircle } from "lucide-react";
import { fetchFishBatches, createFishBatch, deleteFishBatch } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface DashboardStockTabProps {
  isDark: boolean;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  textSub: string;
  divideColor: string;
  tableHover: string;
}

export default function DashboardStockTab({
  isDark, cardBg, cardBorder, textPrimary, textMuted, textSub, divideColor, tableHover
}: DashboardStockTabProps) {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(["ADMIN", "admin"]);

  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [activeModal, setActiveModal] = useState<"none" | "add" | "delete">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    batchCode: "", species: "Tilapia", totalKg: "", avgWeight: "", healthStatus: "EXCELLENT", expectedHarvest: "", pricePerKg: ""
  });

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const data = await fetchFishBatches();
      setBatches(data);
    } catch (error) {
      console.error("Failed to load batches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      await createFishBatch(formData);
      setFeedback({ type: "success", message: "Batch created successfully!" });
      setTimeout(() => {
        setActiveModal("none");
        loadBatches();
        setFormData({ batchCode: "", species: "Tilapia", totalKg: "", avgWeight: "", healthStatus: "EXCELLENT", expectedHarvest: "", pricePerKg: "" });
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Action failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!activeBatchId) return;
    if (!isAdmin) {
      alert("Access Denied: Only ADMINs can delete fish batches.");
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteFishBatch(activeBatchId);
      setActiveModal("none");
      loadBatches();
    } catch (error: any) {
      alert(error.message || "Failed to delete fish batch");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper colors for status
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'EXCELLENT': return 'bg-green-100 text-green-700';
      case 'GOOD': return 'bg-blue-100 text-blue-700';
      case 'MONITOR': return 'bg-amber-100 text-amber-700';
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSpeciesColor = (species: string) => {
    if (species.toLowerCase().includes('tilapia')) return '#0d9488';
    if (species.toLowerCase().includes('catfish')) return '#f59e0b';
    if (species.toLowerCase().includes('trout')) return '#3b82f6';
    return '#8b5cf6';
  };

  // Dynamically calculate summary stats per species
  const speciesSummary = batches.reduce((acc, batch) => {
    const s = batch.species;
    if (!acc[s]) acc[s] = { totalKg: 0, ponds: 0, color: getSpeciesColor(s) };
    acc[s].totalKg += batch.totalKg;
    acc[s].ponds += batch.pondCount || 1;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Fish Stock Management</h2>
          <p className={`text-sm ${textMuted}`}>Live database overview</p>
        </div>
        <button 
          onClick={() => setActiveModal("add")}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus size={15} /> Add Stock Record
        </button>
      </div>

      {/* Dynamic Species Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(speciesSummary).map(([species, data]: any, i) => (
          <div key={i} className={`rounded-2xl p-4 shadow-sm border text-center ${cardBg} ${cardBorder}`}>
            <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: data.color + "20" }}>
              <Fish size={16} style={{ color: data.color }} />
            </div>
            <p className={`font-semibold text-sm mb-1 ${textPrimary}`}>{species}</p>
            <p className="font-bold text-xl" style={{ color: data.color }}>{(data.totalKg / 1000).toFixed(1)}T</p>
            <p className={`text-xs ${textMuted}`}>{data.ponds} pond(s) active</p>
          </div>
        ))}
        {Object.keys(speciesSummary).length === 0 && !isLoading && (
           <p className={`text-sm ${textMuted} col-span-full`}>No active stock found. Add a record to see summary metrics.</p>
        )}
      </div>

      {/* Harvest Countdown */}
      <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${textPrimary}`}>
          <Calendar size={15} className="text-teal-500" /> Days to Harvest Forecast
        </h3>
        <div className="space-y-3">
          {batches.filter(b => b.daysToHarvest).map((batch, i) => {
            const progress = Math.max(0, 100 - ((batch.daysToHarvest / 70) * 100));
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 flex-shrink-0">
                  <p className={`text-xs font-semibold ${textSub}`}>{batch.batchCode} - {batch.species}</p>
                </div>
                <div className="flex-1">
                  <div className={`h-3 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: getSpeciesColor(batch.species) }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className={`text-xs font-bold ${batch.daysToHarvest <= 20 ? "text-green-500" : batch.daysToHarvest <= 35 ? "text-amber-500" : textMuted}`}>
                    {batch.daysToHarvest} days
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Table */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${cardBg} ${cardBorder}`}>
        <div className={`p-4 border-b flex items-center justify-between ${cardBorder}`}>
          <h3 className={`font-semibold ${textPrimary}`}>Detailed Stock Records</h3>
          <button onClick={loadBatches} className={`flex items-center gap-1 text-xs transition-colors ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-700 hover:text-teal-600"}`}>
            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                {["Batch ID", "Species", "Total Stock", "Avg Weight", "Health", "Harvest In", "Actions"].map((h) => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divideColor}`}>
              {isLoading ? (
                <tr><td colSpan={7} className={`text-center py-8 ${textMuted} text-sm`}>Loading live data...</td></tr>
              ) : batches.length === 0 ? (
                <tr><td colSpan={7} className={`text-center py-8 ${textMuted} text-sm`}>No stock recorded yet.</td></tr>
              ) : (
                batches.map((batch, i) => (
                  <tr key={i} className={`transition-colors ${tableHover}`}>
                    <td className={`px-4 py-3 text-xs font-mono ${textMuted}`}>{batch.batchCode}</td>
                    <td className={`px-4 py-3 text-sm font-semibold ${textPrimary}`}>{batch.species}</td>
                    <td className="px-4 py-3 text-sm font-bold text-teal-500">{batch.totalKg.toLocaleString()} kg</td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{batch.avgWeight}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(batch.healthStatus)}`}>{batch.healthStatus}</span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{batch.daysToHarvest ? `${batch.daysToHarvest} days` : "N/A"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {isAdmin && (
                          <button 
                            title="Delete Batch (Admin Only)"
                            onClick={() => { setActiveBatchId(batch.id); setActiveModal("delete"); }}
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

      {/* Add Modal */}
      {activeModal === "add" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>Add Stock Record</h3>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <input required type="text" placeholder="Batch Code (e.g. TS-005)" value={formData.batchCode} onChange={e => setFormData({...formData, batchCode: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                <input required type="text" placeholder="Species (e.g. Tilapia)" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Total Kg" value={formData.totalKg} onChange={e => setFormData({...formData, totalKg: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                <input required type="text" placeholder="Avg Weight (e.g. 450g)" value={formData.avgWeight} onChange={e => setFormData({...formData, avgWeight: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select required value={formData.healthStatus} onChange={e => setFormData({...formData, healthStatus: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="MONITOR">Monitor</option>
                  <option value="CRITICAL">Critical</option>
                </select>
                <input type="date" placeholder="Expected Harvest" value={formData.expectedHarvest} onChange={e => setFormData({...formData, expectedHarvest: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveModal("none")} className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border p-5 text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Delete Batch?</h3>
            <p className={`text-sm ${textSub} mb-6`}>This will permanently remove this batch record. It cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setActiveModal("none")} className={`px-5 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>Cancel</button>
              <button onClick={handleDeleteSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white flex items-center gap-2">
                {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Delete Batch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}