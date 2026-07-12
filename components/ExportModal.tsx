"use client";

/**
 * ExportModal — Editor → Export → Preview → Download (PNG / JPG / PDF / MP4 / ZIP)
 *
 * Drop into app/editor/page.tsx:
 *   import { ExportModal } from "@/components/ExportModal";
 *   const [exportOpen, setExportOpen] = useState(false);
 *   <button onClick={() => setExportOpen(true)}>Export</button>
 *   {exportOpen && (
 *     <ExportModal
 *       flyer={flyer}
 *       activeFormat={activeFormat}
 *       onClose={() => setExportOpen(false)}
 *     />
 *   )}
 *
 * Talks to the Python backend (see backend/main.py) at NEXT_PUBLIC_RENDER_API.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X, Download, ImageIcon, FileText, Film, Package, Loader2, Check,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_RENDER_API || "http://localhost:8000";

type ExportKind = "png" | "jpg" | "pdf" | "mp4" | "zip";

type ExportJob = {
  kind: ExportKind;
  status: "idle" | "rendering" | "done" | "error";
  progress: number;
  url?: string;
  error?: string;
};

const EXPORT_OPTIONS: { kind: ExportKind; label: string; desc: string; icon: any }[] = [
  { kind: "png", label: "Download PNG",  desc: "Lossless, transparent-ready flyer image", icon: ImageIcon },
  { kind: "jpg", label: "Download JPG",  desc: "Smaller file, great for direct posting",   icon: ImageIcon },
  { kind: "pdf", label: "Download PDF",  desc: "Print-ready, single page",                  icon: FileText  },
  { kind: "mp4", label: "Download MP4",  desc: "Rendered Ken Burns promo video",            icon: Film      },
  { kind: "zip", label: "Download ZIP",  desc: "One-click complete package — all formats",  icon: Package   },
];

export function ExportModal({
  flyer, activeFormat, onClose,
}: {
  flyer: any;
  activeFormat: string;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<"preview" | "exporting">("preview");
  const [jobs, setJobs] = useState<Record<ExportKind, ExportJob>>({
    png: { kind: "png", status: "idle", progress: 0 },
    jpg: { kind: "jpg", status: "idle", progress: 0 },
    pdf: { kind: "pdf", status: "idle", progress: 0 },
    mp4: { kind: "mp4", status: "idle", progress: 0 },
    zip: { kind: "zip", status: "idle", progress: 0 },
  });
  const pollRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => () => {
    Object.values(pollRef.current).forEach(clearInterval);
  }, []);

  const setJob = (kind: ExportKind, patch: Partial<ExportJob>) =>
    setJobs(prev => ({ ...prev, [kind]: { ...prev[kind], ...patch } }));

  async function startExport(kind: ExportKind) {
    setStage("exporting");
    setJob(kind, { status: "rendering", progress: 5, error: undefined });
    try {
      const res = await fetch(`${API_BASE}/export/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flyer, format: activeFormat }),
      });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const { job_id } = await res.json();

      pollRef.current[kind] = setInterval(async () => {
        const s = await fetch(`${API_BASE}/export/status/${job_id}`).then(r => r.json());
        setJob(kind, { progress: s.progress ?? 0 });
        if (s.status === "done") {
          clearInterval(pollRef.current[kind]);
          setJob(kind, { status: "done", progress: 100, url: s.download_url });
        } else if (s.status === "error") {
          clearInterval(pollRef.current[kind]);
          setJob(kind, { status: "error", error: s.error || "Render failed" });
        }
      }, 1200);
    } catch (err: any) {
      setJob(kind, { status: "error", error: err.message });
    }
  }

  function downloadUrl(kind: ExportKind, url: string) {
    const a = document.createElement("a");
    a.href = url.startsWith("http") ? url : `${API_BASE}${url}`;
    a.download = "";
    a.click();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        className="w-full max-w-[860px] max-h-[88vh] bg-[#111113] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-zinc-100">Export</h2>
            <p className="text-[11px] text-zinc-500">Preview your flyer, then choose what to download.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-zinc-800 flex items-center justify-center">
            <X size={16} className="text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-5">

          {/* Preview pane */}
          <div className="flex items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl p-6 min-h-[320px]">
            {flyer.productImage ? (
              <div className="relative max-w-full max-h-[420px] rounded-lg overflow-hidden shadow-2xl"
                style={{ background: flyer.colors?.primary || "#0a0a0a" }}>
                <img src={flyer.productImage} alt="preview" className="max-h-[420px] object-contain opacity-90" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div style={{ color: flyer.colors?.accent || "#c9a84c" }} className="text-2xl font-black">{flyer.price}</div>
                  <div style={{ color: flyer.colors?.secondary || "#fff" }} className="text-sm font-semibold">{flyer.headline}</div>
                </div>
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">No preview available yet</p>
            )}
          </div>

          {/* Options list */}
          <div className="flex flex-col gap-2">
            {EXPORT_OPTIONS.map(opt => {
              const job = jobs[opt.kind];
              const Icon = opt.icon;
              return (
                <button
                  key={opt.kind}
                  onClick={() => job.status === "done" ? downloadUrl(opt.kind, job.url!) : startExport(opt.kind)}
                  disabled={job.status === "rendering"}
                  className={`text-left px-3.5 py-3 rounded-xl border flex items-center gap-3 transition-colors
                    ${opt.kind === "zip"
                      ? "border-cyan-400/60 bg-cyan-950/20 hover:bg-cyan-950/30"
                      : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900"}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                    ${opt.kind === "zip" ? "bg-cyan-400/20 text-cyan-400" : "bg-zinc-800 text-zinc-400"}`}>
                    {job.status === "rendering"
                      ? <Loader2 size={15} className="animate-spin" />
                      : job.status === "done"
                        ? <Check size={15} className="text-emerald-400" />
                        : <Icon size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-bold text-zinc-200">{opt.label}</div>
                    <div className="text-[10.5px] text-zinc-500 truncate">
                      {job.status === "rendering" ? `Rendering… ${job.progress}%`
                        : job.status === "error" ? job.error
                        : job.status === "done" ? "Ready — click to download"
                        : opt.desc}
                    </div>
                    {job.status === "rendering" && (
                      <div className="mt-1.5 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 transition-all" style={{ width: `${job.progress}%` }} />
                      </div>
                    )}
                  </div>
                  <Download size={13} className="text-zinc-600 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ExportModal;
