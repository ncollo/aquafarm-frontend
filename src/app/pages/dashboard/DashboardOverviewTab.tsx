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
import { fetchOverviewAnalytics } from "../../services/api";

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
    const [isLoading, setIsLoading] = useState(false);

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const data = await fetchOverviewAnalytics();
            if (data) setAnalytics(data);
        } catch (e) {
            console.error("Failed to load live analytics", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

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
            icon: Fish,
            gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
            sparkData: salesData.map((d: any) => ({ v: (d.tilapia || 0) + (d.catfish || 0) })),
        },
        {
            title: "Active Ponds",
            value: `${kpiRaw?.activePonds ?? 31} / ${kpiRaw?.totalPonds ?? 32}`,
            change: `${(kpiRaw?.totalPonds ?? 32) - (kpiRaw?.activePonds ?? 31)} under maintenance`,
            up: null,
            icon: Activity,
            gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700",
            sparkData: null,
        },
        {
            title: "Pending Orders",
            value: `${kpiRaw?.pendingOrders ?? 7} orders`,
            change: "Requires dispatch/processing",
            up: false,
            icon: Package,
            gradient: "bg-gradient-to-br from-amber-500 to-amber-700",
            sparkData: null,
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`font-bold text-xl ${textPrimary}`}>Farm Operations Analytics</h2>
                    <p className={`text-sm ${textMuted}`}>Real-time PostgreSQL analytics & telemetry</p>
                </div>
                <button
                    onClick={loadAnalytics}
                    title="Refresh Live Analytics"
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition-colors ${
                        isDark ? "border-gray-700 text-gray-300 hover:bg-gray-700" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                    <RefreshCw size={13} className={isLoading ? "animate-spin text-teal-500" : ""} />
                    <span>Sync Live Data</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {kpiData.map((card, i) => (
                    <KpiCard key={i} {...card} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className={`lg:col-span-3 rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className={`font-semibold ${textPrimary}`}>Revenue vs Target</h3>
                            <p className={`text-xs ${textMuted}`}>6-month performance overview</p>
                        </div>
                        <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium ${isDark ? "bg-teal-900/40 text-teal-400" : "bg-teal-50 text-teal-700"}`}>
                            <TrendingUp size={12} /> +{kpiRaw?.revenueGrowth ?? 12.4}% MoM
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={230}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f0f0f0"} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }} />
                            <YAxis tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }} tickFormatter={(v) => `${v / 1000}k`} />
                            <Tooltip content={<CustomTooltip isDark={isDark} />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#0d9488" fill="url(#revGrad)" strokeWidth={2.5} name="Revenue (KES)" />
                            <Area type="monotone" dataKey="target" stroke="#f59e0b" fill="url(#targetGrad)" strokeWidth={2} strokeDasharray="6 3" name="Target (KES)" />
                            <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#expGrad)" strokeWidth={1.5} name="Expenses (KES)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className={`lg:col-span-2 rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <h3 className={`font-semibold mb-1 ${textPrimary}`}>Revenue by Channel</h3>
                    <p className={`text-xs ${textMuted} mb-4`}>Current financial breakdown</p>
                    <div className="space-y-3">
                        {revenueByChannel.map((ch: any, i: number) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-xs font-medium ${textSub}`}>{ch.channel}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold ${textPrimary}`}>{ch.value}%</span>
                                        <span className={`text-xs ${textMuted}`}>{ch.kes}</span>
                                    </div>
                                </div>
                                <div className={`h-2 rounded-full ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${ch.value}%`, backgroundColor: ch.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className={`lg:col-span-3 rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <h3 className={`font-semibold mb-1 ${textPrimary}`}>Sales Volume by Species (kg)</h3>
                    <p className={`text-xs ${textMuted} mb-4`}>Monthly comparison - all species</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={salesData} barGap={2}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f0f0f0"} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }} />
                            <YAxis tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }} />
                            <Tooltip content={<CustomTooltip isDark={isDark} />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="tilapia" fill="#0d9488" name="Tilapia" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="catfish" fill="#f59e0b" name="Catfish" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="trout" fill="#3b82f6" name="Trout" radius={[3, 3, 0, 0]} />
                            <Bar dataKey="carp" fill="#10b981" name="Carp" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={`lg:col-span-2 rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <h3 className={`font-semibold mb-1 ${textPrimary}`}>Stock Distribution</h3>
                    <p className={`text-xs ${textMuted} mb-2`}>% by species in biomass</p>
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie
                                data={stockDistribution}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={72}
                                paddingAngle={3}
                            >
                                {stockDistribution.map((entry: any, i: number) => (
                                    <Cell key={i} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: isDark ? "#1f2937" : "#fff", border: "none", borderRadius: 12, fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                        {stockDistribution.map((s: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                                <span className={`text-xs ${textMuted} truncate`}>
                                    {s.name} <strong className={textSub}>{s.value}%</strong>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 rounded-xl ${isDark ? "bg-blue-900/40" : "bg-blue-50"}`}>
                            <Droplets size={15} className="text-blue-500" />
                        </div>
                        <div>
                            <h3 className={`font-semibold text-sm ${textPrimary}`}>Water Quality</h3>
                            <p className={`text-xs ${textMuted}`}>Live telemetry from active ponds</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {waterQuality.map((m: any, i: number) => (
                            <WaterGauge key={i} metric={m} isDark={isDark} />
                        ))}
                    </div>
                </div>

                <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 rounded-xl ${isDark ? "bg-purple-900/40" : "bg-purple-50"}`}>
                            <Activity size={15} className="text-purple-500" />
                        </div>
                        <div>
                            <h3 className={`font-semibold text-sm ${textPrimary}`}>Recent Activity</h3>
                            <p className={`text-xs ${textMuted}`}>Latest farm & transaction events</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {activityFeed.map((a: any, i: number) => (
                            <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${a.type === "sale"
                                            ? "bg-teal-500"
                                            : a.type === "maintenance"
                                                ? "bg-amber-500"
                                                : a.type === "achievement"
                                                    ? "bg-green-500"
                                                    : a.type === "supplier"
                                                        ? "bg-blue-500"
                                                        : "bg-gray-400"
                                        }`} />
                                    {i < activityFeed.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${isDark ? "bg-gray-700" : "bg-gray-100"}`} />}
                                </div>
                                <div className="pb-3 flex-1 min-w-0">
                                    <p className={`text-xs leading-relaxed ${textSub}`}>{a.action}</p>
                                    <div className={`flex items-center gap-2 mt-0.5 text-xs ${textMuted}`}>
                                        <span>{a.time}</span>
                                        <span>·</span>
                                        <span>{a.user}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 rounded-xl ${isDark ? "bg-amber-900/30" : "bg-amber-50"}`}>
                            <Bell size={15} className="text-amber-500" />
                        </div>
                        <div>
                            <h3 className={`font-semibold text-sm ${textPrimary}`}>Alerts & Thresholds</h3>
                            <p className={`text-xs ${textMuted}`}>Requires attention</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { type: "warning", msg: "Pond RT-003: O2 dropped to 5.2 mg/L. Check aerator.", priority: "High" },
                            { type: "info", msg: "Tilapia Batch ready for harvest in 3 days.", priority: "Medium" },
                            { type: "success", msg: "All pond telemetry connected to database.", priority: "Info" },
                            { type: "warning", msg: "Supplier payments reconciliation pending.", priority: "Medium" },
                        ].map((alert, i) => (
                            <div
                                key={i}
                                className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs ${alert.type === "warning"
                                        ? isDark
                                            ? "bg-amber-900/20 border-amber-800/40"
                                            : "bg-amber-50 border-amber-200"
                                        : alert.type === "success"
                                            ? isDark
                                                ? "bg-green-900/20 border-green-800/40"
                                                : "bg-green-50 border-green-200"
                                            : isDark
                                                ? "bg-blue-900/20 border-blue-800/40"
                                                : "bg-blue-50 border-blue-200"
                                    }`}
                            >
                                {alert.type === "warning" ? (
                                    <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                ) : alert.type === "success" ? (
                                    <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                    <Bell size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <span className={`${isDark ? "text-gray-200" : "text-gray-700"} leading-relaxed`}>{alert.msg}</span>
                                    <span
                                        className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${alert.priority === "High"
                                                ? "bg-red-100 text-red-600"
                                                : alert.priority === "Medium"
                                                    ? "bg-amber-100 text-amber-600"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                    >
                                        {alert.priority}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
