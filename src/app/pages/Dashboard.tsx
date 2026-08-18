import { Suspense, lazy, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard, Fish, TrendingUp, FileText, Package, Users,
  ChevronRight, Plus, Search,
  Edit, Trash2, Bell, LogOut, Home,
  Truck, RefreshCw, DollarSign,
  Star, Sun, Moon,
  Calendar, Download, Filter,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const fishStock = [
  { id: "TS-001", species: "Nile Tilapia", pondCount: 12, totalKg: 8400, avgWeight: "450g", status: "Excellent", healthStatus: "Healthy", daysToHarvest: 18, color: "#0d9488", statusColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { id: "CS-001", species: "African Catfish", pondCount: 8, totalKg: 5600, avgWeight: "720g", status: "Good", healthStatus: "Healthy", daysToHarvest: 25, color: "#f59e0b", statusColor: "bg-teal-100 text-teal-700" },
  { id: "RT-001", species: "Rainbow Trout", pondCount: 4, totalKg: 2100, avgWeight: "580g", status: "Monitor", healthStatus: "Under Watch", daysToHarvest: 35, color: "#3b82f6", statusColor: "bg-amber-100 text-amber-700" },
  { id: "CP-001", species: "Common Carp", pondCount: 3, totalKg: 1800, avgWeight: "850g", status: "Good", healthStatus: "Healthy", daysToHarvest: 42, color: "#10b981", statusColor: "bg-blue-100 text-blue-700" },
  { id: "LF-001", species: "Lungfish", pondCount: 2, totalKg: 980, avgWeight: "1.1kg", status: "Good", healthStatus: "Healthy", daysToHarvest: 60, color: "#8b5cf6", statusColor: "bg-purple-100 text-purple-700" },
  { id: "BS-001", species: "Largemouth Bass", pondCount: 2, totalKg: 560, avgWeight: "680g", status: "Good", healthStatus: "Healthy", daysToHarvest: null, color: "#ef4444", statusColor: "bg-red-100 text-red-700" },
];

const salesRecords = [
  { id: "SAL-2026-0326", date: "26 Mar 2026", customer: "Nakuru Supermart", species: "Tilapia", qty: "85kg", amount: "KES 29,750", status: "Completed", type: "Wholesale" },
  { id: "SAL-2026-0325a", date: "25 Mar 2026", customer: "Sarova Woodlands Hotel", species: "Trout", qty: "12kg", amount: "KES 7,800", status: "Completed", type: "Hotel" },
  { id: "SAL-2026-0325b", date: "25 Mar 2026", customer: "James Kamau (Farmer)", species: "Fingerlings (Tilapia)", qty: "500 pcs", amount: "KES 7,500", status: "Completed", type: "Farmer" },
  { id: "SAL-2026-0324", date: "24 Mar 2026", customer: "Nairobi Fish Market", species: "Catfish", qty: "120kg", amount: "KES 48,000", status: "Pending", type: "Wholesale" },
  { id: "SAL-2026-0323", date: "23 Mar 2026", customer: "Walk-in Customer", species: "Tilapia", qty: "5kg", amount: "KES 1,750", status: "Completed", type: "Retail" },
  { id: "SAL-2026-0322", date: "22 Mar 2026", customer: "Kenya Airways Catering", species: "Trout", qty: "30kg", amount: "KES 19,500", status: "Delivered", type: "Corporate" },
];

const suppliers = [
  { id: "SUP-001", name: "AquaFeed Kenya Ltd", category: "Fish Feed", contact: "+254 720 111 001", lastOrder: "15 Mar 2026", outstanding: "KES 0", status: "Active", rating: 5 },
  { id: "SUP-002", name: "NutriStart Animal Feeds", category: "Fingerling Feed", contact: "+254 720 111 002", lastOrder: "10 Mar 2026", outstanding: "KES 12,000", status: "Active", rating: 4 },
  { id: "SUP-003", name: "Rift Valley Equipment Co.", category: "Equipment & Parts", contact: "+254 720 111 003", lastOrder: "5 Mar 2026", outstanding: "KES 0", status: "Active", rating: 4 },
  { id: "SUP-004", name: "Solar Kenya Solutions", category: "Solar Energy", contact: "+254 720 111 004", lastOrder: "1 Feb 2026", outstanding: "KES 85,000", status: "Active", rating: 5 },
  { id: "SUP-005", name: "KenyaFish Chemicals", category: "Water Treatment", contact: "+254 720 111 005", lastOrder: "20 Feb 2026", outstanding: "KES 0", status: "Inactive", rating: 3 },
  { id: "SUP-006", name: "Naivasha Fingerlings Hub", category: "Fingerlings", contact: "+254 720 111 006", lastOrder: "18 Mar 2026", outstanding: "KES 3,500", status: "Active", rating: 4 },
];

type Tab = "overview" | "stock" | "sales" | "reports" | "suppliers";
const DashboardOverviewTab = lazy(() => import("./dashboard/DashboardOverviewTab"));
const DashboardSalesChart = lazy(() => import("./dashboard/DashboardSalesChart"));

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export function Dashboard() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchSales, setSearchSales] = useState("");

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;

  // Colors for dark/light
  const bg = isDark ? "bg-gray-900" : "bg-gray-100";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-gray-100";
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const textSub = isDark ? "text-gray-300" : "text-gray-600";
  const headerBg = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const tableHover = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50";
  const divideColor = isDark ? "divide-gray-700" : "divide-gray-50";

  const navItems: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "stock", label: "Fish Stock", icon: Fish },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "suppliers", label: "Suppliers", icon: Package },
  ];

  const filteredSales = salesRecords.filter(s =>
    s.customer.toLowerCase().includes(searchSales.toLowerCase()) ||
    s.species.toLowerCase().includes(searchSales.toLowerCase())
  );

  return (
    <div className={`flex h-screen ${bg} pt-[98px] transition-colors duration-300`} style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? "w-56" : "w-14"} flex-shrink-0 flex flex-col z-20 fixed top-[98px] bottom-0 left-0 transition-all duration-300 ${isDark ? "bg-gray-900 border-r border-gray-800" : "bg-teal-900"
          }`}
      >
        <div className={`p-3 flex items-center justify-between border-b ${isDark ? "border-gray-800" : "border-teal-800"}`}>
          {sidebarOpen && <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Admin Panel</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-1 rounded-lg transition-colors ml-auto ${isDark ? "hover:bg-gray-800" : "hover:bg-teal-800"}`}
          >
            <ChevronRight size={16} className={`text-white transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* User info */}
        {sidebarOpen && (
          <div className={`px-3 py-3 border-b ${isDark ? "border-gray-800" : "border-teal-800"}`}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.avatar}
              </div>
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
                    ? isDark
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-teal-50 text-teal-700"
                    : isDark
                    ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                    : "text-teal-100 hover:bg-teal-800 hover:text-white"
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
        
        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <Suspense
              fallback={
                <div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}>
                  <p className={`text-sm ${textMuted}`}>Loading overview charts...</p>
                </div>
              }
            >
              <DashboardOverviewTab
                isDark={isDark}
                cardBg={cardBg}
                cardBorder={cardBorder}
                textPrimary={textPrimary}
                textMuted={textMuted}
                textSub={textSub}
              />
            </Suspense>

            {/* Alerts Section */}
            <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-xl ${isDark ? "bg-amber-900/30" : "bg-amber-50"}`}>
                  <Bell size={15} className="text-amber-500" />
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${textPrimary}`}>Alerts</h3>
                  <p className={`text-xs ${textMuted}`}>Requires attention</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { type: "warning", msg: "Pond RT-003: O₂ dropped to 5.2 mg/L. Check aerator.", priority: "High" },
                  { type: "info", msg: "Tilapia Batch TS-007 ready for harvest in 3 days.", priority: "Medium" },
                  { type: "success", msg: "Catfish fingerlings delivery confirmed — April 2.", priority: "Info" },
                  { type: "warning", msg: "AquaFeed Kenya invoice overdue 5 days — KES 22,000.", priority: "High" },
                ].map((alert, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${
                      alert.type === "warning"
                        ? isDark ? "bg-amber-900/20 border-amber-800/40" : "bg-amber-50 border-amber-200"
                        : alert.type === "success"
                        ? isDark ? "bg-green-900/20 border-green-800/40" : "bg-green-50 border-green-200"
                        : isDark ? "bg-blue-900/20 border-blue-800/40" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div>
                      <span className={`${isDark ? "text-gray-200" : "text-gray-700"} leading-relaxed`}>{alert.msg}</span>
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        alert.priority === "High" ? "bg-red-100 text-red-600" 
                        : alert.priority === "Medium" ? "bg-amber-100 text-amber-600" 
                        : "bg-blue-100 text-blue-600"
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

{/* ══ FISH STOCK TAB ══ */ }
{
  activeTab === "stock" && (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Fish Stock Management</h2>
          <p className={`text-sm ${textMuted}`}>All ponds — updated daily at 6:00 AM</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} /> Add Stock Record
        </button>
      </div>

      {/* Species Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {fishStock.map((fish, i) => (
          <div key={i} className={`rounded-2xl p-4 shadow-sm border text-center ${cardBg} ${cardBorder}`}>
            <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: fish.color + "20" }}>
              <Fish size={16} style={{ color: fish.color }} />
            </div>
            <p className={`font-semibold text-sm mb-1 ${textPrimary}`}>{fish.species.split(" ")[0]}</p>
            <p className="font-bold text-xl" style={{ color: fish.color }}>{(fish.totalKg / 1000).toFixed(1)}T</p>
            <p className={`text-xs ${textMuted}`}>{fish.pondCount} ponds</p>
            <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full ${fish.statusColor}`}>{fish.status}</span>
          </div>
        ))}
      </div>

      {/* Harvest Countdown */}
      <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${textPrimary}`}>
          <Calendar size={15} className="text-teal-500" /> Days to Harvest
        </h3>
        <div className="space-y-3">
          {fishStock.filter(f => f.daysToHarvest).map((fish, i) => {
            const maxDays = 70;
            const progress = 100 - ((fish.daysToHarvest! / maxDays) * 100);
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-28 flex-shrink-0">
                  <p className={`text-xs font-semibold ${textSub}`}>{fish.species.split(" ").slice(0, 2).join(" ")}</p>
                </div>
                <div className="flex-1">
                  <div className={`h-3 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{ width: `${progress}%`, backgroundColor: fish.color }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className={`text-xs font-bold ${fish.daysToHarvest! <= 20 ? "text-green-500" : fish.daysToHarvest! <= 35 ? "text-amber-500" : textMuted}`}>
                    {fish.daysToHarvest} days
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
          <button className={`flex items-center gap-1 text-xs transition-colors ${isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-700 hover:text-teal-600"}`}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                {["Batch ID", "Species", "Ponds", "Total Stock", "Avg Weight", "Health", "Days to Harvest", "Actions"].map((h) => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide ${textMuted}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divideColor}`}>
              {fishStock.map((fish, i) => (
                <tr key={i} className={`transition-colors ${tableHover}`}>
                  <td className={`px-4 py-3 text-xs font-mono ${textMuted}`}>{fish.id}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${textPrimary}`}>{fish.species}</td>
                  <td className={`px-4 py-3 text-sm ${textSub}`}>{fish.pondCount}</td>
                  <td className="px-4 py-3 text-sm font-bold text-teal-500">{fish.totalKg.toLocaleString()} kg</td>
                  <td className={`px-4 py-3 text-sm ${textSub}`}>{fish.avgWeight}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fish.statusColor}`}>{fish.healthStatus}</span>
                  </td>
                  <td className={`px-4 py-3 text-sm ${textSub}`}>{fish.daysToHarvest ? `${fish.daysToHarvest} days` : "Sport Fish"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}><Edit size={13} /></button>
                      <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

{/* ══ SALES TAB ══ */ }
{
  activeTab === "sales" && (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Sales Management</h2>
          <p className={`text-sm ${textMuted}`}>All sales records — March 2026</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} /> Record New Sale
        </button>
      </div>

      {/* Sales KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Revenue (Mar)", value: "KES 540,000", icon: DollarSign, color: "from-teal-500 to-teal-700" },
          { label: "Orders (Mar)", value: "47 orders", icon: Package, color: "from-blue-500 to-blue-700" },
          { label: "Pending Delivery", value: "7 orders", icon: Truck, color: "from-amber-500 to-amber-700" },
          { label: "Top Customer", value: "Nakuru Supermart", icon: Star, color: "from-green-500 to-green-700" },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={i} className={`bg-gradient-to-br ${k.color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden`}>
              <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full" />
              <Icon size={18} className="text-white/80 mb-3" />
              <p className="text-white/70 text-xs font-medium">{k.label}</p>
              <p className="text-white font-bold text-lg mt-0.5">{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Chart */}
      <Suspense
        fallback={
          <div className={`rounded-2xl p-6 border ${cardBg} ${cardBorder}`}>
            <p className={`text-sm ${textMuted}`}>Loading sales chart...</p>
          </div>
        }
      >
        <DashboardSalesChart
          isDark={isDark}
          cardBg={cardBg}
          cardBorder={cardBorder}
          textPrimary={textPrimary}
        />
      </Suspense>

      {/* Sales Table */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${cardBg} ${cardBorder}`}>
        <div className={`p-4 border-b flex items-center gap-3 ${cardBorder}`}>
          <Search size={15} className={textMuted} />
          <input
            type="text"
            placeholder="Search by customer or species..."
            value={searchSales}
            onChange={(e) => setSearchSales(e.target.value)}
            className={`flex-1 text-sm focus:outline-none bg-transparent ${textPrimary} placeholder:${textMuted}`}
          />
          <button className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
            <Filter size={11} /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                {["Invoice ID", "Date", "Customer", "Type", "Species", "Qty", "Amount", "Status", "Action"].map((h) => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${textMuted}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divideColor}`}>
              {filteredSales.map((s, i) => (
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
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === "Completed" ? "bg-green-100 text-green-700" :
                      s.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-blue-400 hover:bg-blue-900/30" : "text-blue-600 hover:bg-blue-50"}`}><Edit size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

{/* ══ REPORTS TAB ══ */ }
{
  activeTab === "reports" && (
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

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[
          { title: "Monthly Sales Report", desc: "Revenue, orders, and top customers for March 2026", date: "Mar 26, 2026", type: "Sales", gradient: "from-teal-500 to-teal-700", icon: TrendingUp },
          { title: "Fish Stock Report", desc: "Current stock, health status, and harvest forecast", date: "Mar 26, 2026", type: "Operations", gradient: "from-blue-500 to-blue-700", icon: Fish },
          { title: "Q1 2026 Financial Summary", desc: "Revenue, expenses, profit margins — Jan–Mar 2026", date: "Mar 26, 2026", type: "Finance", gradient: "from-emerald-500 to-emerald-700", icon: DollarSign },
          { title: "Water Quality Report", desc: "Pond health metrics, dissolved oxygen, pH levels", date: "Mar 25, 2026", type: "Health", gradient: "from-cyan-500 to-cyan-700", icon: Droplets },
          { title: "Supplier Performance Report", desc: "Delivery timelines, quality ratings, outstanding payments", date: "Mar 20, 2026", type: "Procurement", gradient: "from-amber-500 to-amber-700", icon: Truck },
          { title: "Community Outreach Impact", desc: "Farmers supported, fingerlings distributed, training sessions", date: "Mar 15, 2026", type: "Community", gradient: "from-purple-500 to-purple-700", icon: Users },
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

      {/* Quick Stats */}
      <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
        <h3 className={`font-semibold mb-4 ${textPrimary}`}>Q1 2026 Quick Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: "KES 1.37M", sub: "Jan–Mar 2026", color: "text-teal-500" },
            { label: "Fish Sold", value: "4,820 kg", sub: "All species", color: "text-blue-500" },
            { label: "New Customers", value: "23", sub: "First-time buyers", color: "text-green-500" },
            { label: "Training Sessions", value: "8", sub: "Conducted Q1", color: "text-amber-500" },
          ].map((s, i) => (
            <div key={i} className={`p-4 rounded-xl border ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
              <p className={`text-xs ${textMuted} mb-1`}>{s.label}</p>
              <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
              <p className={`text-xs ${textMuted} mt-0.5`}>{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

{/* ══ SUPPLIERS TAB ══ */ }
{
  activeTab === "suppliers" && (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Supplier Management</h2>
          <p className={`text-sm ${textMuted}`}>{suppliers.filter(s => s.status === "Active").length} active suppliers</p>
        </div>
        <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          <Plus size={15} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((sup, i) => (
          <div key={i} className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className={`font-semibold ${textPrimary}`}>{sup.name}</p>
                <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{sup.category}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sup.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{sup.status}</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={11} className={j < sup.rating ? "text-amber-400 fill-amber-400" : isDark ? "text-gray-600" : "text-gray-200"} />
              ))}
            </div>
            <div className={`space-y-1.5 text-xs ${textSub}`}>
              <div className="flex justify-between"><span className={textMuted}>Contact</span><span>{sup.contact}</span></div>
              <div className="flex justify-between"><span className={textMuted}>Last Order</span><span>{sup.lastOrder}</span></div>
              <div className="flex justify-between">
                <span className={textMuted}>Outstanding</span>
                <span className={sup.outstanding !== "KES 0" ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>{sup.outstanding}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className={`flex-1 text-xs py-1.5 rounded-lg border font-medium transition-colors ${isDark ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                Contact
              </button>
              <button className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-colors ${isDark ? "bg-teal-700 hover:bg-teal-600" : "bg-teal-50 hover:bg-teal-100"} text-teal-700`}>
                New Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
        </div >
      </div >
    </div >
  );
}
