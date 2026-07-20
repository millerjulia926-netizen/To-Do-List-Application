# Blue/white design tokens (WO-02)

Centralized palette for the To-Do List app (`REQ-CTTOTA-002`).  
**Sources of truth:**

| Layer | Path |
|-------|------|
| CSS custom properties | [`theme-tokens.css`](../theme-tokens.css) |
| JS token module | [`src/theme/tokens.js`](../src/theme/tokens.js) |

Update both when changing a color. Prefer `var(--token-name)` in CSS and `ThemeTokens` in JS — do not add new hardcoded hex/rgb values in components.

## How to use

```css
.header {
  background: var(--primary-blue);
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
const blue = ThemeTokens.palette["primary-blue"].light;
```

Light values apply on `:root` / `body.light-mode`. Dark values apply under `body.dark-mode`.

## Token catalog (AC-CTTOTA-002.2)

### Brand & actions

| Token | CSS variable | Role |
|-------|--------------|------|
| primary-blue | `--primary-blue` | Primary actions, key chrome |
| primary-blue-hover | `--primary-blue-hover` | Hover/active primary |
| primary-blue-deep | `--primary-blue-deep` | Deep navy accents (e.g. toggle checked) |
| secondary-blue | `--secondary-blue` | Secondary actions / supporting chrome |
| accent-blue | `--accent-blue` | Highlights, icons, accents |
| accent-blue-soft | `--accent-blue-soft` | Soft fills, gradient ends |

Primary/secondary buttons should use approved blues with `--text-on-primary` (white / near-white).

### Surfaces & page background

| Token | CSS variable | Role |
|-------|--------------|------|
| surface-white | `--surface-white` | Solid white / near-white surfaces |
| surface-white-muted | `--surface-white-muted` | Subtle panel backgrounds |
| surface-glass | `--surface-glass` | Frosted main panel |
| surface-card | `--surface-card` | Cards / elevated panels |
| bg-page-start | `--bg-page-start` | Page gradient start |
| bg-page-end | `--bg-page-end` | Page gradient end |
| bg-overlay | `--bg-overlay` | Modal / confirm overlays |

### Text

| Token | CSS variable | Role |
|-------|--------------|------|
| text-on-primary | `--text-on-primary` | Text on blue buttons/chrome |
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

- Legacy **purple** dark-mode accents (`rgb(146, 56, 255)`, etc.) are intentionally **not** represented; dark tokens stay in the blue family.
- Wiring existing `style.css` rules to these variables is follow-on theming work (WO-03+). Until then, components should adopt tokens as they are touched.
- After full migration, audits should treat `theme-tokens.css` as the only file allowed to contain raw palette hex/rgb (AC-CTTOTA-002.3).
