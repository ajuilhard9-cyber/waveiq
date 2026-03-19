export function makeTheme(dark) {
  return {
    bg:          dark ? "#080c14"  : "#f0f5fa",
    card:        dark ? "#0f1623"  : "#ffffff",
    hi:          dark ? "#0c1d30"  : "#e0f2fe",
    border:      dark ? "#1a2235"  : "#e2e8f0",
    line:        dark ? "#1e2a3d"  : "#cbd5e1",
    text:        dark ? "#eef2ff"  : "#0f172a",
    sub:         dark ? "#4a5568"  : "#64748b",
    accent:      "#0ea5e9",
    shadow:      dark ? "0 2px 12px rgba(0,0,0,0.45)" : "0 2px 8px rgba(0,0,0,0.06)",
    shadowHover: dark ? "0 12px 32px rgba(0,0,0,0.6)" : "0 8px 24px rgba(14,165,233,0.15)",
  };
}

export const RC = {
  Europe:"#6366f1", Pacific:"#f59e0b", Africa:"#f97316",
  Asia:"#a855f7", Caribbean:"#10b981", Indian:"#0ea5e9",
  Atlantic:"#8b5cf6", "S.America":"#22c55e",
};

export const SC = {
  GO:      {bg:"#f0fdf4", text:"#15803d", border:"#bbf7d0", dot:"#22c55e"},
  CAUTION: {bg:"#fefce8", text:"#a16207", border:"#fde68a", dot:"#eab308"},
  "NO-GO": {bg:"#fff1f2", text:"#be123c", border:"#fecdd3", dot:"#f43f5e"},
};

export const SPORTS = ["surf","kite","windsurf","kayak","sup","sail","fishing"];
export const LEVELS  = ["beginner","advanced","expert"];
export const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
