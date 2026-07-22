#!/usr/bin/env node
/**
 * Theme / color usage auditor for the To-Do List app (REQ-CTTCTB / prior CTTTPA).
 *
 * Scans CSS/HTML/JS/SVG for hardcoded colors and CSS custom properties.
 * After a centralized token file exists, pass --token-file to
 * enforce zero hardcoded hex/rgb outside that file.
 *
 * Pass --flag-hues to list non-grayscale (hued) colors — migration
 * targets for the black-and-white (monochrome) palette.
 *
 * Usage:
 *   node scripts/audit-theme-colors.js
 *   node scripts/audit-theme-colors.js --token-file=theme-tokens.css
 *   node scripts/audit-theme-colors.js --flag-hues
 *   node scripts/audit-theme-colors.js --json
 *   node scripts/audit-theme-colors.js --write=docs/theme-color-audit.snapshot.json
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_TARGETS = [
  "theme-tokens.css",
  "src/theme/tokens.js",
  "src/theme/theme-provider.js",
  "style.css",
  "index.html",
  "index.js",
  "scroll.js",
  "scroll_img.svg",
];

/** Hex / rgb(a) / hsl(a) only — named colors are noisy inside token names like --primary-blue. */
const COLOR_RE =
  /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\s*[^)]+\)|hsla?\(\s*[^)]+\)/gi;
const VAR_DEF_RE = /--([a-zA-Z][\w-]*)\s*:/g;
const VAR_USE_RE = /var\(\s*(--[a-zA-Z][\w-]*)/g;

function parseArgs(argv) {
  const opts = {
    json: false,
    tokenFile: null,
    write: null,
    flagHues: false,
    targets: DEFAULT_TARGETS,
  };
  for (const arg of argv) {
    if (arg === "--json") opts.json = true;
    else if (arg === "--flag-hues") opts.flagHues = true;
    else if (arg.startsWith("--token-file=")) opts.tokenFile = arg.slice(13);
    else if (arg.startsWith("--write=")) opts.write = arg.slice(8);
  }
  return opts;
}

function isFalsePositive(line, matchIndex, value) {
  // HTML numeric entities like &#9888; look like short hex colors.
  if (value.startsWith("#") && matchIndex > 0 && line[matchIndex - 1] === "&") {
    return true;
  }
  return false;
}

/**
 * Parse a color string into {r,g,b,a} or null if unparseable.
 * @param {string} value
 * @returns {{r:number,g:number,b:number,a:number}|null}
 */
function parseColorChannels(value) {
  const v = value.trim().toLowerCase();
  if (v.startsWith("#")) {
    let hex = v.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .slice(0, 3)
        .split("")
        .map((c) => c + c)
        .join("");
    } else if (hex.length === 8) {
      hex = hex.slice(0, 6);
    }
    if (hex.length !== 6 || /[^0-9a-f]/.test(hex)) return null;
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgb = v.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (rgb) {
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] !== undefined ? Number(rgb[4]) : 1,
    };
  }
  const hsl = v.match(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/
  );
  if (hsl) {
    const h = Number(hsl[1]);
    const s = Number(hsl[2]) / 100;
    const l = Number(hsl[3]) / 100;
    const a = hsl[4] !== undefined ? Number(hsl[4]) : 1;
    // Convert HSL → RGB for hue check
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let rp = 0;
    let gp = 0;
    let bp = 0;
    if (h < 60) {
      rp = c;
      gp = x;
    } else if (h < 120) {
      rp = x;
      gp = c;
    } else if (h < 180) {
      gp = c;
      bp = x;
    } else if (h < 240) {
      gp = x;
      bp = c;
    } else if (h < 300) {
      rp = x;
      bp = c;
    } else {
      rp = c;
      bp = x;
    }
    return {
      r: Math.round((rp + m) * 255),
      g: Math.round((gp + m) * 255),
      b: Math.round((bp + m) * 255),
      a,
    };
  }
  return null;
}

/**
 * True when the color has a perceptible hue (not grayscale / pure black-white).
 * Allows a small channel delta for rounding.
 * @param {string} value
 * @returns {boolean}
 */
function hasHue(value) {
  const ch = parseColorChannels(value);
  if (!ch) return false;
  const max = Math.max(ch.r, ch.g, ch.b);
  const min = Math.min(ch.r, ch.g, ch.b);
  return max - min > 2;
}

function scanFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    return { file: relPath, missing: true, colors: [], varDefs: [], varUses: [] };
  }

  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);
  const colors = [];
  const varDefs = [];
  const varUses = [];

  lines.forEach((line, i) => {
    const re = new RegExp(COLOR_RE.source, COLOR_RE.flags);
    let m;
    while ((m = re.exec(line)) !== null) {
      if (isFalsePositive(line, m.index, m[0])) continue;
      colors.push({
        file: relPath,
        line: i + 1,
        value: m[0],
        column: m.index + 1,
        hasHue: hasHue(m[0]),
      });
    }
  });

  let vm;
  while ((vm = VAR_DEF_RE.exec(text)) !== null) {
    const before = text.slice(0, vm.index);
    const line = before.split(/\r?\n/).length;
    varDefs.push({ file: relPath, line, name: `--${vm[1]}` });
  }
  while ((vm = VAR_USE_RE.exec(text)) !== null) {
    const before = text.slice(0, vm.index);
    const line = before.split(/\r?\n/).length;
    varUses.push({ file: relPath, line, name: vm[1] });
  }

  return { file: relPath, missing: false, colors, varDefs, varUses };
}

function summarize(results, tokenFile) {
  const present = results.filter((r) => !r.missing);
  const colors = present.flatMap((r) => r.colors);
  const varDefs = present.flatMap((r) => r.varDefs);
  const varUses = present.flatMap((r) => r.varUses);

  const unique = new Map();
  for (const c of colors) {
    const key = c.value.toLowerCase().replace(/\s+/g, "");
    if (!unique.has(key)) {
      unique.set(key, {
        value: c.value,
        count: 0,
        locations: [],
        hasHue: c.hasHue,
      });
    }
    const entry = unique.get(key);
    entry.count += 1;
    if (entry.locations.length < 10) {
      entry.locations.push(`${c.file}:${c.line}`);
    }
  }

  const byFile = {};
  for (const c of colors) {
    byFile[c.file] = (byFile[c.file] || 0) + 1;
  }

  const uniqueVarNames = [...new Set(varDefs.map((d) => d.name))].sort();
  const uniqueVarUses = [...new Set(varUses.map((u) => u.name))].sort();

  let outsideTokenFile = colors;
  if (tokenFile) {
    const normalized = path.normalize(tokenFile);
    const jsTwin = path.normalize("src/theme/tokens.js");
    outsideTokenFile = colors.filter((c) => {
      const f = path.normalize(c.file);
      // JS token module mirrors CSS — not a consumer violation.
      if (f === normalized || f === jsTwin) return false;
      return true;
    });
  }

  const huedColors = [...unique.values()].filter((c) => c.hasHue);
  const grayscaleColors = [...unique.values()].filter((c) => !c.hasHue);

  return {
    scannedAt: new Date().toISOString(),
    filesScanned: present.map((r) => r.file),
    missingFiles: results.filter((r) => r.missing).map((r) => r.file),
    totalOccurrences: colors.length,
    uniqueColors: unique.size,
    byFile,
    cssVariableDefinitions: varDefs,
    cssVariableUsages: varUses,
    uniqueCssVariablesDefined: uniqueVarNames,
    uniqueCssVariablesUsed: uniqueVarUses,
    tokenFile: tokenFile || null,
    hardcodedOutsideTokenFile: outsideTokenFile.length,
    colors: [...unique.values()].sort((a, b) => b.count - a.count),
    violations: outsideTokenFile,
    huedColorCount: huedColors.length,
    grayscaleColorCount: grayscaleColors.length,
    huedColors: huedColors.sort((a, b) => b.count - a.count),
  };
}

function printHuman(summary, targets, flagHues) {
  console.log("Theme color audit");
  console.log("=================");
  console.log(`Scanned: ${targets.join(", ")}`);
  console.log(`Total color occurrences: ${summary.totalOccurrences}`);
  console.log(`Unique color values: ${summary.uniqueColors}`);
  console.log(
    `  Hued (non-grayscale): ${summary.huedColorCount}  |  Grayscale: ${summary.grayscaleColorCount}`
  );
  console.log(
    `CSS custom property definitions: ${summary.cssVariableDefinitions.length} (${summary.uniqueCssVariablesDefined.length} unique)`
  );
  console.log(
    `CSS custom property usages: ${summary.cssVariableUsages.length} (${summary.uniqueCssVariablesUsed.length} unique)`
  );
  console.log("\nOccurrences by file:");
  for (const [file, count] of Object.entries(summary.byFile)) {
    console.log(`  ${file}: ${count}`);
  }
  console.log("\nTop colors:");
  for (const c of summary.colors.slice(0, 25)) {
    const hueTag = c.hasHue ? " [HUE]" : " [gray]";
    console.log(`  ${c.count}×  ${c.value}${hueTag}  (${c.locations[0]})`);
  }
  if (flagHues) {
    console.log("\nHued colors (monochrome migration targets):");
    if (summary.huedColors.length === 0) {
      console.log("  (none)");
    } else {
      for (const c of summary.huedColors.slice(0, 40)) {
        console.log(`  ${c.count}×  ${c.value}  (${c.locations[0]})`);
      }
      if (summary.huedColors.length > 40) {
        console.log(`  … and ${summary.huedColors.length - 40} more`);
      }
    }
  }
  if (summary.tokenFile) {
    console.log(
      `\nHardcoded colors outside ${summary.tokenFile} (excl. src/theme/tokens.js): ${summary.hardcodedOutsideTokenFile}`
    );
    if (summary.hardcodedOutsideTokenFile === 0) {
      console.log("PASS: no hardcoded colors outside the token sources");
    } else {
      console.log("FAIL: hardcoded colors remain outside the token sources");
      for (const v of summary.violations.slice(0, 40)) {
        console.log(`  ${v.file}:${v.line}  ${v.value}`);
      }
    }
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const targets = [...opts.targets];
  if (opts.tokenFile && !targets.includes(opts.tokenFile)) {
    targets.push(opts.tokenFile);
  }

  const results = targets.map((file) => scanFile(file));
  const summary = summarize(results, opts.tokenFile);

  if (opts.write) {
    const outPath = path.join(ROOT, opts.write);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + "\n");
    console.error(`Wrote ${opts.write}`);
  }

  if (opts.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    printHuman(summary, targets, opts.flagHues);
  }

  if (opts.tokenFile && summary.hardcodedOutsideTokenFile > 0) {
    process.exitCode = 1;
  }
}

main();
