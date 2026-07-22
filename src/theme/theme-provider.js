/**
 * Theme provider — centralized theming (REQ-CTTTPA / REQ-CTTCTB).
 *
 * - Palette: default | purple-white | black-white (Settings > Appearance)
 * - Mode: light | dark (toggle)
 * - Applies CSS custom properties from ThemeTokens when a non-default
 *   palette is active (purple-white or black-white)
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
  var DARK_VALUE = "enabled";

  var PALETTES = {
    DEFAULT: "default",
    PURPLE_WHITE: "purple-white",
    BLACK_WHITE: "black-white",
  };

  var PALETTE_LABELS = {
    default: "Default",
    "purple-white": "Purple/White",
    "black-white": "Black & White",
  };

  var TOKENIZED_PALETTES = [PALETTES.PURPLE_WHITE, PALETTES.BLACK_WHITE];

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
    if (value === PALETTES.BLACK_WHITE) return PALETTES.BLACK_WHITE;
    return PALETTES.DEFAULT;
  }

  function getPalette() {
    try {
      return normalizePalette(localStorage.getItem(PALETTE_STORAGE_KEY));
    } catch (e) {
      return PALETTES.DEFAULT;
    }
  }

  function prefersDark() {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function clearInlineTokens(doc) {
    if (!root.ThemeTokens || !root.ThemeTokens.tokenNames) return;
    root.ThemeTokens.tokenNames.forEach(function (name) {
      doc.documentElement.style.removeProperty("--" + name);
    });
  }

  function applyTokensForMode(doc, mode, palette) {
    if (
      TOKENIZED_PALETTES.indexOf(palette) !== -1 &&
      root.ThemeTokens &&
      typeof root.ThemeTokens.applyToElement === "function"
    ) {
      root.ThemeTokens.applyToElement(mode, doc.documentElement, palette);
    } else {
      clearInlineTokens(doc);
    }
  }

  function dispatchThemeChange(doc, mode, palette) {
    if (!doc.body || !doc.body.dispatchEvent) return;
    doc.body.dispatchEvent(
      new CustomEvent("themechange", {
        detail: { mode: mode, palette: palette },
      })
    );
  }

  /**
   * Apply light/dark mode.
   * @param {"light"|"dark"} mode
   * @param {{ persist?: boolean, toggleBtn?: HTMLInputElement|null, paletteSelect?: HTMLSelectElement|null }} [opts]
   */
  function setMode(mode, opts) {
    var doc = getDocument();
    if (!doc || !doc.body) return;

    var resolved = mode === "dark" ? "dark" : "light";
    var persist = !opts || opts.persist !== false;
    var toggleBtn = opts && opts.toggleBtn;
    var palette = getPalette();

    doc.body.classList.remove("dark-mode", "light-mode");
    doc.body.classList.add(resolved === "dark" ? "dark-mode" : "light-mode");
    doc.documentElement.setAttribute("data-theme", resolved);

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

    dispatchThemeChange(doc, resolved, palette);
    return resolved;
  }

  /**
   * Apply theme palette (default, purple-white, or black-white).
   * @param {"default"|"purple-white"|"black-white"} palette
   * @param {{ persist?: boolean, paletteSelect?: HTMLSelectElement|null, toggleBtn?: HTMLInputElement|null }} [opts]
   */
  function setPalette(palette, opts) {
    var doc = getDocument();
    if (!doc || !doc.body) return;

    var resolved = normalizePalette(palette);
    var persist = !opts || opts.persist !== false;
    var paletteSelect = opts && opts.paletteSelect;
    var mode = getMode();

    doc.documentElement.setAttribute("data-theme-palette", resolved);
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

    dispatchThemeChange(doc, mode, resolved);
    return resolved;
  }

  function toggle(opts) {
    return setMode(getMode() === "dark" ? "light" : "dark", opts);
  }

  /**
   * Initialize palette + mode from storage / system preference.
   * When no palette has been stored, keeps the default color theme.
   * @param {{ toggleBtn?: HTMLInputElement|null, paletteSelect?: HTMLSelectElement|null }} [opts]
   */
  function init(opts) {
    var doc = getDocument();
    var storedMode = null;
    var palette = getPalette();

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
    PALETTES: PALETTES,
    PALETTE_LABELS: PALETTE_LABELS,
    getMode: getMode,
    getPalette: getPalette,
    setMode: setMode,
    setPalette: setPalette,
    toggle: toggle,
    init: init,
  };
});
