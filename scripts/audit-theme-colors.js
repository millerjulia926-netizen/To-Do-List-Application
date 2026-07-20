#!/usr/bin/env node
/**
 * Theme / color usage auditor for the To-Do List app (WO-01).
 *
 * Scans CSS/HTML/JS/SVG for hardcoded colors and CSS custom properties.
 * After a centralized token file exists (WO-02+), pass --token-file to
 * enforce AC-CTTOTA-002.3 (zero hardcoded hex outside that file).
 *
 * Usage:
 *   node scripts/audit-theme-colors.js
 *   node scripts/audit-theme-colors.js --token-file=tokens.css
 *   node scripts/audit-theme-colors.js --json
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_TARGETS = [
  "style.css",
  "index.html",
  "index.js",
  "scroll.js",
  "scroll_img.svg",
];

const COLOR_RE =
  /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\s*[^)]+\)|hsla?\(\s*[^)]+\)|\b(?:white|black|green|red|blue|transparent)\b/gi;
const VAR_DEF_RE = /--([a-zA-Z][\w-]*)\s*:/g;
const VAR_USE_RE = /var\(\s*(--[a-zA-Z][\w-]*)/g;

function parseArgs(argv) {
  const opts = { json: false, tokenFile: null, targets: DEFAULT_TARGETS };
  for (const arg of argv) {
    if (arg === "--json") opts.json = true;
    else if (arg.startsWith("--token-file=")) opts.tokenFile = arg.slice(13);
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

function scanFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return { colors: [], varDefs: [], varUses: [] };

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
      colors.push({ file: relPath, line: i + 1, value: m[0], column: m.index + 1 });
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

  return { colors, varDefs, varUses };
}

function summarize(results, tokenFile) {
  const colors = results.flatMap((r) => r.colors);
  const varDefs = results.flatMap((r) => r.varDefs);
  const varUses = results.flatMap((r) => r.varUses);

  const unique = new Map();
  for (const c of colors) {
    const key = c.value.toLowerCase().replace(/\s+/g, "");
    if (!unique.has(key)) {
      unique.set(key, { value: c.value, count: 0, locations: [] });
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

  let outsideTokenFile = colors;
  if (tokenFile) {
    const normalized = path.normalize(tokenFile);
    outsideTokenFile = colors.filter(
      (c) => path.normalize(c.file) !== normalized
    );
  }

  return {
    scannedAt: new Date().toISOString(),
    filesScanned: results.map((r) => r.file).filter(Boolean),
    totalOccurrences: colors.length,
    uniqueColors: unique.size,
    byFile,
    cssVariableDefinitions: varDefs,
    cssVariableUsages: varUses,
    tokenFile: tokenFile || null,
    hardcodedOutsideTokenFile: outsideTokenFile.length,
    colors: [...unique.values()].sort((a, b) => b.count - a.count),
    violations: outsideTokenFile,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const targets = [...opts.targets];
  if (opts.tokenFile && !targets.includes(opts.tokenFile)) {
    targets.push(opts.tokenFile);
  }

  const results = targets.map((file) => ({ file, ...scanFile(file) }));
  const summary = summarize(results, opts.tokenFile);

  if (opts.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log("Theme color audit");
    console.log("=================");
    console.log(`Scanned: ${targets.join(", ")}`);
    console.log(`Total color occurrences: ${summary.totalOccurrences}`);
    console.log(`Unique color values: ${summary.uniqueColors}`);
    console.log(
      `CSS custom property definitions: ${summary.cssVariableDefinitions.length}`
    );
    console.log(
      `CSS custom property usages: ${summary.cssVariableUsages.length}`
    );
    console.log("\nOccurrences by file:");
    for (const [file, count] of Object.entries(summary.byFile)) {
      console.log(`  ${file}: ${count}`);
    }
    console.log("\nTop colors:");
    for (const c of summary.colors.slice(0, 25)) {
      console.log(`  ${c.count}×  ${c.value}  (${c.locations[0]})`);
    }
    if (opts.tokenFile) {
      console.log(
        `\nHardcoded colors outside ${opts.tokenFile}: ${summary.hardcodedOutsideTokenFile}`
      );
      if (summary.hardcodedOutsideTokenFile === 0) {
        console.log("PASS: AC-CTTOTA-002.3 (zero hardcoded colors outside token file)");
      } else {
        console.log("FAIL: hardcoded colors remain outside the token file");
        for (const v of summary.violations.slice(0, 40)) {
          console.log(`  ${v.file}:${v.line}  ${v.value}`);
        }
      }
    }
  }

  if (opts.tokenFile && summary.hardcodedOutsideTokenFile > 0) {
    process.exitCode = 1;
  }
}

main();
