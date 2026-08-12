"use client";

export function IOSInstallSheet({
  platform,
  onClose,
}: {
  platform: "ios" | "macos";
  onClose: () => void;
}) {
  const steps =
    platform === "ios"
      ? [
          { label: "Tap the Share icon", detail: "In Safari's toolbar — the square with an arrow pointing up." },
          { label: "Scroll and tap \u201cAdd to Home Screen\u201d", detail: "You may need to scroll down the share sheet to find it." },
          { label: "Tap \u201cAdd\u201d", detail: "INRA Studio appears on your Home Screen like any other app." },
        ]
      : [
          { label: "Open the File menu", detail: "Or click the Share icon in Safari's toolbar." },
          { label: "Choose \u201cAdd to Dock\u201d", detail: "(Safari 17+/Sonoma). On older macOS this may read \u201cAdd to Home Screen\u201d." },
          { label: "Launch it from your Dock", detail: "INRA Studio opens in its own window from now on." },
        ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,11,14,0.55)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#0B0B0E",
          color: "#F4F1EA",
          borderRadius: "20px 20px 0 0",
          padding: "24px 22px 28px",
          fontFamily: "inherit",
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(244,241,234,0.2)", margin: "0 auto 18px" }} />
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Install INRA Studio</h3>
        <p style={{ fontSize: 13, opacity: 0.65, margin: "0 0 20px" }}>
          Safari doesn&apos;t show an install button, but adding it takes three taps.
        </p>

        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {steps.map((step, i) => (
            <li key={i} style={{ display: "flex", gap: 12 }}>
              <span
                style={{
                  flexShrink: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(244,241,234,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{step.label}</div>
                <div style={{ fontSize: 12.5, opacity: 0.6, marginTop: 2 }}>{step.detail}</div>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={onClose}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 0",
            borderRadius: 999,
            background: "#F4F1EA",
            color: "#0B0B0E",
            fontWeight: 700,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
