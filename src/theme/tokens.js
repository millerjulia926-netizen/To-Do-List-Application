/**
 * Design tokens — single source of truth (REQ-CTTTPA / REQ-CTTCTB).
 *
 * Keep values in sync with theme-tokens.css (CSS custom properties).
 * Downstream UI should reference CSS vars (var(--primary-purple)) or this module;
 * do not introduce new hardcoded hex/rgb colors in components.
 *
 * Palettes:
 *   - purple-white — branded purple/white (CTTTPA)
 *   - black-white  — monochrome grayscale, no hues (CTTCTB)
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
   * Purple/white semantic token map (CTTTPA).
   * Keys are CSS custom property names without the leading `--`.
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
   * Black & white monochrome token map (CTTCTB) — grayscale only, no hues.
   * Same token names so style.css keeps using var(--primary-purple) etc.
   * @type {TokenPalette}
   */
  const blackWhite = {
    "primary-purple": { light: "#111111", dark: "#f5f5f5" },
    "primary-purple-hover": { light: "#000000", dark: "#ffffff" },
    "primary-purple-deep": { light: "#000000", dark: "#d4d4d4" },
    "secondary-purple": { light: "#404040", dark: "#a3a3a3" },
    "accent-purple": { light: "#737373", dark: "#d4d4d4" },
    "accent-purple-soft": { light: "#e5e5e5", dark: "#404040" },

    "surface-white": { light: "#ffffff", dark: "#e5e5e5" },
    "surface-white-muted": { light: "#f5f5f5", dark: "#171717" },
    "surface-glass": {
      light: "rgba(255, 255, 255, 0.55)",
      dark: "rgba(23, 23, 23, 0.55)",
    },
    "surface-card": {
      light: "rgba(255, 255, 255, 0.72)",
      dark: "rgba(23, 23, 23, 0.92)",
    },
    "bg-page-start": { light: "#ffffff", dark: "#0a0a0a" },
    "bg-page-end": { light: "#e5e5e5", dark: "#262626" },
    "bg-overlay": {
      light: "rgba(0, 0, 0, 0.5)",
      dark: "rgba(0, 0, 0, 0.85)",
    },

    "text-on-primary": { light: "#ffffff", dark: "#000000" },
    "text-on-surface": { light: "#111111", dark: "#f5f5f5" },
    "text-primary": { light: "#111111", dark: "#fafafa" },
    "text-secondary": { light: "#525252", dark: "#d4d4d4" },
    "text-muted": { light: "#737373", dark: "#a3a3a3" },

    "neutral-50": { light: "#fafafa", dark: "#262626" },
    "neutral-100": { light: "#f5f5f5", dark: "#404040" },
    "neutral-200": { light: "#e5e5e5", dark: "#525252" },
    "neutral-400": { light: "#a3a3a3", dark: "#737373" },
    "neutral-600": { light: "#737373", dark: "#a3a3a3" },
    "neutral-800": { light: "#404040", dark: "#e5e5e5" },
    "neutral-900": { light: "#171717", dark: "#fafafa" },

    "border-muted": {
      light: "rgba(64, 64, 64, 0.35)",
      dark: "rgba(163, 163, 163, 0.55)",
    },
    "border-accent": {
      light: "rgba(255, 255, 255, 0.2)",
      dark: "rgba(212, 212, 212, 0.35)",
    },
    "focus-ring": {
      light: "rgba(17, 17, 17, 0.85)",
      dark: "rgba(245, 245, 245, 0.85)",
    },

    "priority-high": {
      light: "rgba(0, 0, 0, 0.72)",
      dark: "rgba(255, 255, 255, 0.85)",
    },
    "priority-medium": {
      light: "rgba(64, 64, 64, 0.55)",
      dark: "rgba(212, 212, 212, 0.7)",
    },
    "priority-low": {
      light: "rgba(163, 163, 163, 0.55)",
      dark: "rgba(115, 115, 115, 0.7)",
    },
    "priority-done": {
      light: "rgba(17, 17, 17, 0.55)",
      dark: "rgba(245, 245, 245, 0.75)",
    },
    "success-text": { light: "#171717", dark: "#f5f5f5" },
    "success-bg": { light: "#e5e5e5", dark: "#262626" },
    "success-border": { light: "#a3a3a3", dark: "#525252" },
    "danger-text": { light: "#000000", dark: "#ffffff" },
    "danger-bg": { light: "#f5f5f5", dark: "#171717" },
    "danger-border": { light: "#737373", dark: "#737373" },
  };

  /** @type {Record<string, TokenPalette>} */
  const palettes = {
    "purple-white": purpleWhite,
    "black-white": blackWhite,
  };

  /** Default export for backward compatibility (purple/white). */
  const palette = purpleWhite;

  /** Token names shared across palettes. */
  const tokenNames = Object.keys(purpleWhite);

  /**
   * Resolve a palette by key; falls back to purple-white.
   * @param {string} [paletteKey]
   * @returns {TokenPalette}
   */
  function resolvePalette(paletteKey) {
    if (paletteKey && palettes[paletteKey]) return palettes[paletteKey];
    return purpleWhite;
  }

  /**
   * Build a flat map of `--token-name` → value for a theme mode.
   * @param {"light"|"dark"} mode
   * @param {string} [paletteKey] "purple-white" | "black-white"
   * @returns {Record<string, string>}
   */
  function toCssVars(mode, paletteKey) {
    const resolved = mode === "dark" ? "dark" : "light";
    const source = resolvePalette(paletteKey);
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
   * @param {string} [paletteKey]
   */
  function applyToElement(mode, el, paletteKey) {
    const target =
      el ||
      (typeof document !== "undefined" ? document.documentElement : null);
    if (!target || !target.style) return;
    const vars = toCssVars(mode, paletteKey);
    for (const [prop, value] of Object.entries(vars)) {
      target.style.setProperty(prop, value);
    }
  }

  return {
    palette,
    palettes,
    tokenNames,
    toCssVars,
    applyToElement,
    resolvePalette,
  };
});
