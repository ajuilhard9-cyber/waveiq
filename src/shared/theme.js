export function makeTheme(dark) {
  return {
    bg:          dark ? "#080c14"  : "#f4f6fb",
    card:        dark ? "#0f1623"  : "#ffffff",
    hi:          dark ? "#1a1f35"  : "#eef0ff",
    border:      dark ? "#1a2235"  : "#eaecf4",
    line:        dark ? "#1e2a3d"  : "#e8ebf4",
    text:        dark ? "#eef2ff"  : "#0f172a",
    sub:         dark ? "#4a5568"  : "#94a3b8",
    shadow:      dark ? "0 2px 12px rgba(0,0,0,0.45)" : "0 2px 12px rgba(99,102,241,0.07),0 1px 3px rgba(0,0,0,0.05)",
    shadowHover: dark ? "0 12px 32px rgba(0,0,0,0.6)" : "0 12px 32px rgba(99,102,241,0.18)",
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
