# Design tokens (purple/white + black & white)

Centralized palettes for the To-Do List app (`REQ-CTTTPA` / `REQ-CTTCTB`).  
**Sources of truth:**

| Layer | Path |
|-------|------|
| CSS custom properties | [`theme-tokens.css`](../theme-tokens.css) |
| JS token module | [`src/theme/tokens.js`](../src/theme/tokens.js) |

Update both when changing a color. Prefer `var(--token-name)` in CSS and `ThemeTokens` in JS — do not add new hardcoded hex/rgb values in components.

## Naming convention

| Pattern | Example | Use |
|---------|---------|-----|
| `primary-purple` | `--primary-purple` | Main brand / primary actions (purple or grayscale by palette) |
| `primary-purple-hover` | `--primary-purple-hover` | Hover / active primary |
| `primary-purple-deep` | `--primary-purple-deep` | Deep accents (e.g. toggle checked) |
| `secondary-purple` | `--secondary-purple` | Secondary actions / supporting chrome |
| `accent-purple` | `--accent-purple` | Highlights, icons, accents |
| `accent-purple-soft` | `--accent-purple-soft` | Soft fills, gradient ends |
| `surface-white` | `--surface-white` | Solid white / near-white surfaces |
| `text-on-primary` | `--text-on-primary` | Text on primary buttons/chrome |
| `neutral-*` | `--neutral-100` … `--neutral-900` | Grayscale ladder |
| `priority-*` / `success-*` / `danger-*` | `--priority-high` | Semantic status colors |

Token **names** stay stable across palettes so `style.css` keeps using the same `var(--…)` references.

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
ThemeTokens.applyToElement("light", document.documentElement, "black-white");
const mono = ThemeTokens.palettes["black-white"]["primary-purple"].light;
```

Light values apply on `:root` / `body.light-mode`. Dark values apply under `body.dark-mode`.

## Theming mechanism

| Piece | Path | Role |
|-------|------|------|
| Token CSS | `theme-tokens.css` | Default on `:root`; overrides under `data-theme-palette` |
| JS tokens | `src/theme/tokens.js` | `palettes["purple-white"]` and `palettes["black-white"]` for runtime apply |
| Provider | `src/theme/theme-provider.js` | Persists palette + mode; sets `data-theme-palette` and `data-theme` |
| Settings UI | `index.html` → Settings → Appearance | Theme selector (Default / Purple/White / Black & White) |

```js
ThemeProvider.setPalette("black-white"); // or "default" | "purple-white"
ThemeProvider.setMode("light");          // or "dark"
ThemeProvider.init({ toggleBtn, paletteSelect });
```

Storage keys: `theme-palette` (`default` | `purple-white` | `black-white`), `dark-mode` (`enabled` | null).

## Black & white palette (WO-01 / REQ-CTTCTB)

Monochrome values only (equal RGB / neutral grays). No hue. Applied when
`html[data-theme-palette="black-white"]` is set.

### Brand & actions (grayscale)

| Token | Light | Dark | Role |
|-------|-------|------|------|
| primary-purple | `#111111` | `#f5f5f5` | Primary actions |
| primary-purple-hover | `#000000` | `#ffffff` | Hover/active |
| primary-purple-deep | `#000000` | `#d4d4d4` | Deep accents |
| secondary-purple | `#404040` | `#a3a3a3` | Secondary actions |
| accent-purple | `#737373` | `#d4d4d4` | Highlights |
| accent-purple-soft | `#e5e5e5` | `#404040` | Soft fills |

### Surfaces & page background

| Token | Light | Dark |
|-------|-------|------|
| surface-white | `#ffffff` | `#e5e5e5` |
| surface-white-muted | `#f5f5f5` | `#171717` |
| bg-page-start | `#ffffff` | `#0a0a0a` |
| bg-page-end | `#e5e5e5` | `#262626` |

### Text & neutrals

| Token | Light | Dark |
|-------|-------|------|
| text-primary | `#111111` | `#fafafa` |
| text-secondary | `#525252` | `#d4d4d4` |
| text-muted | `#737373` | `#a3a3a3` |
| neutral-50 … neutral-900 | light gray ladder | inverted gray ladder |

Semantic priority/success/danger tokens are also remapped to grayscale under this palette.

## Purple/white catalog (CTTTPA)

See historical purple values in `theme-tokens.css` under
`html[data-theme-palette="purple-white"]` and `ThemeTokens.palettes["purple-white"]`.

## Migration notes

- Brand token **names** remain `*-purple` for compatibility; values swap by palette.
- Black & white tokens (WO-01) plug into the existing ThemeProvider wiring (WO-03+).
- After full migration, audits should treat `theme-tokens.css` + `src/theme/tokens.js` as the only files allowed to contain raw palette hex/rgb.
