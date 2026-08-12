export default function OfflinePage() {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "#F4F1EA", background: "#0B0B0E", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>You&apos;re offline</h1>
      <p style={{ opacity: 0.6, marginTop: 8 }}>
        INRA Studio needs a connection for live campaign data. Reconnect and reload.
      </p>
    </div>
  );
}
