// ── Victorian Engraving Color Tokens ──────────────────────────────────────────
export const tokens = {
  // Paper / ink
  parchment:     "oklch(96% 0.018 85)",
  parchmentMid:  "oklch(89% 0.025 75)",
  inkDeep:       "oklch(14% 0.015 250)",
  inkMid:        "oklch(28% 0.020 240)",

  // Low-sat watercolour washes
  ochre:         "oklch(54% 0.080 78)",
  prussianBlue:  "oklch(34% 0.065 248)",
  darkRed:       "oklch(38% 0.090 22)",
  sepia:         "oklch(44% 0.050 60)",

  // UI accents
  accentGold:    "oklch(68% 0.110 80)",
};

export const fonts = {
  serif:    '"Georgia", "Palatino Linotype", "Book Antiqua", serif',
  display:  '"Times New Roman", "Trajan Pro", serif',
};

export const fps = 32;
export const sec = (s: number) => Math.round(s * fps);
