import { useState, useEffect } from "react";
import {
    Activity,
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    Bell,
    CheckCircle,
    DollarSign,
    Droplets,
    Fish,
    Package,
    RefreshCw,
    TrendingUp,
    Check,
    Radio,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { fetchOverviewAnalytics, fetchAlerts, markAlertRead, triggerAlertScan } from "../../services/api";

const defaultSalesData = [
    { month: "Oct", tilapia: 180, catfish: 95, trout: 40, carp: 30 },
    { month: "Nov", tilapia: 220, catfish: 110, trout: 55, carp: 25 },
    { month: "Dec", tilapia: 310, catfish: 140, trout: 70, carp: 45 },
    { month: "Jan", tilapia: 290, catfish: 125, trout: 60, carp: 40 },
    { month: "Feb", tilapia: 330, catfish: 155, trout: 80, carp: 50 },
    { month: "Mar", tilapia: 380, catfish: 175, trout: 90, carp: 55 },
];

const defaultRevenueData = [
    { month: "Oct", revenue: 285000, target: 300000, expenses: 142000 },
    { month: "Nov", revenue: 342000, target: 320000, expenses: 165000 },
    { month: "Dec", revenue: 510000, target: 450000, expenses: 198000 },
    { month: "Jan", revenue: 420000, target: 400000, expenses: 174000 },
    { month: "Feb", revenue: 465000, target: 430000, expenses: 182000 },
    { month: "Mar", revenue: 540000, target: 500000, expenses: 205000 },
];

const defaultStockDistribution = [
    { name: "Tilapia", value: 42, fill: "#0d9488" },
    { name: "Catfish", value: 28, fill: "#f59e0b" },
    { name: "Trout", value: 12, fill: "#3b82f6" },
    { name: "Carp", value: 10, fill: "#10b981" },
    { name: "Lungfish", value: 5, fill: "#8b5cf6" },
    { name: "Bass", value: 3, fill: "#ef4444" },
];

const defaultWaterQuality = [
    { name: "pH Level", value: 7.2, unit: "", min: 6.5, max: 8.5, ideal: 7.0, status: "Good", color: "#0d9488" },
    { name: "Dissolved O2", value: 6.8, unit: "mg/L", min: 5, max: 9, ideal: 7.0, status: "Good", color: "#3b82f6" },
    { name: "Temperature", value: 24, unit: "degC", min: 20, max: 30, ideal: 25, status: "Good", color: "#f59e0b" },
    { name: "Ammonia", value: 0.2, unit: "ppm", min: 0, max: 0.5, ideal: 0, status: "Normal", color: "#10b981" },
];

const defaultActivityFeed = [
    { time: "08:42 AM", action: "Pond TS-007 water quality checked", type: "check", user: "John M." },
    { time: "07:15 AM", action: "85kg Tilapia delivered to Nakuru Supermart", type: "sale", user: "Grace W." },
    { time: "Yesterday", action: "500 Tilapia fingerlings sold to James Kamau", type: "sale", user: "John M." },
    { time: "Yesterday", action: "RT-003 aerator serviced - O2 back to normal", type: "maintenance", user: "Tech Team" },
    { time: "2 days ago", action: "New supplier quote received from AquaFeed Kenya", type: "supplier", user: "System" },
    { time: "2 days ago", action: "Monthly revenue target exceeded by 8%", type: "achievement", user: "System" },
];

const defaultRevenueByChannel = [
    { channel: "Wholesale", value: 48, color: "#0d9488", kes: "KES 259,200" },
    { channel: "Hotel/Restaurant", value: 22, color: "#f59e0b", kes: "KES 118,800" },
    { channel: "Retail", value: 18, color: "#3b82f6", kes: "KES 97,200" },
    { channel: "Corporate", value: 8, color: "#10b981", kes: "KES 43,200" },
    { channel: "Farmer/Fingerlings", value: 4, color: "#8b5cf6", kes: "KES 21,600" },
];

type DashboardOverviewTabProps = {
    isDark: boolean;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
    textMuted: string;
    textSub: string;
};

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
    if (!active || !payload?.length) return null;

    return (
        <div className={`rounded-xl p-3 shadow-xl border text-sm ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-100 text-gray-800"}`}>
            <p className="font-semibold mb-1.5 text-xs opacity-70">{label}</p>
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <span className="text-xs">
                        {p.name}: <strong>{typeof p.value === "number" && p.value > 1000 ? `KES ${p.value.toLocaleString()}` : p.value}</strong>
                    </span>
                </div>
            ))}
        </div>
    );
};

function KpiCard({ title, value, change, up, icon: Icon, gradient, sparkData }: any) {
    return (
        <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-lg`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-2 -top-8 w-16 h-16 bg-white/10 rounded-full" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-white/80 text-xs font-semibold uppercase tracking-wide">{title}</p>
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Icon size={16} className="text-white" />
                    </div>
                </div>
                <p className="text-white font-bold text-2xl mb-1">{value}</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${up === true ? "text-green-200" : up === false ? "text-red-200" : "text-white/70"}`}>
                    {up === true && <ArrowUpRight size={13} />}
                    {up === false && <ArrowDownRight size={13} />}
                    <span>{change}</span>
                </div>
                {sparkData && (
                    <div className="mt-3 h-8">
                        <ResponsiveContainer width="100%" height={32}>
                            <LineChart data={sparkData}>
                                <Line type="monotone" dataKey="v" stroke="rgba(255,255,255,0.6)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}

function WaterGauge({ metric, isDark }: { metric: typeof defaultWaterQuality[0]; isDark: boolean }) {
    const pct = Math.min(100, Math.max(0, ((metric.value - metric.min) / (metric.max - metric.min)) * 100));

    return (
        <div className={`p-4 rounded-2xl border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>{metric.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${metric.status === "Good" || metric.status === "Normal" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {metric.status}
                </span>
            </div>
            <div className={`text-xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                {metric.value}<span className="text-xs font-normal opacity-60 ml-1">{metric.unit}</span>
            </div>
            <div className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: metric.color }} />
            </div>
            <div className={`flex justify-between text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                <span>{metric.min}{metric.unit}</span>
                <span>{metric.max}{metric.unit}</span>
            </div>
        </div>
    );
}

export default function DashboardOverviewTab({
    isDark,
    cardBg,
    cardBorder,
    textPrimary,
    textMuted,
    textSub,
}: DashboardOverviewTabProps) {
    const [analytics, setAnalytics] = useState<any>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [analyticsData, alertsData] = await Promise.all([
                fetchOverviewAnalytics(),
                fetchAlerts(),
            ]);
            if (analyticsData) setAnalytics(analyticsData);
            if (alertsData) setAlerts(alertsData);
        } catch (e) {
            console.error("Failed to load live overview data", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDismissAlert = async (id: string) => {
        try {
            await markAlertRead(id);
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            console.error("Failed to dismiss alert:", err);
        }
    };

    const handleManualScan = async () => {
        setIsScanning(true);
        try {
            await triggerAlertScan();
            const freshAlerts = await fetchAlerts();
            setAlerts(freshAlerts);
        } catch (err) {
            console.error("Scan error:", err);
        } finally {
            setIsScanning(false);
        }
    };

    const kpiRaw = analytics?.kpis;
    const revenueData = analytics?.revenueData || defaultRevenueData;
    const revenueByChannel = analytics?.revenueByChannel || defaultRevenueByChannel;
    const salesData = analytics?.salesData || defaultSalesData;
    const stockDistribution = analytics?.stockDistribution || defaultStockDistribution;
    const waterQuality = analytics?.waterQuality || defaultWaterQuality;
    const activityFeed = analytics?.activityFeed || defaultActivityFeed;

    const kpiData = [
        {
            title: "Revenue (Month)",
            value: kpiRaw ? `KES ${kpiRaw.totalRevenueMonth.toLocaleString()}` : "KES 540,000",
            change: `+${kpiRaw?.revenueGrowth ?? 12.4}% vs last month`,
            up: true,
            icon: DollarSign,
            gradient: "bg-gradient-to-br from-teal-600 to-teal-800",
            sparkData: revenueData.map((d: any) => ({ v: d.revenue / 1000 })),
        },
        {
            title: "Fish Sold (Volume)",
            value: `${(kpiRaw?.fishSoldKg ?? 1680).toLocaleString()} kg`,
            change: `+${kpiRaw?.salesGrowth ?? 8.2}% vs last month`,
            up: true,
            icon: Package,
            gradient: "bg-gradient-to-br from-blue-600 to-blue-800",
            sparkData: salesData.map((d: any) => ({ v: d.tilapia + d.catfish })),
        },
        {
            title: "Active Ponds",
            value: `${kpiRaw?.activePonds ?? 31} / 36`,
            change: "86% capacity utilized",
            up: null,
            icon: Droplets,
            gradient: "bg-gradient-to-br from-emerald-600 to-emerald-800",
        },
        {
            title: "Orders Pending Verification",
            value: `${kpiRaw?.pendingOrders ?? 0}`,
            change: "Requires fulfillment",
            up: false,
            icon: Activity,
            gradient: "bg-gradient-to-br from-amber-600 to-amber-800",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`font-bold text-xl ${textPrimary}`}>Farm Overview & Telemetry</h2>
                    <p className={`text-sm ${textMuted}`}>Live aquaculture telemetry, financials, and automated alert monitoring</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleManualScan}
                        disabled={isScanning}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isDark ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                        }`}
                    >
                        <Radio size={14} className={`text-teal-500 ${isScanning ? "animate-pulse" : ""}`} />
                        {isScanning ? "Scanning Farm..." : "Scan Telemetry"}
                    </button>
                    <button
                        onClick={loadData}
                        className={`p-2 rounded-xl border transition-all ${
                            isDark ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                        }`}
                    >
                        <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiData.map((k, i) => (
                    <KpiCard key={i} {...k} />
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 rounded-2xl p-6 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`font-bold text-base ${textPrimary}`}>Revenue vs Target</h3>
                            <p className={`text-xs ${textMuted}`}>Monthly financial performance (KES)</p>
                        </div>
                        <span className="text-xs bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-semibold px-2.5 py-1 rounded-full">
                            Target +8%
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f3f4f6"} />
                            <XAxis dataKey="month" stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} />
                            <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={11} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                            <Tooltip content={<CustomTooltip isDark={isDark} />} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                            <Bar dataKey="revenue" fill="#0d9488" name="Actual Revenue" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="target" fill={isDark ? "#374151" : "#e5e7eb"} name="Monthly Target" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={`rounded-2xl p-6 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="mb-4">
                        <h3 className={`font-bold text-base ${textPrimary}`}>Stock by Species</h3>
                        <p className={`text-xs ${textMuted}`}>Current biomass breakdown (%)</p>
                    </div>
                    <ResponsiveContainer width="100%" height={190}>
                        <PieChart>
                            <Pie data={stockDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                {stockDistribution.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip isDark={isDark} />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-3 gap-1.5 mt-2">
                        {stockDistribution.map((s: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                                <span className={`text-[11px] truncate ${textSub}`}>{s.name} {s.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Water Quality Telemetry Section */}
            <div className={`rounded-2xl p-6 shadow-sm border ${cardBg} ${cardBorder}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Droplets size={16} className="text-teal-500" />
                        <h3 className={`font-bold text-base ${textPrimary}`}>Water Quality Live Telemetry</h3>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live IoT Sensors
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {waterQuality.map((m: any, i: number) => (
                        <WaterGauge key={i} metric={m} isDark={isDark} />
                    ))}
                </div>
            </div>

            {/* Bottom Row: Activity Feed & Dynamic Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Feed */}
                <div className={`rounded-2xl p-6 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold text-base ${textPrimary}`}>Live Farm Activity Feed</h3>
                        <Activity size={15} className="text-teal-500" />
                    </div>
                    <div className="space-y-3">
                        {activityFeed.map((a: any, i: number) => (
                            <div key={i} className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${isDark ? "bg-gray-800/60 border-gray-700" : "bg-gray-50/70 border-gray-100"}`}>
                                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className={`font-medium ${textPrimary}`}>{a.action}</p>
                                    <p className={`text-[11px] mt-0.5 ${textMuted}`}>{a.time} · {a.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Phase 13: Dynamic Alerts & Operational Thresholds */}
                <div className={`rounded-2xl p-6 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl ${isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
                                <Bell size={16} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-base ${textPrimary}`}>Dynamic Alerts & Thresholds</h3>
                                <p className={`text-xs ${textMuted}`}>{alerts.length} active notification(s)</p>
                            </div>
                        </div>
                        {alerts.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 animate-pulse">
                                {alerts.length} Active
                            </span>
                        )}
                    </div>

                    <div className="space-y-3">
                        {alerts.length === 0 ? (
                            <div className={`p-6 rounded-xl border text-center ${isDark ? "bg-gray-800/40 border-gray-700" : "bg-green-50/50 border-green-200"}`}>
                                <CheckCircle size={28} className="text-green-500 mx-auto mb-2" />
                                <p className={`text-sm font-semibold ${textPrimary}`}>All Systems Optimal</p>
                                <p className={`text-xs ${textMuted} mt-0.5`}>No pond telemetry anomalies or overdue financial invoices detected.</p>
                            </div>
                        ) : (
                            alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border text-xs transition-all ${
                                        alert.priority === "CRITICAL"
                                            ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40"
                                            : alert.priority === "HIGH" || alert.type === "warning"
                                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40"
                                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40"
                                    }`}
                                >
                                    <div className="flex items-start gap-2.5">
                                        {alert.priority === "CRITICAL" || alert.priority === "HIGH" ? (
                                            <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                        ) : alert.type === "success" ? (
                                            <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <Bell size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div>
                                            <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-800"} leading-relaxed`}>{alert.message}</p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span
                                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        alert.priority === "CRITICAL"
                                                            ? "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200"
                                                            : alert.priority === "HIGH"
                                                            ? "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200"
                                                            : "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                                                    }`}
                                                >
                                                    {alert.priority}
                                                </span>
                                                <span className={`text-[10px] ${textMuted}`}>
                                                    {new Date(alert.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDismissAlert(alert.id)}
                                        title="Dismiss Alert"
                                        className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors flex-shrink-0"
                                    >
                                        <Check size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
