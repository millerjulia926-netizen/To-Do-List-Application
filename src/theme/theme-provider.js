/**
 * Theme provider — centralized theming (WO-02 / WO-09 / REQ-MTTCRA).
 *
 * - Palette: default | purple-white | red-white (Settings > Appearance)
 * - Mode: light | dark (toggle)
 * - High contrast: increases contrast for accessibility (AC-MTTCRA-004.2)
 * - Applies CSS custom properties from ThemeTokens when a branded palette is active
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

  var MODE_STORAGE_KEY = "dark-mode";
  var PALETTE_STORAGE_KEY = "theme-palette";
  var HIGH_CONTRAST_STORAGE_KEY = "theme-high-contrast";
  var DARK_VALUE = "enabled";
  var HIGH_CONTRAST_VALUE = "enabled";

  var PALETTES = {
    DEFAULT: "default",
    PURPLE_WHITE: "purple-white",
    RED_WHITE: "red-white",
  };

  var PALETTE_LABELS = {
    default: "Default",
    "purple-white": "Purple/White",
    "red-white": "Red & White",
  };

  var BRANDED_PALETTES = [PALETTES.PURPLE_WHITE, PALETTES.RED_WHITE];

  function getDocument() {
    return typeof document !== "undefined" ? document : null;
  }

  function getMode() {
    try {
      return localStorage.getItem(MODE_STORAGE_KEY) === DARK_VALUE ? "dark" : "light";
    } catch (e) {
      return "light";
    }
  }

  function normalizePalette(value) {
    if (value === PALETTES.PURPLE_WHITE) return PALETTES.PURPLE_WHITE;
    if (value === PALETTES.RED_WHITE) return PALETTES.RED_WHITE;
    return PALETTES.DEFAULT;
  }

  function getPalette() {
    try {
      return normalizePalette(localStorage.getItem(PALETTE_STORAGE_KEY));
    } catch (e) {
      return PALETTES.DEFAULT;
    }
  }

  function getHighContrast() {
    try {
      return localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === HIGH_CONTRAST_VALUE;
    } catch (e) {
      return false;
    }
  }

  function prefersDark() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function isBrandedPalette(palette) {
    return BRANDED_PALETTES.indexOf(palette) !== -1;
  }

  function clearInlineTokens(doc) {
    if (!root.ThemeTokens || !root.ThemeTokens.tokenNames) return;
    root.ThemeTokens.tokenNames.forEach(function (name) {
      doc.documentElement.style.removeProperty("--" + name);
    });
  }

  function applyTokensForMode(doc, mode, palette) {
    if (
      isBrandedPalette(palette) &&
      root.ThemeTokens &&
      typeof root.ThemeTokens.applyToElement === "function"
    ) {
      root.ThemeTokens.applyToElement(mode, doc.documentElement, palette);
    } else {
      clearInlineTokens(doc);
    }
  }

  function applyHighContrastAttribute(doc, enabled) {
    if (!doc || !doc.documentElement) return;
    doc.documentElement.setAttribute(
      "data-high-contrast",
      enabled ? "true" : "false"
    );
  }

  function dispatchThemeChange(doc, mode, palette, highContrast) {
    if (!doc.body || !doc.body.dispatchEvent) return;
    doc.body.dispatchEvent(
      new CustomEvent("themechange", {
        detail: {
          mode: mode,
          palette: palette,
          highContrast: !!highContrast,
        },
      })
    );
  }

  /**
   * Apply light/dark mode.
   * @param {"light"|"dark"} mode
   * @param {{ persist?: boolean, toggleBtn?: HTMLInputElement|null, paletteSelect?: HTMLSelectElement|null, highContrastToggle?: HTMLInputElement|null }} [opts]
   */
  function setMode(mode, opts) {
    var doc = getDocument();
    if (!doc || !doc.body) return;

    var resolved = mode === "dark" ? "dark" : "light";
    var persist = !opts || opts.persist !== false;
    var toggleBtn = opts && opts.toggleBtn;
    var palette = getPalette();
    var highContrast = getHighContrast();

    doc.body.classList.remove("dark-mode", "light-mode");
    doc.body.classList.add(resolved === "dark" ? "dark-mode" : "light-mode");
    doc.documentElement.setAttribute("data-theme", resolved);
    applyHighContrastAttribute(doc, highContrast);

    applyTokensForMode(doc, resolved, palette);

    if (persist) {
      try {
        localStorage.setItem(
          MODE_STORAGE_KEY,
          resolved === "dark" ? DARK_VALUE : null
        );
      } catch (e) {
        /* ignore */
      }
    }

    if (toggleBtn) {
      toggleBtn.checked = resolved === "dark";
    }

    dispatchThemeChange(doc, resolved, palette, highContrast);
    return resolved;
  }

  /**
   * Apply theme palette (default, purple-white, or red-white).
   * Applies immediately without a page reload (AC-MTTCRA-001.2).
   * @param {"default"|"purple-white"|"red-white"} palette
   * @param {{ persist?: boolean, paletteSelect?: HTMLSelectElement|null, toggleBtn?: HTMLInputElement|null, highContrastToggle?: HTMLInputElement|null }} [opts]
   */
  function setPalette(palette, opts) {
    var doc = getDocument();
    if (!doc || !doc.body) return;

    var resolved = normalizePalette(palette);
    var persist = !opts || opts.persist !== false;
    var paletteSelect = opts && opts.paletteSelect;
    var mode = getMode();
    var highContrast = getHighContrast();

    doc.documentElement.setAttribute("data-theme-palette", resolved);
    applyHighContrastAttribute(doc, highContrast);
    applyTokensForMode(doc, mode, resolved);

    if (persist) {
      try {
        localStorage.setItem(PALETTE_STORAGE_KEY, resolved);
      } catch (e) {
        /* ignore */
      }
    }

    if (paletteSelect) {
      paletteSelect.value = resolved;
    }

    dispatchThemeChange(doc, mode, resolved, highContrast);
    return resolved;
  }

  /**
   * Enable or disable high-contrast mode (AC-MTTCRA-004.2).
   * @param {boolean} enabled
   * @param {{ persist?: boolean, highContrastToggle?: HTMLInputElement|null }} [opts]
   */
  function setHighContrast(enabled, opts) {
    var doc = getDocument();
    if (!doc || !doc.documentElement) return;

    var resolved = !!enabled;
    var persist = !opts || opts.persist !== false;
    var highContrastToggle = opts && opts.highContrastToggle;
    var mode = getMode();
    var palette = getPalette();

    applyHighContrastAttribute(doc, resolved);

    if (persist) {
      try {
        localStorage.setItem(
          HIGH_CONTRAST_STORAGE_KEY,
          resolved ? HIGH_CONTRAST_VALUE : null
        );
      } catch (e) {
        /* ignore */
      }
    }

    if (highContrastToggle) {
      highContrastToggle.checked = resolved;
    }

    // Re-apply palette tokens so CSS cascade + inline tokens stay aligned
    applyTokensForMode(doc, mode, palette);
    dispatchThemeChange(doc, mode, palette, resolved);
    return resolved;
  }

  function toggle(opts) {
    return setMode(getMode() === "dark" ? "light" : "dark", opts);
  }

  /**
   * Initialize palette + mode + high contrast from storage / system preference.
   * When no palette has been selected, keeps the default theme (AC-MTTCRA-001.3).
   * @param {{ toggleBtn?: HTMLInputElement|null, paletteSelect?: HTMLSelectElement|null, highContrastToggle?: HTMLInputElement|null }} [opts]
   */
  function init(opts) {
    var doc = getDocument();
    var storedMode = null;
    var palette = getPalette();
    var highContrast = getHighContrast();

    try {
      storedMode = localStorage.getItem(MODE_STORAGE_KEY);
    } catch (e) {
      storedMode = null;
    }

    var mode;
    if (storedMode === DARK_VALUE) {
      mode = "dark";
    } else if (storedMode === null && prefersDark()) {
      mode = "dark";
    } else {
      mode = "light";
    }

    if (doc && doc.documentElement) {
      doc.documentElement.setAttribute("data-theme-palette", palette);
    }

    setHighContrast(highContrast, {
      persist: false,
      highContrastToggle: opts && opts.highContrastToggle,
    });

    setPalette(palette, {
      persist: false,
      paletteSelect: opts && opts.paletteSelect,
    });

    return setMode(mode, {
      persist: true,
      toggleBtn: opts && opts.toggleBtn,
    });
  }

  return {
    MODE_STORAGE_KEY: MODE_STORAGE_KEY,
    PALETTE_STORAGE_KEY: PALETTE_STORAGE_KEY,
    HIGH_CONTRAST_STORAGE_KEY: HIGH_CONTRAST_STORAGE_KEY,
    PALETTES: PALETTES,
    PALETTE_LABELS: PALETTE_LABELS,
    getMode: getMode,
    getPalette: getPalette,
    getHighContrast: getHighContrast,
    setMode: setMode,
    setPalette: setPalette,
    setHighContrast: setHighContrast,
    toggle: toggle,
    init: init,
  };
});
