/**
 * Blue/white design tokens — single source of truth (WO-02 / REQ-CTTOTA-002).
 *
 * Keep values in sync with theme-tokens.css (CSS custom properties on :root).
 * Downstream UI should reference CSS vars (var(--primary-blue)) or this module;
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

  /**
   * Semantic token map. Keys are CSS custom property names without the leading `--`.
   * @type {Record<string, ModeValue>}
   */
  const palette = {
    // Brand / primary actions (approved blues + white text)
    "primary-blue": { light: "#1e88e5", dark: "#4fc3f7" },
    "primary-blue-hover": { light: "#1565c0", dark: "#29b6f6" },
    "primary-blue-deep": { light: "#183153", dark: "#0d47a1" },
    "secondary-blue": { light: "#0081a7", dark: "#81d4fa" },
    "accent-blue": { light: "#73c0fc", dark: "#74b9ff" },
    "accent-blue-soft": { light: "#99cafb", dark: "#90caf9" },

    // Surfaces & backgrounds
    "surface-white": { light: "#ffffff", dark: "#e3f2fd" },
    "surface-white-muted": { light: "#f5f9fc", dark: "#1a2332" },
    "surface-glass": {
      light: "rgba(255, 255, 255, 0.45)",
      dark: "rgba(30, 58, 95, 0.45)",
    },
    "surface-card": {
      light: "rgba(255, 255, 255, 0.54)",
      dark: "rgba(13, 27, 42, 0.92)",
    },
    "bg-page-start": { light: "#ffffff", dark: "#0d1b2a" },
    "bg-page-end": { light: "#99cafb", dark: "#1b3a5c" },
    "bg-overlay": {
      light: "rgba(0, 0, 0, 0.5)",
      dark: "rgba(1, 1, 1, 0.85)",
    },

    // Text on chrome / buttons
    "text-on-primary": { light: "#ffffff", dark: "#ffffff" },
    "text-on-surface": { light: "#0d1b2a", dark: "#e8f1fa" },
    "text-primary": { light: "#0d1b2a", dark: "#f3f7fb" },
    "text-secondary": { light: "#656565", dark: "#b0bec5" },
    "text-muted": { light: "#6c6c6c", dark: "#90a4ae" },

    // Neutrals
    "neutral-50": { light: "#f8fafc", dark: "#102a43" },
    "neutral-100": { light: "#e8e8e8", dark: "#243b53" },
    "neutral-200": { light: "#dfe6e9", dark: "#334e68" },
    "neutral-400": { light: "#b1b1b1", dark: "#627d98" },
    "neutral-600": { light: "#6c6c6c", dark: "#9fb3c8" },
    "neutral-800": { light: "#333333", dark: "#d9e2ec" },
    "neutral-900": { light: "#000000", dark: "#f0f4f8" },

    // Borders & focus
    "border-muted": {
      light: "rgba(70, 70, 70, 0.87)",
      dark: "rgba(144, 202, 249, 0.55)",
    },
    "border-accent": {
      light: "rgba(255, 255, 255, 0.18)",
      dark: "rgba(79, 195, 247, 0.65)",
    },
    "focus-ring": {
      light: "rgba(1, 110, 225, 0.85)",
      dark: "rgba(79, 195, 247, 0.85)",
    },

    // Semantic (priority / alerts) — kept intentional, not purple brand accents
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
      light: "rgba(8, 0, 255, 0.47)",
      dark: "rgba(66, 165, 245, 0.9)",
    },
    "success-text": { light: "#0f5132", dark: "#a3d9b1" },
    "success-bg": { light: "#d1e7dd", dark: "#1b4332" },
    "success-border": { light: "#badbcc", dark: "#2d6a4f" },
    "danger-text": { light: "#842029", dark: "#f5c2c7" },
    "danger-bg": { light: "#f8d7da", dark: "#4a1520" },
    "danger-border": { light: "#f5c2c7", dark: "#842029" },
  };

  /**
   * Build a flat map of `--token-name` → value for a theme mode.
   * @param {"light"|"dark"} mode
   * @returns {Record<string, string>}
   */
  function toCssVars(mode) {
    const resolved = mode === "dark" ? "dark" : "light";
    /** @type {Record<string, string>} */
    const vars = {};
    for (const [name, value] of Object.entries(palette)) {
      vars["--" + name] = value[resolved];
    }
    return vars;
  }

  /**
   * Apply tokens as inline CSS custom properties on an element (default: :root).
   * Useful once theming infrastructure (WO-03) switches modes at runtime.
   * @param {"light"|"dark"} mode
   * @param {HTMLElement} [el]
   */
  function applyToElement(mode, el) {
    const target =
      el ||
      (typeof document !== "undefined" ? document.documentElement : null);
    if (!target || !target.style) return;
    const vars = toCssVars(mode);
    for (const [prop, value] of Object.entries(vars)) {
      target.style.setProperty(prop, value);
    }
  }

  /** Token names for documentation / tooling (AC-CTTOTA-002.2). */
  const tokenNames = Object.keys(palette);

  return {
    palette,
    tokenNames,
    toCssVars,
    applyToElement,
  };
});
