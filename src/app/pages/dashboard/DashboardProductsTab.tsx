import React, { useState, useEffect } from "react";
import { 
  Plus, UploadCloud, Search, Filter, Edit, 
  Trash2, X, Image as ImageIcon, FileText, 
  RefreshCw, CheckCircle2, AlertCircle
} from "lucide-react";
import { 
  fetchProducts, 
  createLiveProduct, 
  uploadBulkImportDocument,
  updateLiveProduct,
  deleteLiveProduct
} from "../../services/api";

interface DashboardProductsTabProps {
  isDark: boolean;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  textSub: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  imageUrl?: string;
  status: string;
}

export default function DashboardProductsTab({
  isDark, cardBg, cardBorder, textPrimary, textMuted, textSub
}: DashboardProductsTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [activeModal, setActiveModal] = useState<"none" | "single" | "bulk" | "edit" | "delete">("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null);

  // Form State (Used for both Create and Edit)
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", category: "fish", price: "", stock: "", unit: "kg", description: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Bulk Import Form State
  const [bulkFile, setBulkFile] = useState<File | null>(null);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  
  const resetForm = () => {
    setFormData({ name: "", category: "fish", price: "", stock: "", unit: "kg", description: "" });
    setImageFile(null);
    setActiveProductId(null);
    setFeedback(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setActiveModal("single");
  };

  const handleOpenEdit = (product: Product) => {
    resetForm();
    setActiveProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      description: "" // Assuming description isn't fetched in the summary table, or map it if it is
    });
    setActiveModal("edit");
  };

  const handleOpenDelete = (id: string) => {
    resetForm();
    setActiveProductId(id);
    setActiveModal("delete");
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (imageFile) data.append("image", imageFile);

      if (activeModal === "edit" && activeProductId) {
        await updateLiveProduct(activeProductId, data);
        setFeedback({ type: "success", message: "Product updated successfully!" });
      } else {
        await createLiveProduct(data);
        setFeedback({ type: "success", message: "Product created successfully!" });
      }
      
      setTimeout(() => {
        setActiveModal("none");
        loadProducts();
      }, 1500);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Action failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await uploadBulkImportDocument(bulkFile);
      setFeedback({ 
        type: "success", 
        message: `Import complete! Added ${result.results.newItemsAdded}, Updated ${result.results.existingItemsUpdated}.` 
      });
      
      setTimeout(() => {
        setActiveModal("none");
        loadProducts();
        setBulkFile(null);
      }, 2500);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to parse document" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!activeProductId) return;
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await deleteLiveProduct(activeProductId);
      setFeedback({ type: "success", message: "Product deleted successfully!" });
      setTimeout(() => {
        setActiveModal("none");
        loadProducts();
      }, 1000);
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to delete product" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tableHover = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50";

  return (
    <div className="space-y-6 relative">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Inventory & Import Engine</h2>
          <p className={`text-sm ${textMuted}`}>Manage store items, ImageKit assets, and bulk supplier lists</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { resetForm(); setActiveModal("bulk"); }}
            className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-xl text-sm transition-colors border ${
              isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <UploadCloud size={15} /> Bulk Import (.pdf/.docx)
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Plus size={15} /> Add Single Item
          </button>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${cardBg} ${cardBorder}`}>
        <div className={`p-4 border-b flex items-center gap-3 justify-between ${cardBorder}`}>
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <Search size={15} className={textMuted} />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 text-sm focus:outline-none bg-transparent ${textPrimary} placeholder:${textMuted}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadProducts} className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}>
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
              <Filter size={11} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${textMuted} w-16`}>Image</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${textMuted}`}>Product Name</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${textMuted}`}>Category</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${textMuted}`}>Price</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${textMuted}`}>Stock</th>
                <th className={`text-left px-4 py-3 text-xs font-semibold uppercase ${textMuted}`}>Status</th>
                <th className={`text-right px-4 py-3 text-xs font-semibold uppercase ${textMuted}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-100"}`}>
              {isLoading ? (
                <tr><td colSpan={7} className={`text-center py-8 ${textMuted} text-sm`}>Loading inventory...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan={7} className={`text-center py-8 ${textMuted} text-sm`}>No products found.</td></tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className={`transition-colors ${tableHover}`}>
                    <td className="px-4 py-3">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                          <ImageIcon size={16} className={textMuted} />
                        </div>
                      )}
                    </td>
                    <td className={`px-4 py-3 text-sm font-semibold ${textPrimary}`}>{p.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-teal-500">KES {p.price.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm ${textSub}`}>{p.stock} {p.unit}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                        p.status === "PENDING_IMAGE" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(p.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Single Product Modal (Create & Edit) ── */}
      {(activeModal === "single" || activeModal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>
                {activeModal === "edit" ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleSingleSubmit} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              <div className="space-y-3">
                <input required type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                <div className="grid grid-cols-2 gap-3">
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="fish">Fish / Fingerlings</option>
                    <option value="feed">Feed</option>
                    <option value="equipment">Equipment</option>
                  </select>
                  <input required type="number" placeholder="Price (KES)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input required type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                  <input required type="text" placeholder="Unit (e.g. kg, pcs)" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className={`w-full p-2.5 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'}`} />
                </div>
                
                <div className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDark ? 'border-gray-700 hover:border-teal-500 bg-gray-800/50' : 'border-gray-300 hover:border-teal-500 bg-gray-50'}`}>
                  <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                    {imageFile ? (
                      <span className={`text-sm font-semibold text-teal-500`}>{imageFile.name}</span>
                    ) : (
                      <>
                        <ImageIcon size={24} className={textMuted} />
                        <span className={`text-sm ${textMuted}`}>Click to upload new image (optional)</span>
                        <span className={`text-xs ${textSub}`}>Powered by ImageKit CDN</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveModal("none")} className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                  {activeModal === "edit" ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border p-5 text-center`}>
            <div className="w-12 h-12 rounded-full bg-red-100 mx-auto flex items-center justify-center mb-4">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${textPrimary}`}>Delete Product?</h3>
            <p className={`text-sm ${textSub} mb-6`}>Are you sure you want to remove this item? This action cannot be undone.</p>
            
            {feedback && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center justify-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
            )}

            <div className="flex justify-center gap-3">
              <button onClick={() => setActiveModal("none")} className={`px-5 py-2.5 rounded-xl text-sm font-medium ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>
                Cancel
              </button>
              <button onClick={handleDeleteSubmit} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white flex items-center justify-center min-w-[100px]">
                {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Import Modal (PDF / DOCX) ── */}
      {activeModal === "bulk" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-xl overflow-hidden ${cardBg} ${cardBorder} border`}>
            <div className={`p-4 border-b flex justify-between items-center ${cardBorder}`}>
              <h3 className={`font-bold text-lg ${textPrimary}`}>Bulk Supplier Import</h3>
              <button onClick={() => setActiveModal("none")} className={textMuted}><X size={18} /></button>
            </div>
            
            <form onSubmit={handleBulkSubmit} className="p-5 space-y-4">
              {feedback && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              <p className={`text-sm ${textSub}`}>
                Upload a supplier stock list. Our engine will extract the text, find products, and update your inventory automatically.
              </p>

              <div className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${isDark ? 'border-gray-700 hover:border-teal-500 bg-gray-800/50' : 'border-gray-300 hover:border-teal-500 bg-gray-50'}`}>
                <input type="file" id="docUpload" accept=".pdf,.docx" className="hidden" onChange={e => setBulkFile(e.target.files?.[0] || null)} />
                <label htmlFor="docUpload" className="cursor-pointer flex flex-col items-center justify-center gap-3">
                  {bulkFile ? (
                    <>
                      <FileText size={32} className="text-teal-500" />
                      <span className={`text-sm font-semibold text-teal-500`}>{bulkFile.name}</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} className={textMuted} />
                      <span className={`text-sm font-medium ${textPrimary}`}>Drag & drop or click to upload</span>
                      <span className={`text-xs ${textSub}`}>Supports .pdf and .docx (Max 10MB)</span>
                    </>
                  )}
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setActiveModal("none")} className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>Cancel</button>
                <button type="submit" disabled={isSubmitting || !bulkFile} className="bg-teal-700 hover:bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : "Run Import Engine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}