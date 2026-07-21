# Design tokens (WO-01 / REQ-MTTCRA)

Centralized palettes for the To-Do List app.  
**Sources of truth:**

| Layer | Path |
|-------|------|
| CSS custom properties | [`theme-tokens.css`](../theme-tokens.css) |
| JS token module | [`src/theme/tokens.js`](../src/theme/tokens.js) |

Update both when changing a color. Prefer `var(--token-name)` in CSS and `ThemeTokens` in JS — do not add new hardcoded hex/rgb values in components.

## Naming convention

CSS custom property names keep the historical `*-purple` brand prefix. Values resolve to the **active palette** (default blue baseline, purple/white, or red/white).

| Pattern | Example | Use |
|---------|---------|-----|
| `primary-purple` | `--primary-purple` | Main brand color for buttons, borders, key chrome |
| `primary-purple-hover` | `--primary-purple-hover` | Hover / active primary |
| `primary-purple-deep` | `--primary-purple-deep` | Deep brand accents (e.g. toggle checked) |
| `secondary-purple` | `--secondary-purple` | Secondary actions / supporting chrome |
| `accent-purple` | `--accent-purple` | Highlights, icons, accents |
| `accent-purple-soft` | `--accent-purple-soft` | Soft fills, gradient ends |
| `surface-white` | `--surface-white` | Solid white / near-white surfaces |
| `text-on-primary` | `--text-on-primary` | Text on brand buttons/chrome |
| `neutral-*` | `--neutral-100` … `--neutral-900` | Grayscale ladder |
| `priority-*` / `success-*` / `danger-*` | `--priority-high` | Semantic status colors |

## Red/white palette (MTTCRA / WO-01)

Canonical brand reds + white surfaces. Status colors stay **distinct** from brand red so meaning is preserved (AC-MTTCRA-002.2).

### Brand & actions

| Token | CSS variable | Light | Dark | Role |
|-------|--------------|-------|------|------|
| primary-purple | `--primary-purple` | `#b91c1c` | `#f87171` | Primary actions, key chrome (AA with white text) |
| primary-purple-hover | `--primary-purple-hover` | `#991b1b` | `#ef4444` | Hover/active primary |
| primary-purple-deep | `--primary-purple-deep` | `#7f1d1d` | `#450a0a` | Deep red accents |
| secondary-purple | `--secondary-purple` | `#dc2626` | `#fca5a5` | Secondary actions |
| accent-purple | `--accent-purple` | `#ef4444` | `#fecaca` | Highlights, icons |
| accent-purple-soft | `--accent-purple-soft` | `#fecaca` | `#b91c1c` | Soft fills, gradient ends |

### Surfaces & page background

| Token | CSS variable | Light | Dark | Role |
|-------|--------------|-------|------|------|
| surface-white | `--surface-white` | `#ffffff` | `#fef2f2` | Solid white surfaces |
| surface-white-muted | `--surface-white-muted` | `#fef2f2` | `#450a0a` | Subtle panel backgrounds |
| bg-page-start | `--bg-page-start` | `#ffffff` | `#450a0a` | Page gradient start |
| bg-page-end | `--bg-page-end` | `#fee2e2` | `#7f1d1d` | Page gradient end |

### Semantic (distinct from brand red)

| Token | Light approach | Role |
|-------|----------------|------|
| priority-high | Orange (`#ea580c`) | High priority — not brand crimson |
| priority-medium | Amber | Medium priority |
| priority-low | Green | Low priority |
| success-* | Green | Success messages |
| danger-* | Rose (`#9f1239`) | Errors — distinct from `#dc2626` brand |

## How to use

```css
.header {
  background: var(--primary-purple);
  color: var(--text-on-primary);
}

.card {
  background: var(--surface-white);
  border-color: var(--border-muted);
}
```

```js
// Classic script: ThemeTokens is on window after loading src/theme/tokens.js
ThemeTokens.applyToElement("light", document.documentElement, "red-white");
const red = ThemeTokens.palettes["red-white"]["primary-purple"].light;
```

Light values apply on `:root` / `body.light-mode`. Dark values apply under `body.dark-mode`.

## Theming mechanism

| Piece | Path | Role |
|-------|------|------|
| Token CSS | `theme-tokens.css` | Default on `:root`; overrides under `html[data-theme-palette="purple-white"\|"red-white"]` |
| JS tokens | `src/theme/tokens.js` | `palettes["red-white"]` / `palettes["purple-white"]` for runtime apply |
| Provider | `src/theme/theme-provider.js` | Persists palette + mode + high contrast; sets `data-theme-palette` / `data-high-contrast` |
| Settings UI | `index.html` → Settings → Appearance | Theme selector including **Red & White**; **High contrast** toggle |

```js
ThemeProvider.setPalette("red-white"); // or "default" | "purple-white"
ThemeProvider.setMode("light");
ThemeProvider.setHighContrast(true);
ThemeProvider.init({ toggleBtn, paletteSelect, highContrastToggle });
```

Storage keys: `theme-palette` (`default` | `purple-white` | `red-white`), `dark-mode` (`enabled` | null), `theme-high-contrast` (`enabled` | null).

## Migration notes

- Brand token *names* remain `*-purple` for CSS compatibility; red/white supplies red hex values.
- After full migration, audits should treat `theme-tokens.css` + `src/theme/tokens.js` as the only files allowed to contain raw palette hex/rgb.
