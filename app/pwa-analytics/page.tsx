"use client";

import { useEffect, useState } from "react";
import { fetchPWAAnalytics } from "@/lib/pwa/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

interface AnalyticsResponse {
  summary: {
    total_installs: number;
    active_installs: number;
    lost_signal_installs: number; // "uninstalls" (best-effort, no heartbeat in N days)
    dau: number;
    pwa_users: number;
    browser_users: number;
  };
  daily: { date: string; dau: number; installs: number }[];
  by_device_type: { device_type: string; count: number }[];
  by_os: { os: string; count: number }[];
  by_country: { country: string; count: number }[];
  recent: {
    device_id: string;
    os: string;
    browser: string;
    device_type: string;
    country: string | null;
    is_pwa: boolean;
    last_active_at: string;
  }[];
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#151519", color: "#F4F1EA" }}>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default function PWAAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPWAAnalytics()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div style={{ padding: 24 }}>Couldn&apos;t load analytics: {error}</div>;
  if (!data) return <div style={{ padding: 24 }}>Loading…</div>;

  const { summary } = data;

  return (
    <div style={{ padding: 24, background: "#0B0B0E", minHeight: "100vh", color: "#F4F1EA" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>PWA Analytics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 28 }}>
        <Stat label="Installations" value={summary.total_installs} />
        <Stat label="Active installs" value={summary.active_installs} />
        <Stat label="Lost signal / uninstalls" value={summary.lost_signal_installs} />
        <Stat label="Daily active users" value={summary.dau} />
        <Stat label="PWA users" value={summary.pwa_users} />
        <Stat label="Browser users" value={summary.browser_users} />
      </div>

      <div style={{ background: "#151519", borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>DAU &amp; installs (last 30 days)</div>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a30" />
            <XAxis dataKey="date" stroke="#8a8a90" fontSize={11} />
            <YAxis stroke="#8a8a90" fontSize={11} />
            <Tooltip contentStyle={{ background: "#0B0B0E", border: "1px solid #2a2a30" }} />
            <Line type="monotone" dataKey="dau" stroke="#D97757" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="installs" stroke="#6fb3ff" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#151519", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>By device type</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.by_device_type}>
              <XAxis dataKey="device_type" stroke="#8a8a90" fontSize={11} />
              <YAxis stroke="#8a8a90" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0B0B0E", border: "1px solid #2a2a30" }} />
              <Bar dataKey="count" fill="#D97757" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#151519", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>By OS</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.by_os}>
              <XAxis dataKey="os" stroke="#8a8a90" fontSize={11} />
              <YAxis stroke="#8a8a90" fontSize={11} />
              <Tooltip contentStyle={{ background: "#0B0B0E", border: "1px solid #2a2a30" }} />
              <Bar dataKey="count" fill="#6fb3ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: "#151519", borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>Recent devices</div>
        <table style={{ width: "100%", fontSize: 12.5, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.6 }}>
              <th style={{ padding: "6px 8px" }}>Device</th>
              <th style={{ padding: "6px 8px" }}>OS</th>
              <th style={{ padding: "6px 8px" }}>Browser</th>
              <th style={{ padding: "6px 8px" }}>Type</th>
              <th style={{ padding: "6px 8px" }}>Country</th>
              <th style={{ padding: "6px 8px" }}>PWA?</th>
              <th style={{ padding: "6px 8px" }}>Last active</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((r) => (
              <tr key={r.device_id} style={{ borderTop: "1px solid #2a2a30" }}>
                <td style={{ padding: "6px 8px", fontFamily: "monospace" }}>{r.device_id.slice(0, 8)}</td>
                <td style={{ padding: "6px 8px" }}>{r.os}</td>
                <td style={{ padding: "6px 8px" }}>{r.browser}</td>
                <td style={{ padding: "6px 8px" }}>{r.device_type}</td>
                <td style={{ padding: "6px 8px" }}>{r.country ?? "—"}</td>
                <td style={{ padding: "6px 8px" }}>{r.is_pwa ? "Yes" : "No"}</td>
                <td style={{ padding: "6px 8px" }}>{new Date(r.last_active_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
