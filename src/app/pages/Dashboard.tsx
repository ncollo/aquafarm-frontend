import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Fish, TrendingUp, FileText, Package, Users,
  ChevronRight, Plus, Search, Droplets,
  Edit, Trash2, Bell, LogOut, Home,
  Truck, RefreshCw, DollarSign,
  Star, Calendar, Download, Filter,
} from "lucide-react";


type Tab = "overview" | "stock" | "sales" | "reports" | "suppliers" | "products";

// Lazy Loaded Dynamic Components
const DashboardOverviewTab = lazy(() => import("./dashboard/DashboardOverviewTab"));
const DashboardSalesChart = lazy(() => import("./dashboard/DashboardSalesChart"));
const DashboardProductsTab = lazy(() => import("./dashboard/DashboardProductsTab"));
const DashboardStockTab = lazy(() => import("./dashboard/DashboardStockTab"));
const DashboardSalesTab = lazy(() => import("./dashboard/DashboardSalesTab"));
const DashboardSuppliersTab = lazy(() => import("./dashboard/DashboardSuppliersTab"));


export function Dashboard() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchSales, setSearchSales] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  // Theme Colors
  const bg = isDark ? "bg-gray-900" : "bg-gray-100";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-100";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const textSub = isDark ? "text-gray-300" : "text-gray-600";
  const tableHover = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50";
  const divideColor = isDark ? "divide-gray-700" : "divide-gray-50";

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "stock", label: "Fish Stock", icon: Fish },
    { id: "products", label: "Inventory & Import", icon: Package },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "suppliers", label: "Suppliers", icon: Truck },
  ];


  return (
    <div className={`flex h-screen ${bg} pt-[98px] transition-colors duration-300`} style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-56" : "w-14"} flex-shrink-0 flex flex-col z-20 fixed top-[98px] bottom-0 left-0 transition-all duration-300 ${isDark ? "bg-gray-900 border-r border-gray-800" : "bg-teal-900"}`}>
        <div className={`p-3 flex items-center justify-between border-b ${isDark ? "border-gray-800" : "border-teal-800"}`}>
          {sidebarOpen && <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Admin Panel</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-1 rounded-lg transition-colors ml-auto ${isDark ? "hover:bg-gray-800" : "hover:bg-teal-800"}`}>
            <ChevronRight size={16} className={`text-white transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {sidebarOpen && (
          <div className={`px-3 py-3 border-b ${isDark ? "border-gray-800" : "border-teal-800"}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{user?.avatar}</div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-teal-300 text-[10px] capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-700"
                    : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200" : "text-teal-100 hover:bg-teal-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <main className={`flex-1 transition-all duration-300 overflow-y-auto p-6 ${sidebarOpen ? "ml-56" : "ml-14"}`}>
        
        {/* ══ OVERVIEW TAB (Phase 10) ══ */}
        {activeTab === "overview" && (
          <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading overview charts...</p></div>}>
            <DashboardOverviewTab isDark={isDark} cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} textMuted={textMuted} textSub={textSub} />
          </Suspense>
        )}

        {/* ══ FISH STOCK TAB (Phase 7 - Fully Dynamic) ══ */}
        {activeTab === "stock" && (
          <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading live fish stock...</p></div>}>
            <DashboardStockTab
              isDark={isDark}
              cardBg={cardBg}
              cardBorder={cardBorder}
              textPrimary={textPrimary}
              textMuted={textMuted}
              textSub={textSub}
              divideColor={divideColor}
              tableHover={tableHover}
            />
          </Suspense>
        )}

        {/* ══ INVENTORY & IMPORT TAB (Phases 4 & 5 - Fully Dynamic) ══ */}
        {activeTab === "products" && (
          <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading inventory manager...</p></div>}>
            <DashboardProductsTab 
              isDark={isDark} 
              cardBg={cardBg} 
              cardBorder={cardBorder} 
              textPrimary={textPrimary} 
              textMuted={textMuted}
              textSub={textSub}
            />
          </Suspense>
        )}

        
        {/* ══ SALES TAB (Phase 8 - Fully Dynamic) ══ */}
          {activeTab === "sales" && (
            <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading live transactions...</p></div>}>
              <DashboardSalesTab
                isDark={isDark}
                cardBg={cardBg}
                cardBorder={cardBorder}
                textPrimary={textPrimary}
                textMuted={textMuted}
                textSub={textSub}
                divideColor={divideColor}
                tableHover={tableHover}
              />
            </Suspense>
          )}

        {/* ══ REPORTS TAB (Phase 11) ══ */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`font-bold text-xl ${textPrimary}`}>Reports & Analytics</h2>
                <p className={`text-sm ${textMuted}`}>Download and view farm reports</p>
              </div>
              <button className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                <Download size={14} /> Export All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[
                { title: "Monthly Sales Report", desc: "Revenue, orders, and top customers for March 2026", date: "Mar 26, 2026", type: "Sales", gradient: "from-teal-500 to-teal-700", icon: TrendingUp },
                { title: "Fish Stock Report", desc: "Current stock, health status, and harvest forecast", date: "Mar 26, 2026", type: "Operations", gradient: "from-blue-500 to-blue-700", icon: Fish },
                { title: "Q1 2026 Financial Summary", desc: "Revenue, expenses, profit margins — Jan–Mar 2026", date: "Mar 26, 2026", type: "Finance", gradient: "from-emerald-500 to-emerald-700", icon: DollarSign },
                { title: "Water Quality Report", desc: "Pond health metrics, dissolved oxygen, pH levels", date: "Mar 25, 2026", type: "Health", gradient: "from-cyan-500 to-cyan-700", icon: Droplets },
              ].map((r, i) => {
                const Icon = r.icon;
                return (
                  <div key={i} className={`rounded-2xl shadow-sm border overflow-hidden ${cardBg} ${cardBorder}`}>
                    <div className={`bg-gradient-to-r ${r.gradient} p-4 flex items-center gap-3`}>
                      <div className="bg-white/20 p-2 rounded-xl">
                        <Icon size={16} className="text-white" />
                      </div>
                      <div>
                        <span className="text-white/70 text-xs font-medium">{r.type}</span>
                        <p className="text-white font-semibold text-sm leading-tight">{r.title}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className={`text-sm ${textSub} mb-3 leading-relaxed`}>{r.desc}</p>
                      <div className={`flex items-center justify-between text-xs ${textMuted}`}>
                        <span>Generated: {r.date}</span>
                        <button className="flex items-center gap-1 text-teal-500 font-semibold hover:text-teal-400 transition-colors">
                          <Download size={12} /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ SUPPLIERS TAB (Phase 9 - Fully Dynamic CRM) ══ */}
        {activeTab === "suppliers" && (
          <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading supplier network...</p></div>}>
            <DashboardSuppliersTab
              isDark={isDark}
              cardBg={cardBg}
              cardBorder={cardBorder}
              textPrimary={textPrimary}
              textMuted={textMuted}
              textSub={textSub}
              divideColor={divideColor}
              tableHover={tableHover}
            />
          </Suspense>
        )}


      </main>
    </div>
  );
}