// Generates small WebP versions of every JPG/PNG in /assets into /assets/opt.
// Run with:  npm run optimize
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC_DIR = 'assets';
const OUT_DIR = path.join('assets', 'opt');
const WIDTHS = [640, 1280, 2048]; // must match OPT_WIDTHS in shared.js
const QUALITY = 78;
const IMAGE_EXT = /\.(jpe?g|png)$/i;

// Must produce the same name as optimizedImage() in shared.js
const slugify = (file) =>
  file
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => IMAGE_EXT.test(f));
const seen = new Map();

for (const file of files) {
  const slug = slugify(file);
  if (seen.has(slug)) {
    throw new Error(`"${file}" and "${seen.get(slug)}" both become "${slug}". Rename one.`);
  }
  seen.set(slug, file);

  const input = path.join(SRC_DIR, file);
  const inputTime = (await stat(input)).mtimeMs;
  let made = 0;

  for (const width of WIDTHS) {
    const output = path.join(OUT_DIR, `${slug}-${width}.webp`);
    const existing = await stat(output).catch(() => null);
    if (existing && existing.mtimeMs >= inputTime) continue; // already up to date

    await sharp(input, { failOn: 'none' })
      .rotate() // respect camera orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(output);
    made += 1;
  }
  console.log(made ? `optimized ${file}` : `skipped   ${file} (up to date)`);
}
console.log('Done.');
