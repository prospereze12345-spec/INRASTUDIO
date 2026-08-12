// A stable, anonymous device id survives across sessions (and, once installed,
// across app opens) so we can tell "1 install used 40 times" apart from
// "40 different installs". Falls back gracefully if storage is unavailable.

const KEY = "inra_device_id";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `dev_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = generateId();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // Storage disabled (private mode edge cases) — fall back to a session-only id.
    return generateId();
  }
}
