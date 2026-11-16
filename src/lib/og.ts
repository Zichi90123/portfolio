// Open Graph images (1200x630 PNG), rendered at build time.
// satori turns the layout into an SVG with the text as paths (same result on every machine);
// sharp rasterizes it. The project cover is embedded as a PNG data URI.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export const OG_SIZE = { width: 1200, height: 630 } as const;

const BG = '#1e2230'; // same background as the project covers
const ACCENT = '#7aa7ff';

// Paths from the project root: this module is bundled into dist/ at build time, so
// paths relative to import.meta.url would not point at the sources.
const ROOT = process.cwd();
const fontFile = (weight: 400 | 700) =>
  join(ROOT, 'node_modules', '@fontsource', 'inter', 'files', `inter-latin-${weight}-normal.woff`);

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700; style: 'normal' }[]> | undefined;
function loadFonts() {
  fonts ??= Promise.all(
    ([400, 700] as const).map(async (weight) => ({
      name: 'Inter',
      data: await readFile(fontFile(weight)),
      weight,
      style: 'normal' as const,
    })),
  );
  return fonts;
}

// Minimal hyperscript for satori's React-like element tree.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children, ...extra },
});

/** PNG data URI of a file in public/ (e.g. "/media/nextep.webp"), resized to fit `width`. */
async function publicImage(path: string, width: number) {
  const file = join(ROOT, 'public', ...path.split('/').filter(Boolean));
  const png = await sharp(file).resize({ width }).png().toBuffer();
  return `data:image/png;base64,${png.toString('base64')}`;
}

export interface OgInput {
  title: string;
  description: string;
  kicker: string; // small line above the title
  tags?: readonly string[];
  cover?: string; // public path of a 16:9 image
}

export async function renderOg({ title, description, kicker, tags = [], cover }: OgInput): Promise<Buffer> {
  const pad = 64;
  const gap = 48;
  const coverWidth = 500;
  const coverSrc = cover ? await publicImage(cover, coverWidth * 2) : undefined;

  const text = h(
    'div',
    {
      flexDirection: 'column',
      justifyContent: 'center',
      // Fixed width so the cover keeps its size and stays inside the padding.
      width: OG_SIZE.width - 2 * pad - (coverSrc ? coverWidth + gap : 0),
      marginRight: coverSrc ? gap : 0,
      flexShrink: 0,
    },
    [
      h('div', { fontSize: 26, color: ACCENT, fontWeight: 700, letterSpacing: 0.5 }, kicker),
      h(
        'div',
        { fontSize: title.length > 18 ? 58 : 70, color: '#ffffff', fontWeight: 700, marginTop: 14, lineHeight: 1.1 },
        title,
      ),
      h(
        'div',
        { fontSize: 28, color: '#cbd5e1', marginTop: 22, lineHeight: 1.4, maxHeight: 4 * 28 * 1.4, overflow: 'hidden' },
        description,
      ),
      tags.length > 0 &&
        h(
          'div',
          { flexWrap: 'wrap', gap: 10, marginTop: 28, maxHeight: 2 * 44 + 10, overflow: 'hidden' },
          tags.slice(0, 6).map((t) =>
            h('div', { fontSize: 20, color: '#e2e8f0', backgroundColor: '#2d3346', borderRadius: 8, padding: '6px 14px' }, t),
          ),
        ),
    ].filter(Boolean),
  );

  const root = h(
    'div',
    {
      width: '100%',
      height: '100%',
      backgroundColor: BG,
      padding: pad,
      alignItems: 'center',
      fontFamily: 'Inter',
    },
    [
      text,
      coverSrc &&
        h('img', { width: coverWidth, height: (coverWidth * 9) / 16, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }, undefined, {
          src: coverSrc,
          width: coverWidth,
          height: (coverWidth * 9) / 16,
        }),
    ].filter(Boolean),
  );

  // satori's types expect React elements; the plain object tree is what it consumes at runtime.
  const svg = await satori(root as unknown as Parameters<typeof satori>[0], { ...OG_SIZE, fonts: await loadFonts() });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
