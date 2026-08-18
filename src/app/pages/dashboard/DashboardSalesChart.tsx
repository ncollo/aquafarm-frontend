import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DashboardSalesChartProps = {
    isDark: boolean;
    cardBg: string;
    cardBorder: string;
    textPrimary: string;
};

const salesData = [
    { month: "Oct", tilapia: 180, catfish: 95, trout: 40, carp: 30 },
    { month: "Nov", tilapia: 220, catfish: 110, trout: 55, carp: 25 },
    { month: "Dec", tilapia: 310, catfish: 140, trout: 70, carp: 45 },
    { month: "Jan", tilapia: 290, catfish: 125, trout: 60, carp: 40 },
    { month: "Feb", tilapia: 330, catfish: 155, trout: 80, carp: 50 },
    { month: "Mar", tilapia: 380, catfish: 175, trout: 90, carp: 55 },
];

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

export default function DashboardSalesChart({ isDark, cardBg, cardBorder, textPrimary }: DashboardSalesChartProps) {
    return (
        <div className={`rounded-2xl p-5 shadow-sm border ${cardBg} ${cardBorder}`}>
            <h3 className={`font-semibold mb-4 ${textPrimary}`}>Sales Volume by Species (kg)</h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#f0f0f0"} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }} />
                    <YAxis tick={{ fontSize: 11, fill: isDark ? "#9ca3af" : "#6b7280" }} />
                    <Tooltip content={<CustomTooltip isDark={isDark} />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="tilapia" fill="#0d9488" name="Tilapia (kg)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="catfish" fill="#f59e0b" name="Catfish (kg)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="trout" fill="#3b82f6" name="Trout (kg)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="carp" fill="#10b981" name="Carp (kg)" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
