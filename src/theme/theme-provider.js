/**
 * Theme provider — wires design tokens into the live document (WO-03).
 *
 * Responsibilities:
 * - Persist and restore light/dark mode
 * - Toggle body.light-mode / body.dark-mode (CSS token cascade)
 * - Apply ThemeTokens CSS custom properties onto :root for JS-driven sync
 *
 * Depends on src/theme/tokens.js (window.ThemeTokens).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory(root);
  } else {
    root.ThemeProvider = factory(root);
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var STORAGE_KEY = "dark-mode";
  var DARK_VALUE = "enabled";

  function getDocument() {
    return typeof document !== "undefined" ? document : null;
  }

  function getMode() {
    try {
      return localStorage.getItem(STORAGE_KEY) === DARK_VALUE ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function prefersDark() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /**
   * Apply a theme mode: body classes + CSS variables from ThemeTokens.
   * @param {"light"|"dark"} mode
   * @param {{ persist?: boolean, toggleBtn?: HTMLInputElement|null }} [opts]
   */
  function setMode(mode, opts) {
    var doc = getDocument();
    if (!doc || !doc.body) return;

    var resolved = mode === "dark" ? "dark" : "light";
    var persist = !opts || opts.persist !== false;
    var toggleBtn = opts && opts.toggleBtn;

    doc.body.classList.remove("dark-mode", "light-mode");
    doc.body.classList.add(resolved === "dark" ? "dark-mode" : "light-mode");
    doc.documentElement.setAttribute("data-theme", resolved);

    if (root.ThemeTokens && typeof root.ThemeTokens.applyToElement === "function") {
      root.ThemeTokens.applyToElement(resolved, doc.documentElement);
    }

    if (persist) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          resolved === "dark" ? DARK_VALUE : null
        );
      } catch (e) {
        /* ignore quota / private mode */
      }
    }

    if (toggleBtn) {
      toggleBtn.checked = resolved === "dark";
    }

    if (doc.body.dispatchEvent) {
      doc.body.dispatchEvent(
        new CustomEvent("themechange", { detail: { mode: resolved } })
      );
    }

    return resolved;
  }

  function toggle(opts) {
    return setMode(getMode() === "dark" ? "light" : "dark", opts);
  }

  /**
   * Initialize theme from storage or system preference.
   * @param {{ toggleBtn?: HTMLInputElement|null }} [opts]
   */
  function init(opts) {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      stored = null;
    }

    var mode;
    if (stored === DARK_VALUE) {
      mode = "dark";
    } else if (stored === null && prefersDark()) {
      mode = "dark";
    } else {
      mode = "light";
    }

    return setMode(mode, {
      persist: true,
      toggleBtn: opts && opts.toggleBtn,
    });
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    getMode: getMode,
    setMode: setMode,
    toggle: toggle,
    init: init,
  };
});
