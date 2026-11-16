// Build-time Open Graph images, one per page language:
// /og/<project>.png and /og/default.png (Italian), /og/en/<project>.png and /og/en/default.png (English).
import type { APIRoute } from 'astro';
import { SITE } from '../../consts';
import { LANGS, t } from '../../i18n';
import { getProjects } from '../../lib/projects';
import { renderOg, type OgInput } from '../../lib/og';

export async function getStaticPaths() {
  const pages: { params: { slug: string }; props: OgInput }[] = [];
  for (const lang of LANGS) {
    const ui = t(lang);
    const prefix = lang === 'it' ? '' : `${lang}/`;
    for (const p of await getProjects(lang)) {
      pages.push({
        params: { slug: `${prefix}${p.id}` },
        props: {
          title: p.data.title,
          description: p.data.summary,
          kicker: ui.ogKickerProjects,
          tags: p.data.tech,
          cover: p.data.cover,
        },
      });
    }
    pages.push({
      params: { slug: `${prefix}default` },
      props: { title: SITE.name, description: ui.tagline, kicker: 'andreazichittella.com' },
    });
  }
  return pages;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as OgInput);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
