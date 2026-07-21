# Theme & color usage audit (WO-01)

**Date:** 2026-07-21  
**Repository:** `millerjulia926-netizen/To-Do-List-Application`  
**Work order:** WO-01 — Audit current theme and color usage  
**Feature:** CTTTPA — change the theme to purple and white  
**Scanner:** `node scripts/audit-theme-colors.js`

## Executive summary

| Metric | Result |
|--------|--------|
| Color literal locations | `theme-tokens.css`, `src/theme/tokens.js` only |
| Hardcoded colors in UI consumers (`style.css`, `index.html`, …) | **0** |
| Unique hex/rgb values (across token sources) | ~67 |
| CSS custom properties defined | **38** unique (`--primary-blue`, `--surface-white`, …) |
| CSS `var(--*)` usages in `style.css` | **~150** |
| Centralized token module | Yes — CSS + JS (blue/white) |
| Theme mechanism today | `ThemeProvider` + `body.light-mode` / `body.dark-mode` + `data-theme` |
| Purple/white palette | **Not present** — brand tokens are still blue-named / blue-valued |
| Settings → Appearance theme selector | **Not present** |

The prior blue/white migration (CTTOTA) already centralized colors into tokens and wired consumers through CSS variables. This audit is the baseline for **purple/white** (CTTTPA): WO-02 should redefine the brand token set; WO-03 should ensure the theming mechanism can apply and toggle that palette (including Settings appearance).

## Sources scanned

| File | Role | Color findings |
|------|------|----------------|
| `theme-tokens.css` | CSS token source of truth | All light + dark literal values (~76) |
| `src/theme/tokens.js` | JS mirror of the same palette | Same literals (~76); kept in sync with CSS |
| `src/theme/theme-provider.js` | Runtime light/dark apply | No color literals |
| `style.css` | Primary stylesheet | **No** hex/rgb; uses `var(--token)` throughout |
| `index.html` | Markup | Theme toggle uses `currentColor`; Bootstrap utility classes for some buttons |
| `index.js` | Behavior | Theme via `ThemeProvider`; no color literals |
| `scroll.js` / `scroll_img.svg` | Helpers / icon | No color literals / `currentColor` |

Re-run anytime:

```bash
node scripts/audit-theme-colors.js
node scripts/audit-theme-colors.js --json
node scripts/audit-theme-colors.js --token-file=theme-tokens.css
```

With `--token-file=theme-tokens.css`, the script treats `src/theme/tokens.js` as a paired source (not a consumer violation). Exit code `1` if any other file still has hardcoded colors.

## Theme tokens today (blue/white)

Defined on `:root` / `body.light-mode` and overridden under `body.dark-mode` in `theme-tokens.css` (mirrored in `src/theme/tokens.js`).

### Brand / primary (migration targets → purple)

| Token | Light | Dark | UI role |
|-------|-------|------|---------|
| `--primary-blue` | `#1e88e5` | `#4fc3f7` | Primary buttons, borders, accents |
| `--primary-blue-hover` | `#1565c0` | `#29b6f6` | Hover / active |
| `--primary-blue-deep` | `#183153` | `#0d47a1` | Deep chrome / switch checked |
| `--secondary-blue` | `#0081a7` | `#81d4fa` | Secondary accents / preloader |
| `--accent-blue` | `#73c0fc` | `#74b9ff` | Title, icons, switch track |
| `--accent-blue-soft` | `#99cafb` | `#90caf9` | Soft accents / shadows |

### Surfaces & page background (keep white family)

| Token | Light | Dark | UI role |
|-------|-------|------|---------|
| `--surface-white` | `#ffffff` | `#e3f2fd` | Cards, panels, inputs |
| `--surface-white-muted` | `#f5f9fc` | `#1a2332` | Muted surfaces |
| `--surface-glass` / `--surface-card` | frosted whites | blue-tinted glass | Main panel |
| `--bg-page-start` / `--bg-page-end` | `#ffffff` → `#99cafb` | `#0d1b2a` → `#1b3a5c` | Page / footer radial |

### Text, neutrals, borders, semantic

| Family | Tokens | Notes |
|--------|--------|-------|
| Text | `--text-on-primary`, `--text-on-surface`, `--text-primary`, `--text-secondary`, `--text-muted` | Dark navy on light; light text on dark |
| Neutrals | `--neutral-50` … `--neutral-900` | Scrollbars, shadows, GitHub icon |
| Borders / focus | `--border-muted`, `--border-accent`, `--focus-ring` | Inputs, glass edges |
| Priority / alerts | `--priority-*`, `--success-*`, `--danger-*` | Keep semantic; not brand purple |

Full catalog: [`docs/theme-tokens.md`](theme-tokens.md).

## Palette inventory by UI surface

Mapped to acceptance criteria for REQ-CTTTPA-001 (nav, buttons, cards, etc.).

### Navigation / chrome / header

| Surface | Mechanism | Current tokens |
|---------|-----------|----------------|
| Page background | `style.css` body gradients | `--bg-page-start`, `--bg-page-end` |
| Theme switch | `.switch` / `.slider` | `--accent-blue`, `--primary-blue-deep`, `--neutral-100` |
| Sun/moon icons | `currentColor` in SVG | Inherits text/chrome color |
| GitHub icon | `.github-icon` | `--neutral-900` / mode neutrals |
| Title | `.titleText` | `--accent-blue` |

### Primary / secondary actions (buttons)

| Surface | Mechanism | Current tokens / notes |
|---------|-----------|------------------------|
| App-themed buttons | `.btn` overrides in `style.css` | `--primary-blue`, `--primary-blue-hover`, `--text-on-primary` |
| Confirm / add / edit / clear | Bootstrap classes (`btn-outline-success`, `btn-outline-primary`, `btn-outline-danger`, `btn-dark`) | Framework greens/reds/darks — **not** app tokens; still visible default-theme colors (AC-CTTTPA-001.2 gap) |
| Voice command | `.voice-input` | Uses primary / surface tokens via CSS |

### Surfaces / cards / panels

| Surface | Tokens |
|---------|--------|
| Main task panel | `--surface-glass`, `--border-accent`, `--accent-blue-soft` |
| Inputs / cards | `--surface-card`, `--surface-white`, `--border-muted`, `--primary-blue` |
| Confirm dialogs | `--surface-white`, `--bg-overlay` |
| Footer | same page gradient tokens |

### Priority / status / feedback

| Surface | Tokens |
|---------|--------|
| Task priority borders | `--priority-high/medium/low/done` |
| Success / danger messages | `--success-*`, `--danger-*` |
| Filter dropdown chips | `--primary-blue` ladder / related primary tokens |

## Theme references (runtime)

| Reference | Location | Behavior |
|-----------|----------|----------|
| `ThemeTokens` | `src/theme/tokens.js` | Palette map + `applyToElement(mode)` |
| `ThemeProvider` | `src/theme/theme-provider.js` | Persist `localStorage["dark-mode"]`, set `body.light-mode`/`dark-mode`, `data-theme`, apply tokens |
| Toggle UI | `#modeToggle` in `index.html` | Light/dark only — **not** a Purple/White vs default selector |
| Stylesheet link | `index.html` → `theme-tokens.css` then `style.css` | Cascade order established |

No `Settings > Appearance` UI exists yet (REQ-CTTTPA-002).

## Findings & gaps vs purple/white goals

1. **Brand is blue, not purple** — Token names and values (`--primary-blue`, `#1e88e5`, …) must become a purple/white set in WO-02 (e.g. `--primary-purple` or renamed semantic tokens) so AC-CTTTPA-001.* can pass.
2. **Consumers already inherit tokens** — `style.css` has zero hardcoded hex/rgb; once WO-02 updates token values (and preferably names), most chrome updates without per-component overrides (supports AC-CTTTPA-001.3).
3. **Bootstrap utility colors remain** — Outline success/primary/danger/dark buttons still show framework greens/blues/reds; need tokenized classes or overrides so no default-theme colors remain (AC-CTTTPA-001.2).
4. **No Purple/White theme option in Settings** — Only a light/dark switch exists; WO-03 must add Appearance selection and live apply without reload (AC-CTTTPA-002.*).
5. **Duplicated sources of truth** — `theme-tokens.css` and `src/theme/tokens.js` must stay aligned when purple values are introduced.
6. **Audit gate** — After WO-02/WO-03, keep `node scripts/audit-theme-colors.js --token-file=theme-tokens.css` green (exit 0).

## Dominant families for WO-02 (suggested direction)

| Family | Current examples | Purple/white direction |
|--------|------------------|------------------------|
| Primary brand | `#1e88e5`, `#1565c0`, `#4fc3f7` | Purple primaries + white text on primary |
| Accent | `#73c0fc`, `#99cafb` | Soft purple / lavender accents |
| Surfaces | `#ffffff`, frosted whites | Keep white / off-white surfaces |
| Page gradient end | `#99cafb` / dark blues | Purple-tinted end stops |
| Semantic priority/alert | red / orange / green | Keep semantic; do not force purple |

## Out of scope for this work order

- Defining the purple/white token palette (WO-02)
- Extending the theming mechanism / Appearance selector (WO-03)
- Replacing Bootstrap button utilities with tokenized styles (follow-on of WO-02/03)
