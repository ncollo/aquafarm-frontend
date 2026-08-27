import { useState } from "react";
import {
  Download, TrendingUp, Fish, DollarSign, Droplets,
  CheckCircle2, RefreshCw, FileSpreadsheet, ShieldAlert
} from "lucide-react";
import { downloadReportPdf } from "../../services/api";

interface DashboardReportsTabProps {
  isDark: boolean;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  textSub: string;
}

export default function DashboardReportsTab({
  isDark, cardBg, cardBorder, textPrimary, textMuted, textSub
}: DashboardReportsTabProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDownload = async (id: string, endpoint: string, filename: string, title: string) => {
    setDownloadingId(id);
    setStatusMessage(null);
    try {
      await downloadReportPdf(endpoint, filename);
      setStatusMessage({ type: "success", text: `${title} successfully downloaded!` });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error: any) {
      setStatusMessage({ type: "error", text: error.message || "Failed to download document" });
    } finally {
      setDownloadingId(null);
    }
  };

  const reports = [
    {
      id: "sales",
      title: "Commercial Sales Report",
      desc: "Detailed ledger of invoices, line items, customers, and payment methods.",
      type: "Sales & Revenue",
      endpoint: "sales/pdf",
      filename: "aquafarm-sales-report.pdf",
      gradient: "from-teal-500 to-teal-700",
      icon: TrendingUp,
    },
    {
      id: "stock",
      title: "Fish Stock & Biomass Report",
      desc: "Live inventory of all active fish batches, pond allocation, and days to harvest.",
      type: "Operations",
      endpoint: "stock/pdf",
      filename: "aquafarm-stock-report.pdf",
      gradient: "from-blue-500 to-blue-700",
      icon: Fish,
    },
    {
      id: "financial",
      title: "Quarterly Financial Summary",
      desc: "Audited revenue channels, supplier debt balances, and estimated profit margins.",
      type: "Finance & Audit",
      endpoint: "financial/pdf",
      filename: "aquafarm-financial-summary.pdf",
      gradient: "from-emerald-500 to-emerald-700",
      icon: DollarSign,
    },
    {
      id: "water-quality",
      title: "Water Quality Compliance Report",
      desc: "Pond telemetry readings (pH, Dissolved Oxygen, Temp, Ammonia) for aquaculture compliance.",
      type: "Health & Safety",
      endpoint: "water-quality/pdf",
      filename: "aquafarm-water-quality-report.pdf",
      gradient: "from-cyan-500 to-cyan-700",
      icon: Droplets,
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* ── Header & Master Export ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-bold text-xl ${textPrimary}`}>Reports & Document Generation Hub</h2>
          <p className={`text-sm ${textMuted}`}>Instant PDF generation and farm compliance audit streaming</p>
        </div>
        <button
          onClick={() => handleDownload("export-all", "export-all/pdf", "aquafarm-master-operations-export.pdf", "Master Operations Export")}
          disabled={downloadingId === "export-all"}
          className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border transition-all shadow-md ${
            isDark
              ? "bg-teal-900/40 border-teal-700 text-teal-300 hover:bg-teal-900/70"
              : "bg-teal-700 border-teal-800 text-white hover:bg-teal-600"
          }`}
        >
          {downloadingId === "export-all" ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <FileSpreadsheet size={15} />
          )}
          <span>Export All Master Audit (PDF)</span>
        </button>
      </div>

      {/* ── Status Message Toast ── */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm transition-all duration-300 ${
            statusMessage.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800"
              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800"
          }`}
        >
          {statusMessage.type === "success" ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* ── Report Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((r) => {
          const Icon = r.icon;
          const isDownloading = downloadingId === r.id;

          return (
            <div
              key={r.id}
              className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-200 hover:shadow-lg ${cardBg} ${cardBorder} flex flex-col justify-between`}
            >
              <div>
                <div className={`bg-gradient-to-r ${r.gradient} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">{r.type}</span>
                      <p className="text-white font-bold text-base leading-tight mt-0.5">{r.title}</p>
                    </div>
                  </div>
                  <span className="text-white/70 text-xs font-mono bg-black/15 px-2.5 py-1 rounded-lg">PDF</span>
                </div>

                <div className="p-5">
                  <p className={`text-sm ${textSub} leading-relaxed mb-4`}>{r.desc}</p>
                </div>
              </div>

              <div className={`px-5 py-4 border-t ${cardBorder} flex items-center justify-between`}>
                <span className={`text-xs ${textMuted}`}>Formatted A4 Document</span>
                <button
                  onClick={() => handleDownload(r.id, r.endpoint, r.filename, r.title)}
                  disabled={isDownloading}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors ${
                    isDark
                      ? "text-teal-400 hover:bg-teal-950/60 bg-teal-900/20"
                      : "text-teal-700 hover:bg-teal-100 bg-teal-50"
                  }`}
                >
                  {isDownloading ? (
                    <RefreshCw size={13} className="animate-spin text-teal-500" />
                  ) : (
                    <Download size={13} />
                  )}
                  <span>{isDownloading ? "Streaming PDF..." : "Download PDF"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
