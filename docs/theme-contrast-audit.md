# Yellow palette contrast audit (WO-03)

**Date:** 2026-07-22  
**Work order:** WO-03 — Accessibility contrast audit for yellow palette  
**Feature:** CTCTTY — change the colour theme to yellow  
**Standard:** WCAG 2.1 AA (normal text ≥ 4.5:1, UI chrome ≥ 3:1)  
**Scanner:** `node scripts/audit-theme-contrast.js --palette=yellow`

## Result

| Metric | Value |
|--------|-------|
| Pairs checked | 32 (16 light + 16 dark) |
| Passed | **32** |
| Failed | **0** |

All audited text/background/button pairs for the yellow palette meet WCAG AA after token adjustments.

## Adjustments made

| Token | Mode | Before | After | Why |
|-------|------|--------|-------|-----|
| `accent-purple` | light | `#f59e0b` | `#d97706` | Accent on white was 2.15:1 (UI need ≥3) |
| `primary-purple-deep` | dark | `#78350f` | `#f59e0b` | Dark text-on-primary failed on deep amber (1.93:1) |
| `surface-white` | dark | `#fef3c7` | `#292524` | Light cream + light text pairs failed (~1:1) |
| `text-on-surface` | dark | `#fef3c7` | `#fffbeb` | Align with elevated dark surfaces |

## How to re-run

```bash
npm run audit:contrast
# or
node scripts/audit-theme-contrast.js --palette=yellow
node scripts/audit-theme-contrast.js --palette=yellow --json
node scripts/audit-theme-contrast.js --palette=yellow --write=docs/theme-contrast-audit.snapshot.json
```

Exit code `1` if any pair fails — suitable for CI gating.

## Pairs covered

- Button labels: `text-on-primary` on `primary-purple` / hover / deep  
- Body & surface text on `surface-white`, `bg-page-start`, `surface-card`, `surface-white-muted`, `accent-purple-soft`  
- UI chrome: `primary` / `secondary` / `accent` on `surface-white` (≥3:1)  
- Alerts: `success-*` and `danger-*` text on their backgrounds  
