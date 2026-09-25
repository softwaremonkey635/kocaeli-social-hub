import sharp from 'sharp';

const SRC = 'public/images/logo/kocaeli-logo.jpeg';
const OUT = 'public';
const MASKABLE = 512;
const MASKABLE_INNER = 500;
const MASKABLE_BG = '#f7f8f8';

await sharp(SRC).resize(192, 192).png().toFile(`${OUT}/pwa-192x192.png`);
await sharp(SRC).resize(512, 512).png().toFile(`${OUT}/pwa-512x512.png`);
await sharp(SRC).resize(180, 180).png().toFile(`${OUT}/apple-touch-icon.png`);

const inner = await sharp(SRC).resize(MASKABLE_INNER, MASKABLE_INNER).png().toBuffer();
await sharp({
  create: {
    width: MASKABLE,
    height: MASKABLE,
    channels: 3,
    background: MASKABLE_BG,
  },
})
  .composite([{input: inner, gravity: 'center'}])
  .png()
  .toFile(`${OUT}/pwa-maskable-512x512.png`);

console.log('wrote pwa-192x192.png pwa-512x512.png pwa-maskable-512x512.png apple-touch-icon.png');
