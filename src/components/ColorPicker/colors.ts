export const colors = {
  slate: {
    hex: "#475569", // 600
    bg: "bg-slate-600",
  },
  gray: {
    hex: "#4b5563", // 600
    bg: "bg-gray-600",
  },
  zinc: {
    hex: "#52525b", // 600
    bg: "bg-zinc-600",
  },
  neutral: {
    hex: "#525252", // 600
    bg: "bg-neutral-600",
  },
  stone: {
    hex: "#57534e", // 600
    bg: "bg-stone-600",
  },
  red: {
    hex: "#dc2626", // 600
    bg: "bg-red-600",
  },
  orange: {
    hex: "#ea580c", // 600
    bg: "bg-orange-600",
  },
  amber: {
    hex: "#d97706", // 600
    bg: "bg-amber-600",
  },
  yellow: {
    hex: "#d97706", // 600
    bg: "bg-yellow-600",
  },
  lime: {
    hex: "#65a30d", // 600
    bg: "bg-lime-600",
  },
  green: {
    hex: "#16a34a", // 600
    bg: "bg-green-600",
  },
  emerald: {
    hex: "#059669", // 600
    bg: "bg-emerald-600",
  },
  teal: {
    hex: "#0d9488", // 600
    bg: "bg-teal-600",
  },
  cyan: {
    hex: "#0891b2", // 600
    bg: "bg-cyan-600",
  },
  sky: {
    hex: "#0284c7", // 600
    bg: "bg-sky-600",
  },
  blue: {
    hex: "#2563eb", // 600
    bg: "bg-blue-600",
  },
  indigo: {
    hex: "#4f46e5", // 600
    bg: "bg-indigo-600",
  },
  violet: {
    hex: "#7c3aed", // 600
    bg: "bg-violet-600",
  },
  purple: {
    hex: "#9333ea", // 600
    bg: "bg-purple-600",
  },
  fuchsia: {
    hex: "#c026d3", // 600
    bg: "bg-fuchsia-600",
  },
  pink: {
    hex: "#db2777", // 600
    bg: "bg-pink-600",
  },
  rose: {
    hex: "#e11d48", // 600
    bg: "bg-rose-600",
  },
};

function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getColorForString(str: string) {
  const colorsHexs = Object.keys(colors)
    .filter(
      (color) =>
        !["sky", "slate", "gray", "zinc", "neutral", "stone"].includes(color),
    )
    .map((color) => colors[color as keyof typeof colors].hex);

  const hash = hashStringToNumber(str);
  const index = hash % colorsHexs.length;
  return colorsHexs[index];
}
