/**
 * Purple/white design tokens — single source of truth (WO-02 / REQ-CTTTPA-002).
 *
 * Keep values in sync with theme-tokens.css (CSS custom properties on :root).
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

  /**
   * Semantic token map. Keys are CSS custom property names without the leading `--`.
   * @type {Record<string, ModeValue>}
   */
  const palette = {
    // Brand / primary actions (approved purples + white text)
    "primary-purple": { light: "#7c3aed", dark: "#a78bfa" },
    "primary-purple-hover": { light: "#6d28d9", dark: "#8b5cf6" },
    "primary-purple-deep": { light: "#4c1d95", dark: "#2e1065" },
    "secondary-purple": { light: "#9333ea", dark: "#c084fc" },
    "accent-purple": { light: "#a78bfa", dark: "#c4b5fd" },
    "accent-purple-soft": { light: "#ddd6fe", dark: "#6d28d9" },

    // Surfaces & backgrounds
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

    // Text on chrome / buttons
    "text-on-primary": { light: "#ffffff", dark: "#ffffff" },
    "text-on-surface": { light: "#1e1b4b", dark: "#ede9fe" },
    "text-primary": { light: "#1e1b4b", dark: "#f5f3ff" },
    "text-secondary": { light: "#5b5675", dark: "#c4b5fd" },
    "text-muted": { light: "#6b7280", dark: "#a78bfa" },

    // Neutrals
    "neutral-50": { light: "#fafafa", dark: "#2e1065" },
    "neutral-100": { light: "#f3f4f6", dark: "#3b0764" },
    "neutral-200": { light: "#e5e7eb", dark: "#4c1d95" },
    "neutral-400": { light: "#9ca3af", dark: "#7c3aed" },
    "neutral-600": { light: "#6b7280", dark: "#a78bfa" },
    "neutral-800": { light: "#374151", dark: "#ddd6fe" },
    "neutral-900": { light: "#111827", dark: "#f5f3ff" },

    // Borders & focus
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

    // Semantic (priority / alerts) — kept intentional, not brand purple accents
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

  /** Token names for documentation / tooling (AC-CTTTPA-002.2). */
  const tokenNames = Object.keys(palette);

  return {
    palette,
    tokenNames,
    toCssVars,
    applyToElement,
  };
});
