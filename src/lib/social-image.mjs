// Renders a 1200x630 social image. Satori turns real Cormorant glyphs into SVG paths,
// sharp rasterizes the result, so no system font and no browser are involved.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

const font = (weight, style) =>
  readFileSync(
    join(process.cwd(), 'node_modules/@fontsource/cormorant-garamond/files', `cormorant-garamond-latin-${weight}-${style}.woff`),
  );

const fonts = [
  { name: 'Cormorant', data: font(500, 'normal'), weight: 500, style: 'normal' },
  { name: 'Cormorant', data: font(500, 'italic'), weight: 500, style: 'italic' },
];

const box = (style, children) => ({ type: 'div', props: { style, children } });

/** @returns {Promise<Uint8Array<ArrayBuffer>>} */
export async function socialImage({ title, kicker }) {
  const svg = await satori(
    box(
      { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#F7F3EA', fontFamily: 'Cormorant' },
      [
        box({ height: 16, background: '#0E3B43', borderBottom: '2px solid #C49A4A' }),
        box({ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 84px 58px' }, [
          box({ display: 'flex', flexDirection: 'column' }, [
            box({ fontStyle: 'italic', fontSize: 36, color: '#8A5510', marginBottom: 18 }, kicker),
            box({ fontSize: title.length > 52 ? 76 : 88, lineHeight: 1.04, letterSpacing: -1, color: '#0E3B43', textWrap: 'balance' }, title),
          ]),
          box({ display: 'flex', flexDirection: 'column' }, [
            box({ width: 64, height: 1, background: '#C49A4A', marginBottom: 18 }),
            box({ fontStyle: 'italic', fontSize: 36, color: '#0E3B43' }, 'Richard Ertl'),
          ]),
        ]),
      ],
    ),
    { width: 1200, height: 630, fonts },
  );
  return new Uint8Array(await sharp(Buffer.from(svg)).png().toBuffer());
}
