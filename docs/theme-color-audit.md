# Theme & color usage audit (WO-02 / REQ-CTTCTB)

**Date:** 2026-07-22  
**Repository:** `millerjulia926-netizen/To-Do-List-Application`  
**Work order:** WO-02 — Audit existing color usage  
**Feature:** CTTCTB — change the theme colour to black and white  
**Scanner:** `node scripts/audit-theme-colors.js`

## Executive summary

| Metric | Result |
|--------|--------|
| Color literal locations | Mostly `theme-tokens.css` + `src/theme/tokens.js` |
| Hardcoded colors in UI consumers | **1** — `style.css:1159` `rgba(0,0,0,0.12)` (settings panel shadow) |
| Unique hex/rgb values | **92** |
| Hued (non-grayscale) unique colors | **82** — monochrome migration targets |
| Grayscale unique colors | **10** |
| CSS custom properties defined | **38** unique |
| CSS `var(--*)` usages | **166** (`~37` unique names, mostly in `style.css`) |
| Centralized token module | Yes — CSS + JS (default + purple/white palettes) |
| Theme mechanism today | `ThemeProvider` + light/dark + `data-theme-palette` |
| Black & White palette | **Not present on `main`** — WO-01 defines tokens on its branch |
| Settings → Appearance | Default + Purple/White — **no Black & White option yet** |

Purple/white (CTTTPA) already centralized colors into tokens and wired consumers through CSS variables. This audit is the baseline for **black & white** (CTTCTB): brand/semantic hues must collapse to grayscale under a new palette option without breaking Default / Purple/White.

Machine-readable snapshot: [`theme-color-audit.snapshot.json`](theme-color-audit.snapshot.json).

## Sources scanned

| File | Role | Color findings |
|------|------|----------------|
| `theme-tokens.css` | CSS token source of truth | Default + purple/white light/dark literals (~152) |
| `src/theme/tokens.js` | JS mirror (purple/white) | ~76 literals; paired with CSS |
| `src/theme/theme-provider.js` | Runtime palette + mode | No color literals |
| `style.css` | Primary stylesheet | **1** hardcoded rgba (settings shadow); rest `var(--token)` |
| `index.html` | Markup | Bootstrap utility button classes; no hex/rgb |
| `index.js` | Behavior | Theme via `ThemeProvider`; no color literals |
| `scroll.js` / `scroll_img.svg` | Helpers / icon | No color literals / `currentColor` |

Re-run anytime:

```bash
node scripts/audit-theme-colors.js
node scripts/audit-theme-colors.js --flag-hues
node scripts/audit-theme-colors.js --json
node scripts/audit-theme-colors.js --token-file=theme-tokens.css
node scripts/audit-theme-colors.js --write=docs/theme-color-audit.snapshot.json
```

`--flag-hues` lists non-grayscale colors (channel delta > 2) — the set that must be remapped for monochrome. With `--token-file=theme-tokens.css`, the script treats `src/theme/tokens.js` as a paired source. Exit code `1` if any other file still has hardcoded colors.

## Theme tokens today (default + purple/white)

Defined on `:root` / `body.light-mode`, overridden under `body.dark-mode`, and again under `html[data-theme-palette="purple-white"]`.

### Brand / primary (hued → grayscale for Black & White)

| Token | Purple/white light (example) | Monochrome direction |
|-------|------------------------------|----------------------|
| `--primary-purple` | `#7c3aed` | Near-black / near-white |
| `--primary-purple-hover` | `#6d28d9` | Pure black / white |
| `--primary-purple-deep` | `#4c1d95` | Deep gray |
| `--secondary-purple` | `#9333ea` | Mid gray |
| `--accent-purple` | `#a78bfa` | Mid-light gray |
| `--accent-purple-soft` | `#ddd6fe` | Soft light gray |

### Surfaces & page background

| Token | Notes for B&W |
|-------|---------------|
| `--surface-white*` / glass / card | Keep white / near-white (or inverted in dark) |
| `--bg-page-start` / `--bg-page-end` | Drop purple tint; use white → light gray / black → dark gray |

### Semantic priority / alerts (still hued)

| Family | Current examples | Black & White direction |
|--------|------------------|-------------------------|
| `--priority-*` | red / orange / green / purple rgba | Distinct grayscale opacities |
| `--success-*` / `--danger-*` | greens / reds | Neutral gray fills + borders |

## Palette inventory by UI surface

### Navigation / chrome / header

| Surface | Mechanism | Current tokens |
|---------|-----------|----------------|
| Page background | `style.css` body gradients | `--bg-page-start`, `--bg-page-end` |
| Theme switch | `.switch` / `.slider` | `--accent-purple`, `--primary-purple-deep`, `--neutral-100` |
| GitHub icon | `.github-icon` | `--neutral-900` |
| Title | `.titleText` | `--accent-purple` |
| Settings panel | `.settings-panel` | `--surface-white`, `--border-muted`, **hardcoded** `rgba(0,0,0,0.12)` shadow |

### Primary / secondary actions

| Surface | Mechanism | Notes |
|---------|-----------|-------|
| App-themed buttons | `.btn` overrides | `--primary-purple*`, `--text-on-primary` — inherit B&W once palette exists |
| Confirm / add / edit / clear | Bootstrap (`btn-outline-success/primary/danger/dark`) | Framework greens/blues/reds — **visible hues** until overridden (WO-04) |
| Voice command | `.voice-input` | Uses primary / surface tokens |

### Surfaces / cards / panels

| Surface | Tokens |
|---------|--------|
| Main task panel | `--surface-glass`, `--border-accent`, `--accent-purple-soft` |
| Inputs / cards | `--surface-card`, `--surface-white`, `--border-muted`, `--primary-purple` |
| Confirm dialogs | `--surface-white`, `--bg-overlay` |

### Priority / status / feedback

| Surface | Tokens |
|---------|--------|
| Task priority borders | `--priority-high/medium/low/done` |
| Success / danger messages | `--success-*`, `--danger-*` |

## Theme references (runtime)

| Reference | Location | Behavior |
|-----------|----------|----------|
| `ThemeTokens` | `src/theme/tokens.js` | Purple/white palette map + `applyToElement` |
| `ThemeProvider` | `src/theme/theme-provider.js` | Persists `theme-palette` + `dark-mode`; sets `data-theme-palette` |
| Settings UI | `#themePaletteSelect` | Options: `default`, `purple-white` — **missing `black-white`** |
| Stylesheet link | `index.html` | `theme-tokens.css` then `style.css` |

## Findings & gaps vs black & white goals

1. **No Black & White palette on `main`** — WO-01 adds `data-theme-palette="black-white"` token values; WO-03 must wire the option into `ThemeProvider` + Settings.
2. **82 unique hued colors** live in token sources (default + purple/white + semantic). Monochrome must remap brand **and** semantic hues under the new palette; Default/Purple/White keep their hues.
3. **Consumers mostly inherit tokens** — `style.css` is nearly clean; swapping CSS variables under `black-white` updates chrome without per-rule edits (supports AC-CTTCTB-001.2).
4. **One consumer hardcode** — `style.css:1159` settings panel shadow should become a token (e.g. `--bg-overlay` / dedicated shadow token) in WO-04 so `--token-file` gate passes.
5. **Bootstrap utility colors remain** — Outline success/primary/danger/dark buttons still show framework hues when Black & White is selected; need tokenized overrides (WO-04 / layout restyle).
6. **Persistence** — Palette already uses `localStorage["theme-palette"]`; extend allowed values to include `black-white` and keep default when unset (AC-CTTCTB-001.3, AC-CTTCTB-002.*). Dual persistence to a backend `user_preferences` table is ADR intent — confirm in WO-03 if server support exists.
7. **Audit gate** — Keep `node scripts/audit-theme-colors.js --token-file=theme-tokens.css` green (exit 0) after consumer hardcodes are removed. Use `--flag-hues` to verify monochrome token blocks introduce no new hues.

## Dominant families for Black & White migration

| Family | Current examples | Black & White direction |
|--------|------------------|-------------------------|
| Primary brand | `#7c3aed`, `#a78bfa`, `#4c1d95` | `#111111` / `#f5f5f5` ladder |
| Accent / soft | `#ddd6fe`, `#ede9fe` | Light neutrals (`#e5e5e5`) |
| Surfaces | whites + purple-tinted dark | Pure white / near-black |
| Page gradient | purple-tinted ends | Gray ends only |
| Semantic priority/alert | red / orange / green | Grayscale opacity tiers |

## Out of scope for this work order

- Defining the black-and-white token palette (WO-01)
- Wiring ThemeProvider / Appearance selector for Black & White (WO-03)
- Restyling layout / Bootstrap / remaining hardcoded shadow (WO-04)
