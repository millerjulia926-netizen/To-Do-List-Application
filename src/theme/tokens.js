/**
 * Design tokens — single source of truth (WO-01 CTCTTY / WO-02 / REQ-CTTTPA).
 *
 * Palettes: purple-white (legacy), yellow (CTCTTY brand).
 * Keep values in sync with theme-tokens.css (CSS custom properties).
 * Downstream UI should reference CSS vars (var(--primary-purple)) or this module;
 * do not introduce new hardcoded hex/rgb colors in components.
 *
 * Documented names: docs/theme-tokens.md
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
  /** @typedef {Record<string, ModeValue>} TokenPalette */

  /**
   * Purple/white palette (CTTTPA).
   * @type {TokenPalette}
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
   * Yellow / amber brand palette (WO-01 / REQ-CTCTTY).
   * Primary ambers target ~WCAG AA with white text in light mode.
   * @type {TokenPalette}
   */
  const yellow = {
    "primary-purple": { light: "#b45309", dark: "#fbbf24" },
    "primary-purple-hover": { light: "#92400e", dark: "#f59e0b" },
    "primary-purple-deep": { light: "#78350f", dark: "#78350f" },
    "secondary-purple": { light: "#d97706", dark: "#fcd34d" },
    "accent-purple": { light: "#f59e0b", dark: "#fde68a" },
    "accent-purple-soft": { light: "#fef3c7", dark: "#92400e" },

    "surface-white": { light: "#ffffff", dark: "#fef3c7" },
    "surface-white-muted": { light: "#fffbeb", dark: "#1c1917" },
    "surface-glass": {
      light: "rgba(255, 255, 255, 0.45)",
      dark: "rgba(69, 26, 3, 0.45)",
    },
    "surface-card": {
      light: "rgba(255, 255, 255, 0.54)",
      dark: "rgba(28, 25, 23, 0.92)",
    },
    "bg-page-start": { light: "#ffffff", dark: "#1c1917" },
    "bg-page-end": { light: "#fef9c3", dark: "#451a03" },
    "bg-overlay": {
      light: "rgba(0, 0, 0, 0.5)",
      dark: "rgba(1, 1, 1, 0.85)",
    },

    "text-on-primary": { light: "#ffffff", dark: "#1c1917" },
    "text-on-surface": { light: "#422006", dark: "#fef3c7" },
    "text-primary": { light: "#422006", dark: "#fffbeb" },
    "text-secondary": { light: "#78350f", dark: "#fde68a" },
    "text-muted": { light: "#92400e", dark: "#fbbf24" },

    "neutral-50": { light: "#fffbeb", dark: "#292524" },
    "neutral-100": { light: "#fef3c7", dark: "#44403c" },
    "neutral-200": { light: "#fde68a", dark: "#78350f" },
    "neutral-400": { light: "#fbbf24", dark: "#b45309" },
    "neutral-600": { light: "#d97706", dark: "#fbbf24" },
    "neutral-800": { light: "#92400e", dark: "#fef3c7" },
    "neutral-900": { light: "#451a03", dark: "#fffbeb" },

    "border-muted": {
      light: "rgba(120, 53, 15, 0.35)",
      dark: "rgba(251, 191, 36, 0.55)",
    },
    "border-accent": {
      light: "rgba(255, 255, 255, 0.18)",
      dark: "rgba(253, 230, 138, 0.65)",
    },
    "focus-ring": {
      light: "rgba(180, 83, 9, 0.85)",
      dark: "rgba(251, 191, 36, 0.85)",
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
      light: "rgba(180, 83, 9, 0.55)",
      dark: "rgba(251, 191, 36, 0.9)",
    },
    "success-text": { light: "#0f5132", dark: "#a3d9b1" },
    "success-bg": { light: "#d1e7dd", dark: "#1b4332" },
    "success-border": { light: "#badbcc", dark: "#2d6a4f" },
    "danger-text": { light: "#842029", dark: "#f5c2c7" },
    "danger-bg": { light: "#f8d7da", dark: "#4a1520" },
    "danger-border": { light: "#f5c2c7", dark: "#842029" },
  };

  /** @type {Record<string, TokenPalette>} */
  const palettes = {
    "purple-white": purpleWhite,
    yellow: yellow,
  };

  /** Default brand palette for runtime apply (yellow / CTCTTY). */
  const palette = yellow;

  /**
   * Resolve a named palette map.
   * @param {string} [paletteName]
   * @returns {TokenPalette}
   */
  function resolvePalette(paletteName) {
    if (paletteName && palettes[paletteName]) return palettes[paletteName];
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
    const source = resolvePalette(paletteName);
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
   * @param {string} [paletteName] e.g. "yellow" | "purple-white"
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

  /** Token names for documentation / tooling (AC-CTTTPA-002.2). */
  const tokenNames = Object.keys(palette);

  return {
    palette,
    palettes,
    tokenNames,
    toCssVars,
    applyToElement,
    resolvePalette,
  };
});
