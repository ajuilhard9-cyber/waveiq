export function makeTheme() {
  return {
    bg:          "#f8fafc",
    card:        "#ffffff",
    hi:          "#f0f9ff",
    border:      "#e2e8f0",
    line:        "#e2e8f0",
    text:        "#0f172a",
    sub:         "#64748b",
    accent:      "#0ea5e9",
    shadow:      "0 1px 3px rgba(0,0,0,0.06)",
    shadowHover: "0 4px 16px rgba(0,0,0,0.10)",
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
