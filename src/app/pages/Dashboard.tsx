import { Suspense, lazy, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Fish, TrendingUp, FileText, Package, Users,
  ChevronRight, Plus, Search, Droplets,
  Edit, Trash2, Bell, LogOut, Home,
  Truck, RefreshCw, DollarSign, Lock, ShieldAlert,
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
const DashboardReportsTab = lazy(() => import("./dashboard/DashboardReportsTab"));

export function Dashboard() {
  const { isAuthenticated, user, isLoading, logout, hasRole } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAdmin = hasRole(["ADMIN", "admin"]);

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

  const navItems: { id: Tab; label: string; icon: any; adminOnly?: boolean }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "stock", label: "Fish Stock", icon: Fish },
    { id: "products", label: "Inventory & Import", icon: Package },
    { id: "sales", label: "Sales & POS", icon: TrendingUp },
    { id: "reports", label: "Reports & Audits", icon: FileText, adminOnly: true },
    { id: "suppliers", label: "Suppliers CRM", icon: Truck, adminOnly: true },
  ];

  return (
    <div className={`flex h-screen ${bg} pt-[98px] transition-colors duration-300`} style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? "w-56" : "w-14"} flex-shrink-0 flex flex-col z-20 fixed top-[98px] bottom-0 left-0 transition-all duration-300 ${isDark ? "bg-gray-900 border-r border-gray-800" : "bg-teal-900"}`}>
        <div className={`p-3 flex items-center justify-between border-b ${isDark ? "border-gray-800" : "border-teal-800"}`}>
          {sidebarOpen && (
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              {isAdmin ? "Admin Console" : "Manager Portal"}
            </span>
          )}
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
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${isAdmin ? "bg-amber-400/20 text-amber-300" : "bg-teal-400/20 text-teal-200"}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isRestricted = item.adminOnly && !isAdmin;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isRestricted) {
                    alert(`Restricted Area: The ${item.label} module is only accessible by Administrators.`);
                    return;
                  }
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? isDark ? "bg-teal-500/20 text-teal-400" : "bg-teal-50 text-teal-700 font-semibold"
                    : isRestricted
                    ? "opacity-50 text-gray-500 hover:opacity-75"
                    : isDark ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200" : "text-teal-100 hover:bg-teal-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  {sidebarOpen && <span>{item.label}</span>}
                </div>
                {sidebarOpen && item.adminOnly && !isAdmin && (
                  <Lock size={12} className="text-amber-400/70" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout / Switch User */}
        <div className={`p-2 border-t ${isDark ? "border-gray-800" : "border-teal-800"}`}>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-red-300 hover:bg-red-900/30 transition-colors`}
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className={`flex-1 transition-all duration-300 overflow-y-auto p-6 ${sidebarOpen ? "ml-56" : "ml-14"}`}>
        
        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === "overview" && (
          <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading overview charts...</p></div>}>
            <DashboardOverviewTab isDark={isDark} cardBg={cardBg} cardBorder={cardBorder} textPrimary={textPrimary} textMuted={textMuted} textSub={textSub} />
          </Suspense>
        )}

        {/* ══ FISH STOCK TAB ══ */}
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

        {/* ══ INVENTORY & IMPORT TAB ══ */}
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

        {/* ══ SALES & POS TAB (Phase 12: M-Pesa Integrated) ══ */}
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

        {/* ══ REPORTS & FINANCIAL AUDITS TAB (Admin Only) ══ */}
        {activeTab === "reports" && (
          isAdmin ? (
            <Suspense fallback={<div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}><p className={`text-sm ${textMuted}`}>Loading report generator...</p></div>}>
              <DashboardReportsTab
                isDark={isDark}
                cardBg={cardBg}
                cardBorder={cardBorder}
                textPrimary={textPrimary}
                textMuted={textMuted}
                textSub={textSub}
              />
            </Suspense>
          ) : (
            <div className={`rounded-2xl p-8 border text-center ${cardBg} ${cardBorder}`}>
              <ShieldAlert size={40} className="text-amber-500 mx-auto mb-3" />
              <h3 className={`font-bold text-lg ${textPrimary}`}>Admin Privilege Required</h3>
              <p className={`text-sm ${textMuted} mt-1 max-w-md mx-auto`}>
                Financial statements, audit exports, and sales summaries are restricted to Administrator accounts.
              </p>
              <button
                onClick={() => setActiveTab("overview")}
                className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
              >
                Return to Overview
              </button>
            </div>
          )
        )}

        {/* ══ SUPPLIERS CRM TAB (Admin Only) ══ */}
        {activeTab === "suppliers" && (
          isAdmin ? (
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
          ) : (
            <div className={`rounded-2xl p-8 border text-center ${cardBg} ${cardBorder}`}>
              <ShieldAlert size={40} className="text-amber-500 mx-auto mb-3" />
              <h3 className={`font-bold text-lg ${textPrimary}`}>Admin Privilege Required</h3>
              <p className={`text-sm ${textMuted} mt-1 max-w-md mx-auto`}>
                Supplier contract management and debt tracking are restricted to Administrator accounts.
              </p>
              <button
                onClick={() => setActiveTab("overview")}
                className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
              >
                Return to Overview
              </button>
            </div>
          )
        )}

      </main>
    </div>
  );
}