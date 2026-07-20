# Theme & color usage audit (WO-01)

**Date:** 2026-07-20  
**Repository:** `millerjulia926-netizen/To-Do-List-Application`  
**Work order:** WO-01 — Audit current theme and color usage  
**Scanner:** `node scripts/audit-theme-colors.js`

## Executive summary

| Metric | Result |
|--------|--------|
| Files with color literals | `style.css`, `index.html`, `scroll_img.svg` |
| Total color occurrences | ~141 (after excluding HTML-entity false positives) |
| Unique color values | ~80+ |
| CSS custom properties (`--token`) | **None defined, none used** |
| Centralized token module | **Does not exist** |
| Theme mechanism today | Class toggles: `light-mode` / `dark-mode` on `body` |

The app already leans blue/white in light mode, but dark mode and several controls use **purple** accents (`rgb(146, 56, 255)` and related). All colors are hardcoded; there is no shared token surface for WO-02 / WO-03 to extend.

`Brand Guidelines.txt` is **not present** in this repository, so values below are inventoried as-is for the blue/white migration.

## Sources scanned

| File | Role | Color findings |
|------|------|----------------|
| `style.css` | Primary stylesheet | Vast majority of literals (backgrounds, buttons, borders, priorities, scrollbar, footer) |
| `index.html` | Markup + inline styles | Theme toggle sun fill `#ffd43b`; priority `<option>` backgrounds/text |
| `index.js` | Behavior | No meaningful color literals (icons use font-size only) |
| `scroll.js` | Scroll helper | No colors |
| `scroll_img.svg` | Icon | `currentColor` only |

## Theme tokens today

**None.** Grep for `--*` definitions and `var(--*)` usages returns empty. Theming is entirely selector-based:

- `body` / `.light-mode …` — light blue radial backgrounds, white surfaces
- `body.dark-mode` / `.dark-mode …` — blue-purple gradient, purple borders/buttons

## Palette inventory by UI surface

### Navigation / chrome / header

| Usage | Values | Notes |
|-------|--------|-------|
| Page background (light) | `rgb(255, 255, 255)` → `rgb(153, 202, 251)` radial | Already blue/white leaning |
| Page background (dark) | `rgba(0, 60, 255, 0.756)`, `rgb(63, 76, 119)`, overlay `rgba(1,1,1,0.9)` | Blue-purple mix |
| Title text | `#79c5ff` (`.titleText`) | Light blue |
| Theme switch track | `#73c0fc` / checked `#183153` | Blue / navy |
| Theme switch thumb | `#e8e8e8` | Neutral |
| Sun icon fill (HTML) | `#ffd43b` | Yellow accent — legacy |
| GitHub icon | `black` / `rgb(227, 227, 227)` | Mode-specific |

### Primary / secondary actions (buttons)

| Usage | Values | Notes |
|-------|--------|-------|
| Dark-mode outline / solid buttons | `rgb(146, 56, 255)`, hover `rgb(123, 52, 210)`, text `#fff` | **Purple — not blue/white** |
| Disabled submit (dark) | `#27272790`, `#47474796`, `#f3f1f1` | Neutrals |
| Light-mode buttons | Bootstrap utility classes (`btn-outline-success`, `btn-outline-primary`) | Framework greens/blues, not app tokens |
| Voice command button | `#000000` / `#ffffff`, icon `rgb(159, 221, 255)` | High-contrast chrome |

### Surfaces / cards / panels

| Usage | Values | Notes |
|-------|--------|-------|
| Main panel (light) | `rgba(255,255,255,0.447)`, inset `rgb(204,219,232)`, border `rgba(255,255,255,0.18)` | Frosted white |
| Main panel (dark) | `rgba(83,83,83,0.25)`, border/shadow purple `rgba(146,56,255,…)` | Purple accent |
| Inputs (light) | `rgba(255,255,255,0.536)`, border `rgba(70,70,70,0.873)` | |
| Inputs (dark) | `rgb(255,255,255)`, border `rgb(146,56,255)` | Purple border |
| Confirm dialogs | `#fff` / dark `rgb(24,24,24)`, overlay `rgba(0,0,0,0.5)` | |
| Footer (light) | radial white → `rgb(175, 215, 255)` | Blue/white |
| Footer (dark) | `rgba(193, 99, 255, 0.25)` | Purple |

### Priority / status / feedback

| Usage | Values | Location |
|-------|--------|----------|
| High priority border | red rgba variants | `style.css` task-priority classes |
| Medium priority border | orange rgba variants | same |
| Low priority border | green rgba variants | same |
| Completed border | blue / purple rgba | light vs dark |
| Priority `<option>` inline styles | green / yellow / red rgba | `index.html` |
| Success / danger messages | Bootstrap-like greens/reds (`#0f5132`, `#d1e7dd`, … / `#842029`, `#f8d7da`, …) | `style.css` |
| Filter dropdown chips (light) | `#00bfffd5`, `#0091dfd8`, `#006dcdcc`, `#0075cea5` | Cyan/blue ladder |
| Filter dropdown chips (dark) | `#8000ffd5`, `#8d00dfd8`, `#8c00cdcc`, `#8d00cea5` | Purple ladder |

### Scrollbar / misc

| Usage | Values |
|-------|--------|
| Light scrollbar | track `#dfe6e9` / `#6c6c6c`, thumb `#74b9ff` |
| Dark scrollbar | track black/white, thumb `rgb(146, 56, 255)` |
| Preloader accent | `#0081a7` |
| Checkbox track | `#000` / knob `#fff`, inset `rgba(1, 110, 225)` |
| Back-to-top button | white + `#6c6c6c` shadow |

## Dominant hardcoded families (migration targets)

These clusters should become named tokens in WO-02 (suggested names align with REQ-CTTOTA-002):

| Family | Example literals | Suggested token direction |
|--------|------------------|---------------------------|
| Primary blue | `#73c0fc`, `#74b9ff`, `#79c5ff`, `rgb(153,202,251)`, `#00bfff…` | `primary-blue`, `accent-blue` |
| Surface white | `#fff`, `rgb(255,255,255)`, frosted whites | `surface-white`, `surface-glass` |
| Navy / deep blue | `#183153`, `rgba(0,60,255,0.756)`, `rgb(63,76,119)` | `primary-blue-deep`, `bg-dark` |
| Legacy purple (remove or replace) | `rgb(146,56,255)`, `rgb(123,52,210)`, purple dropdowns | Replace with blue equivalents |
| Neutrals | `#000`, `#333`, `#6c6c6c`, `#e8e8e8`, `#f1f1f1` | `text-primary`, `border-muted`, etc. |
| Semantic (priority/alert) | red / orange / green rgba sets | Keep semantic; optionally tokenized |

## Findings & gaps vs blue/white goals

1. **No token layer** — AC-CTTOTA-002.1 / 002.2 cannot be satisfied until a centralized token file exists (WO-02) and consumers reference it (WO-03+).
2. **Purple dark theme** — Dark mode buttons, borders, scrollbar thumb, footer, and filter chips use purple, conflicting with “blue and white palette” (AC-CTTOTA-001.*).
3. **Inline HTML colors** — Priority options and theme-toggle SVG bypass CSS; they will not pick up token updates until moved to classes/tokens.
4. **Bootstrap class colors** — Add/edit buttons rely on Bootstrap outline utilities; not inventoried as hex but still legacy palette surfaces.
5. **Duplicate light-mode blues** — Several near-equivalent blues (`#73c0fc`, `#74b9ff`, `#79c5ff`, `rgb(153,202,251)`) should collapse into fewer tokens.
6. **Audit gate for AC-CTTOTA-002.3** — Re-run `node scripts/audit-theme-colors.js --token-file=<centralized-file>` after migration; exit code `1` until hardcoded colors outside the token file reach zero.

## How to re-run

```bash
node scripts/audit-theme-colors.js
node scripts/audit-theme-colors.js --json
# After tokens exist:
node scripts/audit-theme-colors.js --token-file=path/to/tokens.css
```

## Out of scope for this work order

- Defining the blue/white token palette (WO-02)
- Wiring CSS custom properties / replacing literals (later WOs)
- Changing runtime theme behavior
