#!/usr/bin/env node
/**
 * Bulk image optimizer for kocaeli-social-hub.
 * Uses sharp to produce WebP variants at widths 400, 800, 1200 (never upscale),
 * plus a 16px LQIP data URI per image.
 * Writes manifest.json and verifies every output.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = '/tmp/opencode/kocaeli-social-hub/public/images';
const OUT_DIR = '/tmp/opencode/kocaeli-social-hub/public/images/optimized';
const WIDTHS = [400, 800, 1200];
const LQIP_WIDTH = 16;
const QUALITY = 80;

// Collect all local image files (jpg, jpeg, png only)
function findImages(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findImages(full));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

// Convert a source path to a relative path with dashes
// e.g. /tmp/.../public/images/events/biblo-boyama.jpeg -> events/biblo-boyama
function toRelPath(srcPath) {
  const rel = path.relative(SRC_DIR, srcPath);
  const ext = path.extname(rel);
  return path.join(path.dirname(rel), path.basename(rel, ext))
    .replace(/\\/g, '-');  // normalize slashes to dashes for flat naming
}

async function processImage(srcPath) {
  const relPath = toRelPath(srcPath);
  const outDir = path.join(OUT_DIR, relPath);
  fs.mkdirSync(outDir, { recursive: true });

  const meta = await sharp(srcPath).metadata();
  const origW = meta.width;
  const origH = meta.height;
  const origBytes = fs.statSync(srcPath).size;

  const variants = [];

  // Generate width variants (skip if source is narrower)
  for (const w of WIDTHS) {
    if (w >= origW) continue; // never upscale
    const fileName = `${relPath.split('/').pop()}-${w}.webp`;
    const outPath = path.join(outDir, fileName);
    await sharp(srcPath)
      .resize(w, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);

    const vMeta = await sharp(outPath).metadata();
    const vBytes = fs.statSync(outPath).size;
    variants.push({
      path: `/images/optimized/${relPath}/${fileName}`,
      w: vMeta.width,
      h: vMeta.height,
      bytes: vBytes,
    });
  }

  // LQIP: 16px wide WebP as base64 data URI
  const lqipBuffer = await sharp(srcPath)
    .resize(LQIP_WIDTH, null, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 40 })
    .toBuffer();
  const lqipDataUri = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;

  return {
    original: `/images/${path.relative(SRC_DIR, srcPath)}`,
    width: origW,
    height: origH,
    origBytes,
    variants,
    lqip: lqipDataUri,
  };
}

async function main() {
  const images = findImages(SRC_DIR);
  console.log(`Found ${images.length} images.`);

  const manifest = [];
  const table = [];

  for (const img of images) {
    const entry = await processImage(img);
    manifest.push({
      original: entry.original,
      width: entry.width,
      height: entry.height,
      variants: entry.variants,
      lqip: entry.lqip,
    });

    const origShort = path.basename(img);
    const varBytes = {};
    for (const v of entry.variants) {
      const wMatch = v.path.match(/-(\d+)\.webp$/);
      if (wMatch) varBytes[wMatch[1]] = v.bytes;
    }
    const lqipBytes = Buffer.byteLength(entry.lqip.replace('data:image/webp;base64,', ''), 'base64');
    table.push({
      original: origShort,
      origBytes: entry.origBytes,
      w400: varBytes['400'] || '-',
      w800: varBytes['800'] || '-',
      w1200: varBytes['1200'] || '-',
      lqipBytes,
    });
  }

  // Write manifest
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifestPath = path.join(OUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`Manifest written: ${manifestPath}`);

  // Print table
  console.log('\n=== SIZE TABLE ===');
  console.log(
    'Original'.padEnd(30) +
    'Orig(B)'.padStart(10) +
    '400(B)'.padStart(10) +
    '800(B)'.padStart(10) +
    '1200(B)'.padStart(10) +
    'LQIP(B)'.padStart(10) +
    'Saved(B)'.padStart(12)
  );
  console.log('-'.repeat(92));

  let totalSaved = 0;
  let totalGenerated = 0;

  for (const row of table) {
    const sizes = [row.w400, row.w800, row.w1200].filter(s => s !== '-');
    const minVariant = sizes.length > 0 ? Math.min(...sizes) : row.origBytes;
    const saved = Math.max(0, row.origBytes - minVariant);
    totalSaved += saved;
    totalGenerated += sizes.length + 1; // +1 for LQIP
    console.log(
      row.original.padEnd(30) +
      String(row.origBytes).padStart(10) +
      String(row.w400).padStart(10) +
      String(row.w800).padStart(10) +
      String(row.w1200).padStart(10) +
      String(row.lqipBytes).padStart(10) +
      String(saved).padStart(12)
    );
  }

  console.log('-'.repeat(92));
  console.log(`Total generated: ${totalGenerated} files + ${table.length} LQIPs + manifest.json`);
  console.log(`Total saved (vs original): ${totalSaved} bytes`);

  // Verification pass
  console.log('\n=== VERIFICATION ===');
  let verifyPass = 0;
  let verifyFail = 0;
  for (const entry of manifest) {
    for (const v of entry.variants) {
      const fullPath = path.join('/tmp/opencode/kocaeli-social-hub', v.path);
      if (!fs.existsSync(fullPath)) {
        console.log(`FAIL missing: ${v.path}`);
        verifyFail++;
        continue;
      }
      const vMeta = await sharp(fullPath).metadata();
      if (vMeta.width !== v.w) {
        console.log(`FAIL width mismatch: ${v.path} expected ${v.w} got ${vMeta.width}`);
        verifyFail++;
      } else {
        verifyPass++;
      }
    }
  }
  console.log(`Verification: ${verifyPass} passed, ${verifyFail} failed out of ${manifest.reduce((a, m) => a + m.variants.length, 0)} variants`);
}

main().catch(err => { console.error(err); process.exit(1); });
