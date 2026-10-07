#!/usr/bin/env node
// scripts/validate-content.mjs — content integrity gate for src/data/.
//
// Reads every .ts / .json data file under src/data/ and exits non-zero when:
//   * a duplicate id appears inside one exported collection
//   * a record is missing both `title` and `name`
//   * an empty object appears anywhere in the data
// Every problem is printed with the file, collection and record so the fix is
// obvious. Ids are scoped per exported collection: the same id may legitimately
// name different entities in different collections (e.g. an activity and its
// club both use 'speaking-club').
//
// Wired as the FIRST step of `npm run build:static`; also runnable on its own
// via `npm run validate:content`.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');

const errors = [];
const fail = (message) => errors.push(message);

/** Load a data module's exports. .json parses directly; .ts is type-stripped
 *  and evaluated from a temp file so the real object literals are inspected. */
async function loadModule(file) {
  if (file.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  let code = fs.readFileSync(file, 'utf8');
  // Type-only imports and re-exports pull in ../types and sibling modules;
  // neither is needed to inspect the literal data.
  code = code.replace(/^import\s+[^;]*?from\s+['"][^'"]+['"];?[ \t]*$/gm, '');
  code = code.replace(/^export\s*\{[^}]*\}\s*from\s+['"][^'"]+['"];?[ \t]*$/gm, '');
  // Vite-only global; replace with an empty base so template literals evaluate.
  code = code.replace(/import\.meta\.env\.BASE_URL/g, "''");
  const js = stripTypeScriptTypes(code, { mode: 'strip' });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-content-'));
  const tmp = path.join(tmpDir, `${path.basename(file)}.mjs`);
  fs.writeFileSync(tmp, js);
  try {
    return await import(pathToFileURL(tmp).href);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

/** Report any empty object nested under `value`, with a readable path. */
function scanNested(value, where) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => scanNested(item, `${where}[${i}]`));
  } else if (value && typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      fail(`${where}: empty object`);
      return;
    }
    for (const [key, child] of Object.entries(value)) scanNested(child, `${where}.${key}`);
  }
}

/** Validate one exported value: arrays are collections of records, plain
 *  objects are single records. */
function validateValue(label, value) {
  if (Array.isArray(value)) {
    const seen = new Set();
    value.forEach((row, i) => {
      if (!row || typeof row !== 'object' || Array.isArray(row)) return;
      const where = `${label}[${i}]`;
      if (Object.keys(row).length === 0) {
        fail(`${where}: empty object`);
        return;
      }
      if ('id' in row) {
        const id = String(row.id);
        if (seen.has(id)) fail(`${label}: duplicate id '${id}'`);
        seen.add(id);
        const hasTitle = typeof row.title === 'string' && row.title.trim() !== '';
        const hasName = typeof row.name === 'string' && row.name.trim() !== '';
        if (!hasTitle && !hasName) {
          fail(`${where} (id '${id}'): missing required field (title or name)`);
        }
      }
      scanNested(row, where);
    });
  } else if (value && typeof value === 'object') {
    if (Object.keys(value).length === 0) fail(`${label}: empty object`);
    scanNested(value, label);
  }
}

async function main() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((name) => /\.(ts|json)$/.test(name))
    .sort();
  if (files.length === 0) {
    console.error(`[validate-content] no data files found in ${DATA_DIR}`);
    process.exit(1);
  }

  for (const file of files) {
    let mod;
    try {
      mod = await loadModule(path.join(DATA_DIR, file));
    } catch (err) {
      fail(`${file}: failed to load (${err && err.message ? err.message : err})`);
      continue;
    }
    for (const [name, value] of Object.entries(mod)) {
      validateValue(`${file} -> ${name}`, value);
    }
  }

  if (errors.length) {
    for (const line of errors) console.error(`[validate-content] ${line}`);
    console.error(`[validate-content] FAIL: ${errors.length} problem(s) found`);
    process.exit(1);
  }
  console.log(`[validate-content] OK: ${files.length} data file(s) validated`);
}

main().catch((err) => {
  console.error(`[validate-content] FAIL: ${err && err.message ? err.message : err}`);
  process.exit(1);
});
