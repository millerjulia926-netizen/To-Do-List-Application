/**
 * Design tokens — single source of truth (WO-01 / REQ-MTTCRA).
 *
 * Keep values in sync with theme-tokens.css (CSS custom properties).
 * Downstream UI should reference CSS vars (var(--primary-purple)) or this module;
 * do not introduce new hardcoded hex/rgb colors in components.
 *
 * Documented names: docs/theme-tokens.md
 *
 * Note: CSS custom property names retain the historical `*-purple` brand prefix;
 * values resolve to the active palette (purple-white or red-white).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ThemeTokens = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /** @typedef {{ light: string, dark: string }} ModeValue */

  /**
   * Purple/white palette (legacy CTTTPA).
   * @type {Record<string, ModeValue>}
   */
  const purpleWhite = {
    "primary-purple": { light: "#7c3aed", dark: "#a78bfa" },
    "primary-purple-hover": { light: "#6d28d9", dark: "#8b5cf6" },
    "primary-purple-deep": { light: "#4c1d95", dark: "#2e1065" },
    "secondary-purple": { light: "#9333ea", dark: "#c084fc" },
    "accent-purple": { light: "#a78bfa", dark: "#c4b5fd" },
    "accent-purple-soft": { light: "#ddd6fe", dark: "#6d28d9" },

    "surface-white": { light: "#ffffff", dark: "#f5f3ff" },
    "surface-white-muted": { light: "#faf5ff", dark: "#1e1b4b" },
    "surface-glass": {
      light: "rgba(255, 255, 255, 0.45)",
      dark: "rgba(46, 16, 101, 0.45)",
    },
    "surface-card": {
      light: "rgba(255, 255, 255, 0.54)",
      dark: "rgba(30, 27, 75, 0.92)",
    },
    "bg-page-start": { light: "#ffffff", dark: "#1e1b4b" },
    "bg-page-end": { light: "#ede9fe", dark: "#4c1d95" },
    "bg-overlay": {
      light: "rgba(0, 0, 0, 0.5)",
      dark: "rgba(1, 1, 1, 0.85)",
    },

    "text-on-primary": { light: "#ffffff", dark: "#ffffff" },
    "text-on-surface": { light: "#1e1b4b", dark: "#ede9fe" },
    "text-primary": { light: "#1e1b4b", dark: "#f5f3ff" },
    "text-secondary": { light: "#5b5675", dark: "#c4b5fd" },
    "text-muted": { light: "#6b7280", dark: "#a78bfa" },

    "neutral-50": { light: "#fafafa", dark: "#2e1065" },
    "neutral-100": { light: "#f3f4f6", dark: "#3b0764" },
    "neutral-200": { light: "#e5e7eb", dark: "#4c1d95" },
    "neutral-400": { light: "#9ca3af", dark: "#7c3aed" },
    "neutral-600": { light: "#6b7280", dark: "#a78bfa" },
    "neutral-800": { light: "#374151", dark: "#ddd6fe" },
    "neutral-900": { light: "#111827", dark: "#f5f3ff" },

    "border-muted": {
      light: "rgba(91, 86, 117, 0.35)",
      dark: "rgba(167, 139, 250, 0.55)",
    },
    "border-accent": {
      light: "rgba(255, 255, 255, 0.18)",
      dark: "rgba(196, 181, 253, 0.65)",
    },
    "focus-ring": {
      light: "rgba(124, 58, 237, 0.85)",
      dark: "rgba(167, 139, 250, 0.85)",
    },

    "priority-high": {
      light: "rgba(255, 0, 0, 0.47)",
      dark: "rgba(255, 82, 82, 0.74)",
    },
    "priority-medium": {
      light: "rgba(255, 166, 0, 0.45)",
      dark: "rgba(255, 167, 38, 0.87)",
    },
    "priority-low": {
      light: "rgba(0, 128, 0, 0.47)",
      dark: "rgba(0, 189, 0, 0.8)",
    },
    "priority-done": {
      light: "rgba(124, 58, 237, 0.55)",
      dark: "rgba(167, 139, 250, 0.9)",
    },
    "success-text": { light: "#0f5132", dark: "#a3d9b1" },
    "success-bg": { light: "#d1e7dd", dark: "#1b4332" },
    "success-border": { light: "#badbcc", dark: "#2d6a4f" },
    "danger-text": { light: "#842029", dark: "#f5c2c7" },
    "danger-bg": { light: "#f8d7da", dark: "#4a1520" },
    "danger-border": { light: "#f5c2c7", dark: "#842029" },
  };

  /**
   * Red/white palette (MTTCRA) — canonical brand reds + white surfaces.
   * Status colors stay distinct from brand red so meaning is preserved.
   * @type {Record<string, ModeValue>}
   */
  const redWhite = {
    // Brand / primary actions (canonical reds + white text; AA contrast on white)
    "primary-purple": { light: "#b91c1c", dark: "#f87171" },
    "primary-purple-hover": { light: "#991b1b", dark: "#ef4444" },
    "primary-purple-deep": { light: "#7f1d1d", dark: "#450a0a" },
    "secondary-purple": { light: "#dc2626", dark: "#fca5a5" },
    "accent-purple": { light: "#ef4444", dark: "#fecaca" },
    "accent-purple-soft": { light: "#fecaca", dark: "#b91c1c" },

    // Surfaces & backgrounds
    "surface-white": { light: "#ffffff", dark: "#fef2f2" },
    "surface-white-muted": { light: "#fef2f2", dark: "#450a0a" },
    "surface-glass": {
      light: "rgba(255, 255, 255, 0.45)",
      dark: "rgba(69, 10, 10, 0.45)",
    },
    "surface-card": {
      light: "rgba(255, 255, 255, 0.54)",
      dark: "rgba(69, 10, 10, 0.92)",
    },
    "bg-page-start": { light: "#ffffff", dark: "#450a0a" },
    "bg-page-end": { light: "#fee2e2", dark: "#7f1d1d" },
    "bg-overlay": {
      light: "rgba(0, 0, 0, 0.5)",
      dark: "rgba(1, 1, 1, 0.85)",
    },

    // Text on chrome / buttons
    "text-on-primary": { light: "#ffffff", dark: "#ffffff" },
    "text-on-surface": { light: "#450a0a", dark: "#fee2e2" },
    "text-primary": { light: "#450a0a", dark: "#fef2f2" },
    "text-secondary": { light: "#7f1d1d", dark: "#fecaca" },
    "text-muted": { light: "#4b5563", dark: "#f87171" },

    // Neutrals
    "neutral-50": { light: "#fafafa", dark: "#450a0a" },
    "neutral-100": { light: "#f3f4f6", dark: "#7f1d1d" },
    "neutral-200": { light: "#e5e7eb", dark: "#991b1b" },
    "neutral-400": { light: "#9ca3af", dark: "#dc2626" },
    "neutral-600": { light: "#4b5563", dark: "#f87171" },
    "neutral-800": { light: "#374151", dark: "#fecaca" },
    "neutral-900": { light: "#111827", dark: "#fef2f2" },

    // Borders & focus
    "border-muted": {
      light: "rgba(127, 29, 29, 0.45)",
      dark: "rgba(248, 113, 113, 0.55)",
    },
    "border-accent": {
      light: "rgba(255, 255, 255, 0.18)",
      dark: "rgba(254, 202, 202, 0.65)",
    },
    "focus-ring": {
      light: "rgba(185, 28, 28, 0.9)",
      dark: "rgba(248, 113, 113, 0.85)",
    },

    // Semantic status — distinct from brand red (AC-MTTCRA-002.2)
    "priority-high": {
      light: "rgba(234, 88, 12, 0.55)",
      dark: "rgba(251, 146, 60, 0.85)",
    },
    "priority-medium": {
      light: "rgba(202, 138, 4, 0.5)",
      dark: "rgba(250, 204, 21, 0.85)",
    },
    "priority-low": {
      light: "rgba(22, 163, 74, 0.5)",
      dark: "rgba(74, 222, 128, 0.8)",
    },
    "priority-done": {
      light: "rgba(220, 38, 38, 0.45)",
      dark: "rgba(248, 113, 113, 0.9)",
    },
    "success-text": { light: "#0f5132", dark: "#a3d9b1" },
    "success-bg": { light: "#d1e7dd", dark: "#1b4332" },
    "success-border": { light: "#badbcc", dark: "#2d6a4f" },
    "danger-text": { light: "#9f1239", dark: "#fda4af" },
    "danger-bg": { light: "#ffe4e6", dark: "#4c0519" },
    "danger-border": { light: "#fecdd3", dark: "#9f1239" },
  };

  const palettes = {
    "purple-white": purpleWhite,
    "red-white": redWhite,
  };

  /** Default export surface: red/white (WO-01 canonical palette). */
  const palette = redWhite;

  /**
   * Resolve a named palette map.
   * @param {string} [name]
   * @returns {Record<string, ModeValue>}
   */
  function getPalette(name) {
    if (name && palettes[name]) return palettes[name];
    return palette;
  }

  /**
   * Build a flat map of `--token-name` → value for a theme mode.
   * @param {"light"|"dark"} mode
   * @param {string} [paletteName]
   * @returns {Record<string, string>}
   */
  function toCssVars(mode, paletteName) {
    const resolved = mode === "dark" ? "dark" : "light";
    const source = getPalette(paletteName);
    /** @type {Record<string, string>} */
    const vars = {};
    for (const [name, value] of Object.entries(source)) {
      vars["--" + name] = value[resolved];
    }
    return vars;
  }

  /**
   * Apply tokens as inline CSS custom properties on an element (default: :root).
   * @param {"light"|"dark"} mode
   * @param {HTMLElement} [el]
   * @param {string} [paletteName]
   */
  function applyToElement(mode, el, paletteName) {
    const target =
      el ||
      (typeof document !== "undefined" ? document.documentElement : null);
    if (!target || !target.style) return;
    const vars = toCssVars(mode, paletteName);
    for (const [prop, value] of Object.entries(vars)) {
      target.style.setProperty(prop, value);
    }
  }

  /** Token names for documentation / tooling. */
  const tokenNames = Object.keys(palette);

  return {
    palette,
    palettes,
    tokenNames,
    getPalette,
    toCssVars,
    applyToElement,
  };
});
