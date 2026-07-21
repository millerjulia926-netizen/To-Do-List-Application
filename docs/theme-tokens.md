# Purple/white design tokens (WO-02)

Centralized palette for the To-Do List app (`REQ-CTTTPA-002`).  
**Sources of truth:**

| Layer | Path |
|-------|------|
| CSS custom properties | [`theme-tokens.css`](../theme-tokens.css) |
| JS token module | [`src/theme/tokens.js`](../src/theme/tokens.js) |

Update both when changing a color. Prefer `var(--token-name)` in CSS and `ThemeTokens` in JS — do not add new hardcoded hex/rgb values in components.

## Naming convention

| Pattern | Example | Use |
|---------|---------|-----|
| `primary-purple` | `--primary-purple` | Main brand purple for buttons, borders, key chrome |
| `primary-purple-hover` | `--primary-purple-hover` | Hover / active primary |
| `primary-purple-deep` | `--primary-purple-deep` | Deep purple accents (e.g. toggle checked) |
| `secondary-purple` | `--secondary-purple` | Secondary actions / supporting chrome |
| `accent-purple` | `--accent-purple` | Highlights, icons, accents |
| `accent-purple-soft` | `--accent-purple-soft` | Soft fills, gradient ends |
| `surface-white` | `--surface-white` | Solid white / near-white surfaces |
| `text-on-primary` | `--text-on-primary` | Text on purple buttons/chrome |
| `neutral-*` | `--neutral-100` … `--neutral-900` | Grayscale ladder |
| `priority-*` / `success-*` / `danger-*` | `--priority-high` | Semantic status colors |

Primary/secondary buttons should use approved purples with `--text-on-primary` (white).

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
ThemeTokens.applyToElement("light"); // optional runtime apply
const purple = ThemeTokens.palette["primary-purple"].light;
```

Light values apply on `:root` / `body.light-mode`. Dark values apply under `body.dark-mode`.

## Theming mechanism (WO-03)

| Piece | Path | Role |
|-------|------|------|
| Token CSS | `theme-tokens.css` | Default palette on `:root`; purple/white overrides under `html[data-theme-palette="purple-white"]` |
| JS tokens | `src/theme/tokens.js` | Purple/white values for runtime `applyToElement` |
| Provider | `src/theme/theme-provider.js` | Persists palette + mode; sets `data-theme-palette` and `data-theme` |
| Settings UI | `index.html` → Settings → Appearance | Theme selector: **Default** or **Purple/White** (immediate apply) |

```js
ThemeProvider.setPalette("purple-white"); // or "default"
ThemeProvider.setMode("light");           // or "dark"
ThemeProvider.init({ toggleBtn, paletteSelect });
```

Storage keys: `theme-palette` (`default` | `purple-white`), `dark-mode` (`enabled` | null).

## Token catalog (AC-CTTTPA-002.2)

### Brand & actions

| Token | CSS variable | Light | Dark | Role |
|-------|--------------|-------|------|------|
| primary-purple | `--primary-purple` | `#7c3aed` | `#a78bfa` | Primary actions, key chrome |
| primary-purple-hover | `--primary-purple-hover` | `#6d28d9` | `#8b5cf6` | Hover/active primary |
| primary-purple-deep | `--primary-purple-deep` | `#4c1d95` | `#2e1065` | Deep purple accents |
| secondary-purple | `--secondary-purple` | `#9333ea` | `#c084fc` | Secondary actions |
| accent-purple | `--accent-purple` | `#a78bfa` | `#c4b5fd` | Highlights, icons |
| accent-purple-soft | `--accent-purple-soft` | `#ddd6fe` | `#6d28d9` | Soft fills, gradient ends |

### Surfaces & page background

| Token | CSS variable | Light | Dark | Role |
|-------|--------------|-------|------|------|
| surface-white | `--surface-white` | `#ffffff` | `#f5f3ff` | Solid white surfaces |
| surface-white-muted | `--surface-white-muted` | `#faf5ff` | `#1e1b4b` | Subtle panel backgrounds |
| surface-glass | `--surface-glass` | frosted white | purple glass | Frosted main panel |
| surface-card | `--surface-card` | frosted white | dark purple card | Cards / elevated panels |
| bg-page-start | `--bg-page-start` | `#ffffff` | `#1e1b4b` | Page gradient start |
| bg-page-end | `--bg-page-end` | `#ede9fe` | `#4c1d95` | Page gradient end |
| bg-overlay | `--bg-overlay` | `rgba(0,0,0,0.5)` | `rgba(1,1,1,0.85)` | Modal overlays |

### Text

| Token | CSS variable | Role |
|-------|--------------|------|
| text-on-primary | `--text-on-primary` | Text on purple buttons/chrome |
| text-on-surface | `--text-on-surface` | Body text on cards |
| text-primary | `--text-primary` | Default strong text |
| text-secondary | `--text-secondary` | Supporting copy |
| text-muted | `--text-muted` | De-emphasized labels |

### Neutrals & borders

| Token | CSS variable | Role |
|-------|--------------|------|
| neutral-50 … neutral-900 | `--neutral-*` | Grayscale ladder |
| border-muted | `--border-muted` | Default borders |
| border-accent | `--border-accent` | Soft / glass borders |
| focus-ring | `--focus-ring` | Focus and inset highlights |

### Semantic (priority & alerts)

| Token | CSS variable | Role |
|-------|--------------|------|
| priority-high / medium / low / done | `--priority-*` | Task priority indicators |
| success-text / bg / border | `--success-*` | Success messages |
| danger-text / bg / border | `--danger-*` | Error messages |

## Migration notes

- Brand tokens were renamed from `*-blue` to `*-purple` with purple/white values (CTTTPA).
- Wiring existing `style.css` rules to the new variable names is follow-on theming work (WO-03+).
- After full migration, audits should treat `theme-tokens.css` as the only file allowed to contain raw palette hex/rgb (AC-CTTTPA-002.3).
