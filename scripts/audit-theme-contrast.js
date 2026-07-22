#!/usr/bin/env node
/**
 * WCAG contrast audit for theme palettes (WO-03 / REQ-CTCTTY).
 *
 * Checks text/background/button token pairs against WCAG AA:
 *   - Normal text:  >= 4.5:1
 *   - Large text / UI chrome (buttons, borders on UI): >= 3:1
 *
 * Usage:
 *   node scripts/audit-theme-contrast.js
 *   node scripts/audit-theme-contrast.js --palette=yellow
 *   node scripts/audit-theme-contrast.js --json
 *   node scripts/audit-theme-contrast.js --write=docs/theme-contrast-audit.snapshot.json
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ThemeTokens = require(path.join(ROOT, "src/theme/tokens.js"));

const AA_NORMAL = 4.5;
const AA_UI = 3.0;

/** Critical pairs for each mode: [fgToken, bgToken, minRatio, role] */
const PAIRS = [
  ["text-on-primary", "primary-purple", AA_NORMAL, "Button label on primary"],
  ["text-on-primary", "primary-purple-hover", AA_NORMAL, "Button label on primary hover"],
  ["text-on-primary", "primary-purple-deep", AA_NORMAL, "Button label on primary deep"],
  ["text-primary", "surface-white", AA_NORMAL, "Body text on surface"],
  ["text-primary", "bg-page-start", AA_NORMAL, "Body text on page start"],
  ["text-on-surface", "surface-white", AA_NORMAL, "Surface text on white"],
  ["text-on-surface", "surface-card", AA_NORMAL, "Surface text on card"],
  ["text-secondary", "surface-white", AA_NORMAL, "Secondary text on surface"],
  ["text-muted", "surface-white", AA_NORMAL, "Muted text on surface"],
  ["text-primary", "surface-white-muted", AA_NORMAL, "Body text on muted surface"],
  ["primary-purple", "surface-white", AA_UI, "Primary chrome on white (UI)"],
  ["secondary-purple", "surface-white", AA_UI, "Secondary chrome on white (UI)"],
  ["accent-purple", "surface-white", AA_UI, "Accent on white (UI)"],
  ["text-primary", "accent-purple-soft", AA_NORMAL, "Text on soft accent fill"],
  ["success-text", "success-bg", AA_NORMAL, "Success message text"],
  ["danger-text", "danger-bg", AA_NORMAL, "Danger message text"],
];

function parseArgs(argv) {
  const opts = {
    json: false,
    write: null,
    palette: "yellow",
  };
  for (const arg of argv) {
    if (arg === "--json") opts.json = true;
    else if (arg.startsWith("--write=")) opts.write = arg.slice(8);
    else if (arg.startsWith("--palette=")) opts.palette = arg.slice(10);
  }
  return opts;
}

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function parseColor(raw) {
  if (!raw || typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();

  let m = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length === 8) hex = hex.slice(0, 6);
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }

  m = value.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (m) {
    return {
      r: Number(m[1]),
      g: Number(m[2]),
      b: Number(m[3]),
      a: m[4] !== undefined ? Number(m[4]) : 1,
    };
  }

  return null;
}

/** Composite semi-transparent fg over opaque bg (both sRGB 0–255). */
function compositeOver(fg, bg) {
  const a = clamp01(fg.a);
  if (a >= 1) return { r: fg.r, g: fg.g, b: fg.b, a: 1 };
  return {
    r: fg.r * a + bg.r * (1 - a),
    g: fg.g * a + bg.g * (1 - a),
    b: fg.b * a + bg.b * (1 - a),
    a: 1,
  };
}

function channelLuminance(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(color) {
  return (
    0.2126 * channelLuminance(color.r) +
    0.7152 * channelLuminance(color.g) +
    0.0722 * channelLuminance(color.b)
  );
}

function contrastRatio(fg, bg) {
  const L1 = relativeLuminance(fg);
  const L2 = relativeLuminance(bg);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveOpaque(tokenValue, fallbackBg, palette, mode) {
  const parsed = parseColor(tokenValue);
  if (!parsed) return null;
  if (parsed.a >= 0.999) return parsed;
  const bgParsed = parseColor(fallbackBg) || { r: 255, g: 255, b: 255, a: 1 };
  // If fallback itself is translucent, composite onto white/black by mode.
  const opaqueFallback =
    bgParsed.a < 0.999
      ? compositeOver(bgParsed, mode === "dark" ? { r: 0, g: 0, b: 0, a: 1 } : { r: 255, g: 255, b: 255, a: 1 })
      : bgParsed;
  return compositeOver(parsed, opaqueFallback);
}

function auditPalette(paletteName) {
  const map = ThemeTokens.resolvePalette(paletteName);
  const results = [];

  for (const mode of ["light", "dark"]) {
    for (const [fgName, bgName, minRatio, role] of PAIRS) {
      const fgRaw = map[fgName] && map[fgName][mode];
      const bgRaw = map[bgName] && map[bgName][mode];
      if (!fgRaw || !bgRaw) {
        results.push({
          palette: paletteName,
          mode,
          fg: fgName,
          bg: bgName,
          role,
          minRatio,
          ratio: null,
          pass: false,
          error: "missing token",
          fgValue: fgRaw || null,
          bgValue: bgRaw || null,
        });
        continue;
      }

      // For translucent surfaces (cards/glass), composite over page background.
      const pageBg = map["bg-page-start"][mode];
      const bgOpaque = resolveOpaque(bgRaw, pageBg, map, mode);
      const fgOpaque = resolveOpaque(fgRaw, bgRaw, map, mode);

      if (!fgOpaque || !bgOpaque) {
        results.push({
          palette: paletteName,
          mode,
          fg: fgName,
          bg: bgName,
          role,
          minRatio,
          ratio: null,
          pass: false,
          error: "unparseable color",
          fgValue: fgRaw,
          bgValue: bgRaw,
        });
        continue;
      }

      const ratio = contrastRatio(fgOpaque, bgOpaque);
      results.push({
        palette: paletteName,
        mode,
        fg: fgName,
        bg: bgName,
        role,
        minRatio,
        ratio: Math.round(ratio * 100) / 100,
        pass: ratio >= minRatio,
        fgValue: fgRaw,
        bgValue: bgRaw,
      });
    }
  }

  return results;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const available = Object.keys(ThemeTokens.palettes || {});
  if (!ThemeTokens.palettes || !ThemeTokens.palettes[opts.palette]) {
    console.error(
      `Unknown palette "${opts.palette}". Available: ${available.join(", ") || "(none)"}`
    );
    process.exitCode = 1;
    return;
  }

  const results = auditPalette(opts.palette);
  const failures = results.filter((r) => !r.pass);
  const summary = {
    scannedAt: new Date().toISOString(),
    standard: "WCAG 2.1 AA",
    palette: opts.palette,
    thresholds: { normalText: AA_NORMAL, uiChrome: AA_UI },
    totalPairs: results.length,
    passed: results.length - failures.length,
    failed: failures.length,
    results,
    failures,
  };

  if (opts.write) {
    const outPath = path.join(ROOT, opts.write);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + "\n");
    console.error(`Wrote ${opts.write}`);
  }

  if (opts.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Theme contrast audit (${opts.palette}) — WCAG AA`);
    console.log("==============================================");
    console.log(`Pairs checked: ${summary.totalPairs}`);
    console.log(`Passed: ${summary.passed}`);
    console.log(`Failed: ${summary.failed}`);
    console.log("");
    for (const r of results) {
      const mark = r.pass ? "PASS" : "FAIL";
      const ratio = r.ratio == null ? "n/a" : `${r.ratio}:1`;
      console.log(
        `  [${mark}] ${r.mode}  ${r.fg} on ${r.bg}  ${ratio} (need ≥${r.minRatio}) — ${r.role}`
      );
      if (!r.pass) {
        console.log(`         values: ${r.fgValue} / ${r.bgValue}${r.error ? ` (${r.error})` : ""}`);
      }
    }
    if (failures.length === 0) {
      console.log("\nPASS: all audited pairs meet WCAG AA thresholds");
    } else {
      console.log("\nFAIL: adjust failing tokens in theme-tokens.css and src/theme/tokens.js");
    }
  }

  if (failures.length > 0) process.exitCode = 1;
}

main();
